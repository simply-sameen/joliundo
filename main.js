// TODO: Move to a backend proxy before public launch — Vite inlines env vars into the JS bundle at build time,
// so VITE_OPENROUTER_API_KEY is still readable by anyone who inspects the bundle.
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// ─────────────────────────────────────────
// EMAIL STORAGE
// ─────────────────────────────────────────
const saveEmail = async (email) => {
  await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({ email, user_agent: navigator.userAgent })
  })
}

// ─────────────────────────────────────────
// API: CV REWRITE
// ─────────────────────────────────────────
const rewriteCV = async (jobDescription, cvText) => {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://joliundo.in',
      'X-Title': 'Joliundo CV Tailor'
    },
    body: JSON.stringify({
      model: 'google/gemini-2.0-flash-exp:free',
      messages: [
        {
          role: 'system',
          content: `You are an expert CV writer who specializes in tailoring resumes for Indian job seekers applying to MNCs, startups, and tech companies. You understand ATS systems, Indian corporate culture, and how to match keywords from job descriptions without being dishonest.

When given a job description and a CV, rewrite the CV to:
1. Mirror language and keywords from the JD naturally — not stuffed
2. Lead with the most relevant experience first
3. Tighten every bullet to start with a strong action verb
4. Remove irrelevant sections that don't serve this specific application
5. Keep the output in plain text, formatted for copy-paste into a Word doc

Do not add fake experience or skills. Rewrite what is there, better.
Output ONLY the rewritten CV. No preamble, no explanation, no "Here is your CV:".`
        },
        {
          role: 'user',
          content: `Job Description:\n${jobDescription}\n\nMy Current CV:\n${cvText}\n\nRewrite my CV for this specific role.`
        }
      ],
      max_tokens: 2048,
      temperature: 0.3
    })
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    if (response.status === 429) {
      throw new Error('Too many requests. Try again in a moment.')
    }
    throw new Error(errorData?.error?.message || `API error ${response.status}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || ''
}

// ─────────────────────────────────────────
// EMAIL VALIDATION
// ─────────────────────────────────────────
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

// ─────────────────────────────────────────
// EMAIL GATE LOGIC
// ─────────────────────────────────────────
const initEmailGate = () => {
  const input = document.getElementById('email-input')
  const error = document.getElementById('email-error')
  const btn = document.getElementById('access-btn')
  const btnText = btn.querySelector('.btn-text')
  const stateA = document.getElementById('state-a')
  const stateB = document.getElementById('state-b')
  const emailSaved = document.getElementById('email-saved')

  const showError = (msg) => {
    error.textContent = msg
    input.classList.add('email-input--error')
    input.classList.remove('email-input--shake')
    // Force reflow to restart animation
    void input.offsetWidth
    input.classList.add('email-input--shake')
    input.addEventListener('animationend', () => {
      input.classList.remove('email-input--shake')
    }, { once: true })
  }

  const clearError = () => {
    error.textContent = ''
    input.classList.remove('email-input--error')
  }

  const transitionToTool = (email) => {
    btnText.textContent = 'Opening...'
    btn.classList.add('btn-primary--loading')
    btn.disabled = true

    setTimeout(() => {
      stateA.classList.add('tool-box--hidden')
      emailSaved.textContent = `${email} saved`

      stateB.classList.add('is-visible')
      stateB.removeAttribute('aria-hidden')

      // Trigger CSS transition after display: grid kicks in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          stateB.classList.add('is-active')
        })
      })
    }, 600)
  }

  const handleSubmit = () => {
    const email = input.value.trim()
    if (!isValidEmail(email)) {
      showError('Enter a valid email')
      return
    }
    clearError()
    saveEmail(email)
    transitionToTool(email)
  }

  input.addEventListener('input', () => {
    if (input.classList.contains('email-input--error')) clearError()
  })

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSubmit()
  })

  btn.addEventListener('click', handleSubmit)
}

// ─────────────────────────────────────────
// CV TOOL LOGIC
// ─────────────────────────────────────────
const initCVTool = () => {
  const tabs = document.querySelectorAll('.cv-tab')
  const panels = { jd: document.getElementById('panel-jd'), cv: document.getElementById('panel-cv') }
  const jdTextarea = document.getElementById('jd-textarea')
  const cvTextarea = document.getElementById('cv-textarea')
  const rewriteBtn = document.getElementById('rewrite-btn')
  const rewriteBtnText = rewriteBtn.querySelector('.btn-text')
  const cvOutput = document.getElementById('cv-output')
  const outputText = document.getElementById('output-text')
  const outputError = document.getElementById('output-error')
  const copyBtn = document.getElementById('copy-btn')

  // Tab switching
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab
      tabs.forEach((t) => {
        t.classList.remove('cv-tab--active')
        t.setAttribute('aria-selected', 'false')
      })
      tab.classList.add('cv-tab--active')
      tab.setAttribute('aria-selected', 'true')

      panels.jd.hidden = target !== 'jd'
      panels.cv.hidden = target !== 'cv'
    })
  })

  // Rewrite button
  rewriteBtn.addEventListener('click', async () => {
    const jd = jdTextarea.value.trim()
    const cv = cvTextarea.value.trim()

    if (!jd || !cv) {
      outputError.textContent = 'Paste both the job description and your CV first.'
      cvOutput.hidden = false
      outputText.textContent = ''
      return
    }

    outputError.textContent = ''
    rewriteBtnText.textContent = 'Rewriting...'
    rewriteBtn.classList.add('btn-primary--loading')
    rewriteBtn.disabled = true
    cvOutput.hidden = false
    outputText.textContent = ''

    try {
      const result = await rewriteCV(jd, cv)
      outputText.textContent = result
      outputError.textContent = ''
    } catch (err) {
      outputError.textContent = err.message || 'Something went wrong. Check your API key.'
      outputText.textContent = ''
    } finally {
      rewriteBtnText.textContent = 'Rewrite My CV →'
      rewriteBtn.classList.remove('btn-primary--loading')
      rewriteBtn.disabled = false
    }
  })

  // Copy button
  let copyTimeout
  copyBtn.addEventListener('click', () => {
    const text = outputText.textContent
    if (!text) return

    navigator.clipboard.writeText(text).then(() => {
      copyBtn.textContent = 'Copied'
      copyBtn.classList.add('copy-btn--copied')
      clearTimeout(copyTimeout)
      copyTimeout = setTimeout(() => {
        copyBtn.textContent = 'Copy'
        copyBtn.classList.remove('copy-btn--copied')
      }, 2000)
    }).catch(() => {
      // Fallback for non-secure contexts
      const range = document.createRange()
      range.selectNodeContents(outputText)
      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(range)
      document.execCommand('copy')
      sel.removeAllRanges()
      copyBtn.textContent = 'Copied'
      copyBtn.classList.add('copy-btn--copied')
      clearTimeout(copyTimeout)
      copyTimeout = setTimeout(() => {
        copyBtn.textContent = 'Copy'
        copyBtn.classList.remove('copy-btn--copied')
      }, 2000)
    })
  })
}

// ─────────────────────────────────────────
// SCROLL-TRIGGERED REVEAL (SECTION 3)
// ─────────────────────────────────────────
const initScrollReveal = () => {
  const steps = document.querySelectorAll('.how__step')
  if (!steps.length) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const index = [...steps].indexOf(entry.target)
        setTimeout(() => {
          entry.target.classList.add('is-visible')
        }, index * 120)
        observer.unobserve(entry.target)
      })
    },
    { threshold: 0.2 }
  )

  steps.forEach((step) => observer.observe(step))
}

// ─────────────────────────────────────────
// INIT
// ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initEmailGate()
  initCVTool()
  initScrollReveal()
})
