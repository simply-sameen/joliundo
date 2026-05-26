import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Outfit, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-outfit',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#060f0b',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://joliundo.in'),
  title: "Joliundo — AI CV Tailor · Kerala's Graduate Job Platform",
  description: 'AI-powered CV tailoring with jobs, startups, remote work & internships for Malayali students & job seekers. Free.',
  authors: [{ name: 'Joliundo' }],
  keywords: ['cv tailor', 'resume builder', 'kerala jobs', 'jobs in kerala', 'malayali graduates', 'ai resume', 'job search', 'cv generator', 'interview prep'],
  alternates: {
    canonical: 'https://joliundo.in',
    types: { 'text/plain': 'https://joliundo.in/llms.txt' },
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/assets/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/assets/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: { url: '/assets/apple-touch-icon.png', sizes: '180x180' },
  },
  openGraph: {
    type: 'website',
    title: 'Joliundo — ജോലി ഉണ്ടോ?',
    description: 'AI-powered CV tailoring with jobs, startups, remote work & internships for Malayali students & job seekers.',
    url: 'https://joliundo.in',
    siteName: 'Joliundo',
    locale: 'en_IN',
    images: [
      {
        url: '/og-image.png',
        type: 'image/png',
        width: 1200,
        height: 630,
        alt: 'Joliundo — AI-powered CV tailoring for Malayali job seekers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@joliundo',
    creator: '@joliundo',
    title: 'Joliundo — ജോലി ഉണ്ടോ?',
    description: 'AI-powered CV tailoring with jobs, startups, remote work & internships for Malayali students & job seekers.',
    images: {
      url: '/og-image.png',
      alt: 'Joliundo — AI-powered CV tailoring for Malayali job seekers',
    },
  },
  verification: {
    google: 'YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE',
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://joliundo.in/#website',
      name: 'Joliundo',
      alternateName: 'ജോലി ഉണ്ടോ?',
      url: 'https://joliundo.in',
      description: 'AI-powered CV tailoring for Malayali job seekers. Built for Kerala graduates applying to MNCs, startups, and remote roles.',
      inLanguage: ['en', 'ml'],
      dateModified: '2026-05-24',
      publisher: { '@id': 'https://joliundo.in/#organization' },
    },
    {
      '@type': 'Organization',
      '@id': 'https://joliundo.in/#organization',
      name: 'Joliundo',
      url: 'https://joliundo.in',
      logo: {
        '@type': 'ImageObject',
        url: 'https://joliundo.in/og-image.png',
        width: 1200,
        height: 630,
      },
      description: 'Kerala-focused job platform with AI-powered CV tailoring for Malayali graduates and job seekers.',
      foundingLocation: {
        '@type': 'Place',
        name: 'Kerala, India',
        addressCountry: 'IN',
      },
      knowsAbout: ['CV writing', 'Resume tailoring', 'ATS optimization', 'Job applications', 'Kerala job market', 'Malayali graduates'],
      sameAs: [],
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://joliundo.in/#app',
      name: 'Joliundo CV Tailor',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description: 'AI tool that rewrites your CV to match any job description. ATS-friendly and free.',
      url: 'https://joliundo.in',
      inLanguage: 'en',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://joliundo.in/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Joliundo?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Joliundo is an AI-powered CV tailoring platform built for Malayali students, graduates and job seekers. It rewrites your CV to match specific job, startup, remote work & internships descriptions, improving your chances of passing ATS filters and getting shortlisted.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does the CV tailoring work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Paste any job description and your current CV. Joliundo rewrites your CV using keywords and structure from the job description, making it ATS-friendly and role-specific in under 60 seconds.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is Joliundo free to use?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. The CV tailoring tool is completely free. You only need to provide your email address to access it. No payment or subscription required.',
          },
        },
        {
          '@type': 'Question',
          name: 'Who is Joliundo built for?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Joliundo is built for Malayali graduates from KTU and Kerala universities, unemployed youth under 25, and people applying to MNCs, startups, and remote or contract roles.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is ATS and why does it matter for Kerala job seekers?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'ATS (Applicant Tracking System) is software companies use to automatically filter CVs before a human reads them. Most MNCs and large companies use ATS. Joliundo formats your CV to pass ATS filters while naturally matching job description keywords, increasing shortlist rates.',
          },
        },
      ],
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-IN"
      className={`${playfairDisplay.variable} ${outfit.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <meta name="msapplication-TileColor" content="#060f0b" />
        <link rel="manifest" href="/assets/site.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
