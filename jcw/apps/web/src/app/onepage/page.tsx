'use client'

import { useEffect } from 'react'

export default function OnePageWebsite() {
  useEffect(() => {
    // Set the current year in the footer
    const yearElement = document.getElementById("year")
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear().toString()
    }
  }, [])

  return (
    <>
      <style jsx global>{`
        :root {
          --bg: #0a1a5e;
          --bg2: #0d2b88;
          --blue: #2152ff;
          --white: #fff;
          --muted: #64748b;
          --line: #e6ecff;
          --max: 1100px;
        }
        
        .onepage-container {
          font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
          margin: 0;
          color: #0f172a;
          background: #fff;
        }
        
        .onepage-container h1,
        .onepage-container h2,
        .onepage-container h3 {
          margin: 0 0 10px;
        }
        
        .onepage-container p {
          margin: 0 0 18px;
          line-height: 1.7;
        }
        
        .onepage-container ul {
          margin: 0 0 18px 18px;
          line-height: 1.7;
        }
        
        .container {
          max-width: var(--max);
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .section-pad {
          padding: 80px 0;
        }
        
        .badge {
          display: inline-block;
          background: #eef2ff;
          color: #3442d9;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 14px;
        }
        
        .muted {
          color: var(--muted);
        }
        
        .highlight {
          color: var(--blue);
          font-weight: 600;
        }
        
        .plan-box {
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 26px;
          background: #fff;
          box-shadow: 0 8px 20px rgba(33, 82, 255, 0.08);
        }
        
        .cta {
          text-align: center;
          margin-top: 40px;
        }
        
        .btn {
          background: var(--blue);
          color: #fff;
          text-decoration: none;
          padding: 12px 22px;
          border-radius: 999px;
          font-weight: 600;
          display: inline-block;
          transition: all 0.3s ease;
        }
        
        .btn:hover {
          background: #1e47ff;
          transform: translateY(-2px);
        }
        
        .hero {
          background: linear-gradient(180deg, var(--bg), var(--bg2));
          color: #fff;
          padding: 100px 0;
          text-align: center;
        }
        
        .hero h1 {
          font-size: 42px;
          line-height: 1.1;
          margin-bottom: 14px;
        }
        
        .hero p {
          max-width: 700px;
          margin: 0 auto;
          color: #d7e2ff;
        }
        
        .section h2 {
          font-size: 26px;
          color: #0a1a5e;
          margin-bottom: 10px;
        }
        
        .footer {
          text-align: center;
          padding: 40px 0;
          color: #9ca3af;
          font-size: 14px;
          border-top: 1px solid var(--line);
        }
        
        .center {
          text-align: center;
        }
        
        .benefits-section {
          background: #f8f9ff;
        }
        
        @media (max-width: 720px) {
          .hero h1 {
            font-size: 32px;
          }
          .plan-box {
            padding: 20px;
          }
        }
      `}</style>

      <div className="onepage-container">
        <header className="hero">
          <div className="container">
            <h1>One Page Website</h1>
            <p>The fastest way to go online. One clean, professional page that says who you are, what you do, and how to contact you.</p>
          </div>
        </header>

        <section className="section section-pad">
          <div className="container">
            <div className="badge">Simple &amp; Effective</div>
            <h2>Perfect for Small Businesses and Freelancers</h2>
            <p className="muted">If you just need to appear online — fast, simple, and reliable — the One Page Website is your best starting point. It's ideal for local businesses, independent professionals, and anyone who doesn't want to manage a complex site.</p>
          </div>
        </section>

        <section className="section section-pad" style={{ paddingTop: '30px' }}>
          <div className="container">
            <div className="plan-box">
              <h3>What's Included</h3>
              <ul>
                <li>One professional landing page with clean design</li>
                <li>Sections for your services, photos, contact details, and business info</li>
                <li>Google Maps integration for your business location</li>
                <li>Contact form (customizable)</li>
                <li><b>Option to add up to 2 custom forms</b> — for quotes, requests, or bookings*</li>
                <li>Mobile-friendly and SEO-ready</li>
                <li>Free domain and hosting for the first year</li>
                <li>SSL security, backups, and analytics included</li>
              </ul>
              <p><small className="muted">*Custom forms can be added depending on your plan or setup preferences.</small></p>
            </div>
          </div>
        </section>

        <section className="section section-pad benefits-section">
          <div className="container">
            <h2>Why Choose a One Page Website?</h2>
            <ul>
              <li>Fastest way to go live — usually ready within 1 day</li>
              <li>Simple structure: visitors find everything in one scroll</li>
              <li>Ideal for small businesses, startups, and quick promotions</li>
              <li>Low maintenance and easy to upgrade later</li>
              <li>Looks great on mobile and desktop</li>
            </ul>
            <p>When you're ready to expand, your One Page Website can easily be upgraded to a full multi-page site — no need to start over.</p>
          </div>
        </section>

        <section className="section section-pad">
          <div className="container center">
            <h2>Ready to Get Online Fast?</h2>
            <p className="muted">Start with a simple page today — we'll take care of setup, hosting, and design. You can always upgrade later as your business grows.</p>
            <div className="cta">
              <a href="#" className="btn">Start with One Page</a>
            </div>
          </div>
        </section>

        <footer className="footer">
          <div className="container">
            © <span id="year"></span> Just Code Works — Websites That Work
          </div>
        </footer>
      </div>
    </>
  )
}