/**
 * CivicConnect - Drupal 11 JSON:API Client
 * 
 * Production-ready client library with ISR revalidation, typed interfaces,
 * robust error handling, and realistic mock fallbacks for standalone portfolio demonstrations.
 * Configured for City of Harborview Council Services.
 */

const DRUPAL_BASE_URL = process.env.DRUPAL_BASE_URL || 'http://localhost:8080'

export interface DrupalService {
  id: string
  title: string
  body: { value: string; summary: string }
  field_service_category: { name: string }
  path: { alias: string }
  field_service_icon?: string
  changed: string
}

export interface DrupalNewsArticle {
  id: string
  title: string
  body: { value: string; summary: string }
  field_news_category?: { name: string }
  path: { alias: string }
  created: string
  changed: string
}

export interface DrupalEvent {
  id: string
  title: string
  body: { value: string; summary: string }
  field_event_date: string
  field_event_location?: string
  field_event_category?: { name: string }
  path: { alias: string }
}

/**
 * Extract clean slug from path alias or fallback to id
 */
export function extractSlug(pathAlias: string, id: string): string {
  if (!pathAlias) return id
  const cleaned = pathAlias.replace(/^\/(services|news|events)\//, '').replace(/^\//, '')
  return cleaned || id
}

/**
 * Generic fetcher for Drupal JSON:API endpoints with ISR revalidation
 */
async function fetchFromDrupal<T>(endpoint: string): Promise<T> {
  const url = `${DRUPAL_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json',
    },
    next: { revalidate: 60 }, // ISR: Revalidate every 60 seconds
  })

  if (!response.ok) {
    throw new Error(`Drupal API error: ${response.status} ${response.statusText} at ${endpoint}`)
  }

  return response.json()
}

/**
 * Transform JSON:API node with included terms into flattened DrupalService
 */
function normalizeService(item: any, included: any[] = []): DrupalService {
  const categoryRelId = item.relationships?.field_service_category?.data?.id
  const matchedTerm = included.find((inc: any) => inc.id === categoryRelId)
  const categoryName = matchedTerm?.attributes?.name || item.attributes?.field_service_category_name || 'General Council'

  return {
    id: item.id,
    title: item.attributes?.title || 'Untitled Service',
    body: {
      value: item.attributes?.body?.value || '',
      summary: item.attributes?.body?.summary || item.attributes?.body?.processed?.slice(0, 160) || '',
    },
    field_service_category: {
      name: categoryName,
    },
    path: {
      alias: item.attributes?.path?.alias || `/services/${item.id}`,
    },
    field_service_icon: item.attributes?.field_service_icon || '🏛️',
    changed: item.attributes?.changed || new Date().toISOString(),
  }
}

/**
 * Transform JSON:API node into flattened DrupalNewsArticle
 */
function normalizeNewsArticle(item: any, included: any[] = []): DrupalNewsArticle {
  const categoryRelId = item.relationships?.field_news_category?.data?.id
  const matchedTerm = included.find((inc: any) => inc.id === categoryRelId)
  const categoryName =
    matchedTerm?.attributes?.name ||
    (typeof item.attributes?.field_news_category === 'string' ? item.attributes.field_news_category : null) ||
    item.attributes?.field_news_category_name ||
    'Council News'

  const rawBody = item.attributes?.body?.value || item.attributes?.field_body || ''
  const summary =
    item.attributes?.body?.summary ||
    (rawBody ? rawBody.replace(/<[^>]*>?/gm, '').replace(/[\r\n]+/g, ' ').trim().slice(0, 160) + '...' : '')

  const generatedSlug = item.attributes?.title
    ? item.attributes.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    : item.id

  return {
    id: item.id,
    title: item.attributes?.title || 'Untitled News',
    body: {
      value: rawBody,
      summary: summary,
    },
    field_news_category: {
      name: categoryName,
    },
    path: {
      alias: item.attributes?.path?.alias || `/news/${generatedSlug}`,
    },
    created: item.attributes?.created || item.attributes?.changed || new Date().toISOString(),
    changed: item.attributes?.changed || new Date().toISOString(),
  }
}

/**
 * Transform JSON:API node into flattened DrupalEvent
 */
function normalizeEvent(item: any, included: any[] = []): DrupalEvent {
  const categoryRelId = item.relationships?.field_event_category?.data?.id
  const matchedTerm = included.find((inc: any) => inc.id === categoryRelId)
  const categoryName = matchedTerm?.attributes?.name || item.attributes?.field_event_category_name || 'Civic Event'

  return {
    id: item.id,
    title: item.attributes?.title || 'Untitled Event',
    body: {
      value: item.attributes?.body?.value || '',
      summary: item.attributes?.body?.summary || '',
    },
    field_event_date: item.attributes?.field_event_date || item.attributes?.created || new Date().toISOString(),
    field_event_location: item.attributes?.field_event_location || 'City of Harborview',
    field_event_category: {
      name: categoryName,
    },
    path: {
      alias: item.attributes?.path?.alias || `/events/${item.id}`,
    },
  }
}

/* =========================================================================
   PUBLIC API CONSUMPTION METHODS (WITH ISR & FALLBACK)
   ========================================================================= */

/**
 * Fetch all Council Services
 */
export async function getServices(): Promise<DrupalService[]> {
  try {
    const json = await fetchFromDrupal<any>('/jsonapi/node/service?include=field_service_category&sort=-changed')
    if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
      return json.data.map((item: any) => normalizeService(item, json.included || []))
    }
  } catch (error) {
    console.warn('[Drupal API] Could not fetch services from backend, serving mock data.', error instanceof Error ? error.message : error)
  }
  return MOCK_SERVICES
}

/**
 * Fetch a single Council Service by slug or ID
 */
export async function getService(slug: string): Promise<DrupalService | null> {
  try {
    const encoded = encodeURIComponent(slug)
    const json = await fetchFromDrupal<any>(
      `/jsonapi/node/service?filter[alias-filter][condition][path]=path.alias&filter[alias-filter][condition][value]=/services/${encoded}&include=field_service_category`
    )
    if (json?.data && json.data.length > 0) {
      return normalizeService(json.data[0], json.included || [])
    }
  } catch (error) {
    console.warn(`[Drupal API] Could not fetch service '${slug}', checking mock data.`)
  }

  // Fallback lookup in mock data
  const found = MOCK_SERVICES.find((service) => {
    const serviceSlug = extractSlug(service.path.alias, service.id)
    return serviceSlug.toLowerCase() === slug.toLowerCase() || service.id === slug
  })

  return found || null
}

/**
 * Fetch all News Articles
 */
export async function getNewsArticles(): Promise<DrupalNewsArticle[]> {
  try {
    const json = await fetchFromDrupal<any>('/jsonapi/node/news?sort=-created')
    if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
      return json.data.map((item: any) => normalizeNewsArticle(item, json.included || []))
    }
  } catch (error) {
    console.warn('[Drupal API] Could not fetch news from backend, serving mock data.', error instanceof Error ? error.message : error)
  }
  return MOCK_NEWS
}

/**
 * Fetch a single News Article by slug or ID
 */
export async function getNewsArticle(slug: string): Promise<DrupalNewsArticle | null> {
  try {
    const articles = await getNewsArticles()
    const found = articles.find((article) => {
      const articleSlug = extractSlug(article.path.alias, article.id)
      return articleSlug.toLowerCase() === slug.toLowerCase() || article.id === slug
    })
    if (found) return found
  } catch (error) {
    console.warn(`[Drupal API] Could not fetch news article '${slug}', checking mock data.`)
  }

  const found = MOCK_NEWS.find((article) => {
    const articleSlug = extractSlug(article.path.alias, article.id)
    return articleSlug.toLowerCase() === slug.toLowerCase() || article.id === slug
  })

  return found || null
}

/**
 * Fetch all upcoming Council Events
 */
export async function getEvents(): Promise<DrupalEvent[]> {
  try {
    const json = await fetchFromDrupal<any>('/jsonapi/node/event?include=field_event_category&sort=field_event_date')
    if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
      return json.data.map((item: any) => normalizeEvent(item, json.included || []))
    }
  } catch (error) {
    console.warn('[Drupal API] Could not fetch events from backend, serving mock data.', error instanceof Error ? error.message : error)
  }
  return MOCK_EVENTS
}

/* =========================================================================
   MOCK DATA (CITY OF HARBORVIEW REALISTIC CIVIC DATA)
   ========================================================================= */

export const MOCK_SERVICES: DrupalService[] = [
  {
    id: 'srv-001',
    title: 'Waste & Recycling Collection',
    body: {
      summary: 'Kerbside bin collection schedules, hard waste booking, green organics, and recycling sorting guidelines for Harborview households.',
      value: `
        <h3>Residential Waste & Recycling in Harborview</h3>
        <p>The City of Harborview operates a comprehensive kerbside collection service for over 120,000 households across Harborview, the coastal peninsula, and the northern suburbs. Our three-bin system ensures that valuable organic matter and recyclable resources are diverted from landfill.</p>
        
        <h4>Collection Bins & Colours</h4>
        <ul>
          <li><strong>Red Lid (General Waste):</strong> Collected fortnightly. For non-recyclable household rubbish.</li>
          <li><strong>Yellow Lid (Mixed Recycling):</strong> Collected fortnightly. Clean paper, cardboard, aluminium, steel cans, and rigid plastics 1 to 5.</li>
          <li><strong>Lime Green Lid (FOGO - Food Organics & Garden Organics):</strong> Collected weekly. Fruit, vegetables, meat scraps, garden cuttings, and certified compostable liners.</li>
        </ul>

        <h4>Book a Hard Waste Collection</h4>
        <p>Every eligible residential property is entitled to two free booked hard waste collections per calendar year (up to 3 cubic metres per collection). Items accepted include mattresses, whitegoods, electronics, furniture, and scrap metal.</p>

        <div class="info-box">
          <strong>Need immediate assistance?</strong> Contact the City Waste Customer Care team at <strong>(03) 5272 5272</strong> or submit a missed bin report via CivicConnect online.
        </div>
      `,
    },
    field_service_category: { name: 'Waste & Environment' },
    path: { alias: '/services/waste-and-recycling' },
    field_service_icon: '♻️',
    changed: '2026-10-12T04:15:00Z',
  },
  {
    id: 'srv-002',
    title: 'Planning & Building Permits',
    body: {
      summary: 'Apply for planning permits, lodge building applications, check zoning overlays, and track assessment progress online.',
      value: `
        <h3>Planning & Development in Harborview</h3>
        <p>Whether you are extending your home, constructing a multi-unit development, or opening a business in central Harborview, our statutory planning and building teams are here to guide you through Victorian planning regulations.</p>

        <h4>Online Planning Portal Capabilities</h4>
        <ul>
          <li><strong>Preliminary Property Assessment:</strong> Verify whether your property requires a planning permit under Harborview Planning Scheme overlays (Heritage, Bushfire, Inundation).</li>
          <li><strong>Electronic Lodgement (VicSmart):</strong> Fast-track eligible minor applications within 10 business days.</li>
          <li><strong>Application Tracking:</strong> Track real-time milestone updates, view public notices, and download stamped plans directly.</li>
        </ul>

        <h4>Pre-Application Consultations</h4>
        <p>Book a 30-minute virtual consultation with a senior statutory planner to discuss initial sketches, parking waivers, or council heritage guidelines before formal lodgement.</p>
      `,
    },
    field_service_category: { name: 'Planning & Development' },
    path: { alias: '/services/planning-and-building-permits' },
    field_service_icon: '🏗️',
    changed: '2026-10-11T08:30:00Z',
  },
  {
    id: 'srv-003',
    title: 'Rates, Valuations & Payments',
    body: {
      summary: 'Pay council rates securely online, apply for pensioner concessions, set up direct debits, or submit valuation objections.',
      value: `
        <h3>Rates & Municipal Charges 2026-2027</h3>
        <p>Your council rates fund more than 150 essential services and infrastructure projects across Harborview, including local roads, coastal paths, libraries, sporting pavilions, immunisation sessions, and parks maintenance.</p>

        <h4>Flexible Payment Options</h4>
        <ul>
          <li><strong>BPAY:</strong> Biller Code: 12345 (Reference number on your annual rate notice).</li>
          <li><strong>Direct Debit:</strong> Automatic 9-month instalment plan with zero interest penalties.</li>
          <li><strong>Centrepay & Concessions:</strong> State Government pensioner concession rebates applied automatically for eligible healthcare card holders.</li>
        </ul>

        <h4>Property Valuations</h4>
        <p>Valuations are conducted annually by the Victorian Valuer-General using Capital Improved Value (CIV). Detailed valuation notices are delivered electronically or by mail each August.</p>
      `,
    },
    field_service_category: { name: 'Council & Rates' },
    path: { alias: '/services/rates-and-valuations' },
    field_service_icon: '💳',
    changed: '2026-10-09T01:20:00Z',
  },
  {
    id: 'srv-004',
    title: 'Parks, Playgrounds & Recreation',
    body: {
      summary: 'Discover over 300 public parks, book sports pavilions, explore coastal walking trails, and report maintenance needs.',
      value: `
        <h3>Active Spaces & Natural Environments</h3>
        <p>Harborview is renowned for its diverse natural landscape, stretching from the Harborview River parklands to the Harborview coastal foreshore and the Coastal Ranges regional fringe.</p>

        <h4>Featured Facilities & Assets</h4>
        <ul>
          <li><strong>Johnstone Park & Harborview Botanic Gardens:</strong> Historic botanical collections, heritage pavilions, and community event zones.</li>
          <li><strong>Harborview River Trail:</strong> Over 20km of continuous sealed shared trail for cycling, walking, and running.</li>
          <li><strong>Inclusive Playgrounds:</strong> All-abilities sensory play equipment at Rippleside Park, Poppy Kettle, and Armstrong Creek Regional Park.</li>
        </ul>

        <h4>Sports Field Bookings</h4>
        <p>Registered community sports clubs and schools can reserve turf grounds, cricket nets, synthetic pitches, and pavilion change rooms through our digital booking system.</p>
      `,
    },
    field_service_category: { name: 'Community & Recreation' },
    path: { alias: '/services/parks-and-recreation' },
    field_service_icon: '🌳',
    changed: '2026-10-08T11:00:00Z',
  },
  {
    id: 'srv-005',
    title: 'Pet Registration & Animal Management',
    body: {
      summary: 'Register your dog or cat, renew microchip records, locate lost pets, and find designated off-leash exercise reserves.',
      value: `
        <h3>Responsible Pet Ownership in Harborview</h3>
        <p>Under Victorian state legislation (Domestic Animals Act 1994), all dogs and cats over the age of three months must be microchipped and registered with the City of Harborview.</p>

        <h4>Registration Benefits</h4>
        <ul>
          <li><strong>Rapid Reunion Service:</strong> 24/7 lost animal identification and notification system.</li>
          <li><strong>Discounted Desexing Programs:</strong> Council subsidies for eligible concession card holders.</li>
          <li><strong>Off-Leash Dog Parks:</strong> Access to 38 fully fenced and unfenced dog exercise reserves across the municipality.</li>
        </ul>

        <h4>Report Lost & Stray Animals</h4>
        <p>If you have found a stray domestic pet, please contact our Animal Welfare officers at <strong>(03) 5272 5272</strong> for collection and microchip scanning.</p>
      `,
    },
    field_service_category: { name: 'Pets & Animals' },
    path: { alias: '/services/pet-registration' },
    field_service_icon: '🐾',
    changed: '2026-10-05T06:40:00Z',
  },
  {
    id: 'srv-006',
    title: 'Roads, Footpaths & Drainage',
    body: {
      summary: 'Report potholes, damaged footpaths, streetlight outages, street sweeping requests, and stormwater drainage issues.',
      value: `
        <h3>Civic Infrastructure Maintenance</h3>
        <p>The City manages and maintains over 2,400 kilometres of sealed and unsealed local roads, 1,900 kilometres of pedestrian footpaths, and comprehensive stormwater drainage networks.</p>

        <h4>What Council Maintains</h4>
        <ul>
          <li><strong>Local Urban & Rural Roads:</strong> Bitumen surfacing, curb repair, linemarking, and pothole rectification.</li>
          <li><strong>Pedestrian Networks:</strong> Trip hazard grinding, concrete replacement, tactile pavers, and accessibility ramps.</li>
          <li><strong>Street Sweeping:</strong> Scheduled monthly sweeping cycles across residential corridors and daily sweeping in Central Harborview retail areas.</li>
        </ul>

        <p><em>Note: Major arterial highways (Metro Freeway, Coastal Highway, Coastal Highway) are managed directly by State Roads Authority / Department of Transport and Planning.</em></p>
      `,
    },
    field_service_category: { name: 'Infrastructure' },
    path: { alias: '/services/roads-and-drainage' },
    field_service_icon: '🛣️',
    changed: '2026-10-03T09:15:00Z',
  },
]

export const MOCK_NEWS: DrupalNewsArticle[] = [
  {
    id: 'news-001',
    title: 'Harborview Waterfront Revitalisation Stage 3 Underway',
    body: {
      summary: 'Construction begins on the landmark stage 3 Western Beach promenade upgrade, enhancing accessible walkways, shade structures, and native coastal flora.',
      value: `
        <p>The City of Harborview has officially commenced civil construction on Stage 3 of the Harborview Foreshore Promenade Master Plan. This $14.2 million joint initiative funded by Council and the Victorian State Government will revitalise 1.2 kilometres of prime foreshore.</p>
        <p>Key enhancements include expanded 4-metre-wide shared pedestrian and cycle paths, smart solar public lighting, high-spec WCAG-compliant ramp access to the tidal baths, and over 4,500 indigenous coastal species planted to stabilise coastal dunes.</p>
        <p>"Our waterfront is the crown jewel of Harborview," said the Council's Director of City Infrastructure. "Stage 3 will deliver an inclusive, resilient civic space that residents and visitors will treasure for generations."</p>
      `,
    },
    field_news_category: { name: 'Infrastructure & Major Projects' },
    path: { alias: '/news/waterfront-revitalisation-stage-3' },
    created: '2026-10-10T09:00:00Z',
    changed: '2026-10-10T10:30:00Z',
  },
  {
    id: 'news-002',
    title: 'New Community Hub and Library Opens in Armstrong Creek',
    body: {
      summary: 'The state-of-the-art Harborview Community Centre officially opens its doors, featuring contemporary learning spaces, kindergarten suites, and Harborview Regional Library services.',
      value: `
        <p>Residents across Armstrong Creek and Mount Duneed can now access world-class community and family services with the official opening of the Harborview Community Centre.</p>
        <p>The facility features a 5-star Green Star environmental rating, a modern branch of Harborview Regional Libraries containing over 25,000 physical and digital items, two maternal and child health consulting rooms, multipurpose youth recreation zones, and community meeting rooms available for evening hire.</p>
      `,
    },
    field_news_category: { name: 'Community' },
    path: { alias: '/news/armstrong-creek-community-hub' },
    created: '2026-10-04T11:00:00Z',
    changed: '2026-10-04T12:00:00Z',
  },
  {
    id: 'news-003',
    title: 'Council Endorses 2026-2030 Climate Emergency Action Plan',
    body: {
      summary: 'Harborview commits to accelerating municipal decarbonisation, expanding urban forest canopy by 30%, and powering all civic facilities with 100% renewable energy.',
      value: `
        <p>At Tuesday evening's Council Meeting, Councillors unanimously endorsed the ambitious 2026-2030 Climate Emergency Action Plan following comprehensive community consultation with over 3,000 local stakeholders.</p>
        <p>The roadmap targets net-zero operational greenhouse gas emissions for all Council assets by 2028, supported by solar installations across 42 municipal buildings, transition of the light vehicle fleet to battery electric vehicles, and planting 50,000 street trees.</p>
      `,
    },
    field_news_category: { name: 'Sustainability' },
    path: { alias: '/news/climate-emergency-action-plan' },
    created: '2026-09-28T14:30:00Z',
    changed: '2026-09-29T08:15:00Z',
  },
  {
    id: 'news-004',
    title: 'Green Waste FOGO Upgrades Rolling Out Across Municipality',
    body: {
      summary: 'Enhanced weekly organic recycling collection diverts 18,000 tonnes of household food scraps from regional landfills each year.',
      value: `
        <p>Harborview's Food Organics & Garden Organics (FOGO) service is expanding with new compostable kitchen caddy deliveries to multi-unit developments and apartments.</p>
        <p>All organic matter collected through the lime-green lid service is transported to a commercial composting facility near Anakie, producing nutrient-rich compost utilised by local Victorian farms and council botanic reserves.</p>
      `,
    },
    field_news_category: { name: 'Environment' },
    path: { alias: '/news/fogo-waste-upgrade' },
    created: '2026-09-15T10:00:00Z',
    changed: '2026-09-15T11:00:00Z',
  },
]

export const MOCK_EVENTS: DrupalEvent[] = [
  {
    id: 'evt-001',
    title: 'Harborview Waterfront Farmers & Artisans Market',
    body: {
      summary: 'Showcasing fresh coastal peninsula produce, artisan breads, local cheeses, and handmade crafts on the picturesque Harborview foreshore.',
      value: `
        <p>Join us at Harborview Waterfront Gardens for the premier monthly farmers market in the Harborview region region. Meet passionate local growers, enjoy live acoustic performances from regional musicians, and savour gourmet breakfast options.</p>
        <p>This event is fully accessible, dog-friendly (on leash), and supported by City of Harborview's waste-wise events program.</p>
      `,
    },
    field_event_date: '2026-10-24T09:00:00Z',
    field_event_location: 'Harborview Waterfront Reserve, Harborview VIC 3220',
    field_event_category: { name: 'Community Market' },
    path: { alias: '/events/waterfront-farmers-market' },
  },
  {
    id: 'evt-002',
    title: "Mayor's Sustainable Business & Innovation Forum",
    body: {
      summary: 'A strategic conference connecting Harborview regional enterprises, clean-tech startups, and municipal procurement leaders.',
      value: `
        <p>The Mayor of the City of Harborview invites local business owners, technology innovators, and industry leaders to the 2026 Sustainable Business & Innovation Forum.</p>
        <p>Keynote speakers will address circular economy supply chains, ESG reporting compliance, and upcoming municipal grant opportunities for local enterprises.</p>
      `,
    },
    field_event_date: '2026-11-05T18:00:00Z',
    field_event_location: 'Harborview Arts Centre, 25 Civic Square Drive, Harborview VIC 3220',
    field_event_category: { name: 'Civic Forum' },
    path: { alias: '/events/sustainable-business-forum' },
  },
  {
    id: 'evt-003',
    title: 'Family Biodiversity Nature Walk & Wildlife Workshop',
    body: {
      summary: 'Explore native birdlife, wetlands ecology, and microbat habitats with City of Harborview conservation rangers.',
      value: `
        <p>Bring the family to Balyang Sanctuary for a guided twilight nature walk led by Council biodiversity officers. Learn about native waterbirds, freshwater fish populations, and river health along the Harborview River corridor.</p>
        <p>Binoculars and nature spotter checklists provided. Suitable for children aged 5 and older accompanied by an adult.</p>
      `,
    },
    field_event_date: '2026-11-14T10:00:00Z',
    field_event_location: 'Balyang Sanctuary, Marnock Rd, Newtown VIC 3220',
    field_event_category: { name: 'Family & Environment' },
    path: { alias: '/events/biodiversity-nature-walk' },
  },
]
