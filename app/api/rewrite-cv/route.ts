import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are an expert CV writer who specializes in tailoring resumes for Indian job seekers applying to MNCs, startups, and tech companies. You understand ATS systems, Indian corporate culture, and how to match keywords from job descriptions without being dishonest.

When given a job description and a CV, rewrite the CV to:
1. Mirror language and keywords from the JD naturally — not stuffed
2. Lead with the most relevant experience first
3. Tighten every bullet to start with a strong action verb
4. Remove irrelevant sections that don't serve this specific application
5. Keep the output in plain text, formatted for copy-paste into a Word doc

Do not add fake experience or skills. Rewrite what is there, better.
Output ONLY the rewritten CV. No preamble, no explanation, no "Here is your CV:".`

export async function POST(request: NextRequest) {
  const { jobDescription, cvText } = await request.json()

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://joliundo.in',
      'X-Title': 'Joliundo CV Tailor',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.0-flash-exp:free',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Job Description:\n${jobDescription}\n\nMy Current CV:\n${cvText}\n\nRewrite my CV for this specific role.`,
        },
      ],
      max_tokens: 2048,
      temperature: 0.3,
    }),
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    if (res.status === 429) {
      return NextResponse.json(
        { error: 'Too many requests. Try again in a moment.' },
        { status: 429 }
      )
    }
    const message = (errorData as { error?: { message?: string } })?.error?.message
    return NextResponse.json(
      { error: message || `API error ${res.status}` },
      { status: res.status }
    )
  }

  const data = await res.json()
  const content: string = data.choices[0]?.message?.content ?? ''
  return NextResponse.json({ content })
}
