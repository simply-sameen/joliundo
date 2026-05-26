import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { email, userAgent } = await request.json()

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  const res = await fetch(`${supabaseUrl}/rest/v1/waitlist`, {
    method: 'POST',
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ email, user_agent: userAgent }),
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to save email' }, { status: res.status })
  }

  return NextResponse.json({ ok: true })
}
