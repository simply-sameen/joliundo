'use client'

import { useEffect, useRef } from 'react'

export default function HowItWorks() {
  const stepsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = stepsRef.current
    if (!container) return
    const steps = container.querySelectorAll<HTMLElement>('.how__step')
    if (!steps.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const index = [...steps].indexOf(entry.target as HTMLElement)
          setTimeout(() => {
            entry.target.classList.add('is-visible')
          }, index * 120)
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.2 }
    )

    steps.forEach((step) => observer.observe(step))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="how" id="how">
      <div className="container">
        <div className="how__steps" ref={stepsRef}>

          <div className="how__step" data-step="01">
            <div className="how__step-inner">
              <span className="how__number" aria-hidden="true">01</span>
              <div className="how__step-content">
                <h3 className="how__step-heading">Paste the job description</h3>
                <p className="how__step-body">
                  Copy it from{' '}
                  <a href="https://www.linkedin.com/jobs/" className="text-link" target="_blank" rel="noopener noreferrer">LinkedIn</a>,{' '}
                  <a href="https://www.naukri.com/" className="text-link" target="_blank" rel="noopener noreferrer">Naukri</a>,
                  or wherever. Raw text is fine.
                </p>
              </div>
            </div>
          </div>

          <div className="how__connector" aria-hidden="true" />

          <div className="how__step" data-step="02">
            <div className="how__step-inner">
              <span className="how__number" aria-hidden="true">02</span>
              <div className="how__step-content">
                <h3 className="how__step-heading">Paste your current CV</h3>
                <p className="how__step-body">Don&apos;t worry if it&apos;s generic. That&apos;s exactly what we&apos;re fixing.</p>
              </div>
            </div>
          </div>

          <div className="how__connector" aria-hidden="true" />

          <div className="how__step" data-step="03">
            <div className="how__step-inner">
              <span className="how__number" aria-hidden="true">03</span>
              <div className="how__step-content">
                <h3 className="how__step-heading">Get your tailored CV</h3>
                <p className="how__step-body">Rewritten in under 60 seconds. Copy and apply immediately.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
