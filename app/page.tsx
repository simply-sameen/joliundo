import Hero from '@/components/Hero'
import Exchange from '@/components/Exchange'
import HowItWorks from '@/components/HowItWorks'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Hero />
      <Exchange />
      <HowItWorks />
      <Footer />

      {/* Crawler-readable FAQ — visually hidden, not display:none (bots ignore display:none) */}
      <section className="sr-only" aria-hidden="true">
        <h2>Frequently Asked Questions</h2>
        <dl>
          <dt>What is Joliundo?</dt>
          <dd>Joliundo is an AI-powered CV tailoring platform built for Malayali job seekers in Kerala, India. It rewrites your CV to match specific job descriptions, improving your chances of passing ATS filters and getting shortlisted by MNCs, startups, and remote employers.</dd>
          <dt>How does the CV tailoring work?</dt>
          <dd>Paste any job description and your current CV. Joliundo uses AI to rewrite your CV using keywords and structure from the job description, making it ATS-friendly and role-specific in under 60 seconds.</dd>
          <dt>Is Joliundo free to use?</dt>
          <dd>Yes. The CV tailoring tool is completely free. You only need to provide your email address to access it. No payment or subscription is required.</dd>
          <dt>Who is Joliundo built for?</dt>
          <dd>Joliundo is built for Malayali graduates from KTU (Kerala Technological University) and other Kerala universities, unemployed youth under 25, and people applying to MNCs, startups, and remote or contract roles in India and abroad.</dd>
          <dt>What is ATS and why does it matter for Kerala job seekers?</dt>
          <dd>ATS stands for Applicant Tracking System — software large companies use to automatically filter CVs before a human reads them. Most MNCs recruiting in Kerala and India use ATS. Joliundo formats your CV to pass ATS filters while naturally matching job description keywords, increasing your shortlist rate significantly.</dd>
          <dt>What job boards does Joliundo work with?</dt>
          <dd>Joliundo works with any job description text, including postings from LinkedIn, Naukri, Indeed, Internshala, and direct company career pages. Copy and paste the job description text into the tool.</dd>
        </dl>
      </section>
    </>
  )
}
