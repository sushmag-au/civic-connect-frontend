import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

// Default fallback secret for instant testing, or use Vercel env var
const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET || 'civic_revalidate_2026'

async function handleRevalidation(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  const path = request.nextUrl.searchParams.get('path') || '/news'

  // Security gate: Verify secret token
  if (secret !== REVALIDATION_SECRET) {
    return NextResponse.json(
      {
        success: false,
        error: 'Unauthorized',
        message: 'Invalid secret token. Please supply ?secret=civic_revalidate_2026',
      },
      { status: 401 }
    )
  }

  try {
    // Tell Next.js & Vercel to immediately purge and re-render this path on edge CDN
    revalidatePath(path)

    return NextResponse.json({
      success: true,
      revalidated: true,
      path,
      timestamp: new Date().toISOString(),
      message: `Edge CDN cache successfully purged and regenerated for "${path}".`,
    })
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown revalidation error'
    return NextResponse.json(
      {
        success: false,
        error: 'RevalidationFailed',
        message: errorMessage,
      },
      { status: 500 }
    )
  }
}

// Support GET for direct browser testing in address bar
export async function GET(request: NextRequest) {
  return handleRevalidation(request)
}

// Support POST for automated webhooks from Drupal
export async function POST(request: NextRequest) {
  return handleRevalidation(request)
}
