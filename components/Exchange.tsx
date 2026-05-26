'use client'

import { useState, useRef, useCallback } from 'react'

type Tab = 'jd' | 'cv'

export default function Exchange() {
  // Email gate state
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [hasInputError, setHasInputError] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // State A → B transition
  const [gateDone, setGateDone] = useState(false)
  const [stateBVisible, setStateBVisible] = useState(false)
  const [stateBActive, setStateBActive] = useState(false)
  const [savedEmail, setSavedEmail] = useState('')

  // CV tool state
  const [activeTab, setActiveTab] = useState<Tab>('jd')
  const [jd, setJd] = useState('')
  const [cvText, setCvText] = useState('')
  const [isRewriting, setIsRewriting] = useState(false)
  const [showOutput, setShowOutput] = useState(false)
  const [output, setOutput] = useState('')
  const [outputError, setOutputError] = useState('')
  const [copied, setCopied] = useState(false)
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)

  const triggerShake = useCallback(() => {
    const el = inputRef.current
    if (!el) return
    el.classList.remove('email-input--shake')
    void el.offsetWidth
    el.classList.add('email-input--shake')
    el.addEventListener('animationend', () => el.classList.remove('email-input--shake'), { once: true })
  }, [])

  const transitionToTool = (emailVal: string) => {
    setIsTransitioning(true)
    fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailVal, userAgent: navigator.userAgent }),
    }).catch(() => {})

    setTimeout(() => {
      setGateDone(true)
      setSavedEmail(`${emailVal} saved`)
      setStateBVisible(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setStateBActive(true)
        })
      })
    }, 600)
  }

  const handleSubmit = () => {
    const val = email.trim()
    if (!isValidEmail(val)) {
      setEmailError('Enter a valid email')
      setHasInputError(true)
      triggerShake()
      return
    }
    setEmailError('')
    setHasInputError(false)
    transitionToTool(val)
  }

  const handleRewrite = async () => {
    const jdVal = jd.trim()
    const cvVal = cvText.trim()
    setShowOutput(true)
    setOutput('')

    if (!jdVal || !cvVal) {
      setOutputError('Paste both the job description and your CV first.')
      return
    }

    setOutputError('')
    setIsRewriting(true)

    try {
      const res = await fetch('/api/rewrite-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: jdVal, cvText: cvVal }),
      })
      const data = await res.json()
      if (!res.ok) {
        setOutputError(data.error || `Error ${res.status}`)
        return
      }
      setOutput(data.content)
      setOutputError('')
    } catch {
      setOutputError('Something went wrong. Try again.')
    } finally {
      setIsRewriting(false)
    }
  }

  const handleCopy = () => {
    if (!output) return
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      clearTimeout(copyTimeoutRef.current)
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000)
    }).catch(() => {
      const el = document.getElementById('output-text')
      if (!el) return
      const range = document.createRange()
      range.selectNodeContents(el)
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(range)
      document.execCommand('copy')
      sel?.removeAllRanges()
      setCopied(true)
      clearTimeout(copyTimeoutRef.current)
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <section className="exchange" id="exchange">
      <div className="container">
        <div className="exchange__grid">

          {/* Left: The Offer */}
          <div className="exchange__offer">
            <span className="label">WHAT YOU GET</span>
            <h2 className="exchange__heading">
              Your CV,<br />
              rewritten for<br />
              the job.
            </h2>
            <p className="exchange__body">
              Paste any job description. Upload your CV. We rewrite it specifically
              for that role&mdash;keywords, structure, tone. One application, one shot.
            </p>
            <p className="exchange__body exchange__body--emphasis">
              No account. No payment.<br />
              Just leave your email and use it now.
            </p>
            <ul className="exchange__features">
              <li>→&nbsp; Tailored to the job description</li>
              <li>→&nbsp; <a href="https://en.wikipedia.org/wiki/Applicant_tracking_system" className="text-link" target="_blank" rel="noopener noreferrer">ATS</a>-friendly formatting</li>
              <li>→&nbsp; In under 60 seconds</li>
            </ul>
          </div>

          {/* Right: Form + CV Tool */}
          <div className="exchange__right">

            {/* State A: Email gate */}
            <div className={`tool-box${gateDone ? ' tool-box--hidden' : ''}`} id="state-a">
              <span className="label">ENTER YOUR EMAIL</span>
              <div className="email-form">
                <input
                  ref={inputRef}
                  type="email"
                  id="email-input"
                  className={`email-input${hasInputError ? ' email-input--error' : ''}`}
                  placeholder="your@email.com"
                  autoComplete="email"
                  spellCheck={false}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (hasInputError) {
                      setEmailError('')
                      setHasInputError(false)
                    }
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
                <p className="email-error" aria-live="polite">{emailError}</p>
                <button
                  className={`btn-primary${isTransitioning ? ' btn-primary--loading' : ''}`}
                  id="access-btn"
                  type="button"
                  disabled={isTransitioning}
                  onClick={handleSubmit}
                >
                  <span className="btn-text">{isTransitioning ? 'Opening...' : 'Get Access'}</span>
                  <span className="btn-spinner" aria-hidden="true" />
                </button>
                <p className="fine-print">No spam. No account needed. Just your email.</p>
              </div>
            </div>

            {/* State B: CV Tool */}
            <div
              className={`tool-box tool-box--cv${stateBVisible ? ' is-visible' : ''}${stateBActive ? ' is-active' : ''}`}
              id="state-b"
              aria-hidden={stateBVisible ? undefined : true}
            >
              <div className="cv-tool">
                <div className="cv-tool__header">
                  <span className="label">CV TAILOR — BETA</span>
                  <span className="cv-tool__saved" id="email-saved">{savedEmail}</span>
                </div>

                <div className="cv-tool__tabs" role="tablist">
                  <button
                    className={`cv-tab${activeTab === 'jd' ? ' cv-tab--active' : ''}`}
                    role="tab"
                    aria-selected={activeTab === 'jd'}
                    data-tab="jd"
                    id="tab-jd"
                    aria-controls="panel-jd"
                    onClick={() => setActiveTab('jd')}
                  >
                    Job Description
                  </button>
                  <button
                    className={`cv-tab${activeTab === 'cv' ? ' cv-tab--active' : ''}`}
                    role="tab"
                    aria-selected={activeTab === 'cv'}
                    data-tab="cv"
                    id="tab-cv"
                    aria-controls="panel-cv"
                    onClick={() => setActiveTab('cv')}
                  >
                    Your CV
                  </button>
                </div>

                <div id="panel-jd" role="tabpanel" aria-labelledby="tab-jd" hidden={activeTab !== 'jd'}>
                  <textarea
                    className="cv-textarea"
                    id="jd-textarea"
                    placeholder="Paste the job description here..."
                    aria-label="Job description"
                    value={jd}
                    onChange={(e) => setJd(e.target.value)}
                  />
                </div>
                <div id="panel-cv" role="tabpanel" aria-labelledby="tab-cv" hidden={activeTab !== 'cv'}>
                  <textarea
                    className="cv-textarea"
                    id="cv-textarea"
                    placeholder="Paste your current CV / resume text here..."
                    aria-label="Your current CV"
                    value={cvText}
                    onChange={(e) => setCvText(e.target.value)}
                  />
                </div>

                <button
                  className={`btn-primary btn-primary--cv${isRewriting ? ' btn-primary--loading' : ''}`}
                  id="rewrite-btn"
                  type="button"
                  disabled={isRewriting}
                  onClick={handleRewrite}
                >
                  <span className="btn-text">{isRewriting ? 'Rewriting...' : 'Rewrite My CV →'}</span>
                  <span className="btn-spinner" aria-hidden="true" />
                </button>

                {showOutput && (
                  <div className="cv-output" id="cv-output">
                    <div className="cv-output__header">
                      <span className="label">TAILORED OUTPUT</span>
                      <button
                        className={`copy-btn${copied ? ' copy-btn--copied' : ''}`}
                        id="copy-btn"
                        type="button"
                        onClick={handleCopy}
                      >
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <div className="cv-output__error" id="output-error" aria-live="polite">{outputError}</div>
                    <div className="cv-output__text" id="output-text" aria-label="Tailored CV output">{output}</div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
