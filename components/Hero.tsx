export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero__watermark" aria-hidden="true">ജ</div>
      <div className="hero__content">
        <span className="hero__tag animate-in" style={{ '--delay': '0ms' } as React.CSSProperties}>
          MALAYALI-KK VENDI
        </span>
        <h1 className="hero__headline animate-in" style={{ '--delay': '80ms' } as React.CSSProperties}>
          ജോലി ഉണ്ടോ?
        </h1>
        <p className="hero__transliteration animate-in" style={{ '--delay': '160ms' } as React.CSSProperties}>
          joliundo
        </p>
        <div className="hero__divider animate-in" style={{ '--delay': '220ms' } as React.CSSProperties} />
        <p className="hero__body animate-in" style={{ '--delay': '280ms' } as React.CSSProperties}>
          The platform with jobs, startups, remote work & internships for Malayali students, graduates & job seekers.
          We tailor your CV to every job description&mdash;so your application doesn&apos;t sound like everyone else&apos;s.
        </p>
      </div>
      <div className="hero__scroll-indicator" aria-hidden="true">↓ scroll</div>
    </section>
  )
}
