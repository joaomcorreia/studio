'use client'

import { useEffect } from 'react'

export default function WebsitesPage() {
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
        
        .websites-container {
          font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
          margin: 0;
          color: #0f172a;
          background: #fff;
        }
        
        .websites-container h1,
        .websites-container h2,
        .websites-container h3,
        .websites-container h4 {
          margin: 0 0 10px;
        }
        
        .websites-container p {
          margin: 0 0 18px;
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
        
        .plans {
          display: grid;
          gap: 22px;
        }
        
        .plan {
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 26px;
          background: #fff;
          box-shadow: 0 8px 20px rgba(33, 82, 255, 0.08);
          transition: all 0.3s ease;
        }
        
        .plan:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(33, 82, 255, 0.15);
        }
        
        .plan h3 {
          color: var(--blue);
          font-size: 20px;
          margin-bottom: 12px;
        }
        
        .plan ul {
          margin: 0;
          padding-left: 20px;
          line-height: 1.7;
        }
        
        .plan ul li {
          margin-bottom: 8px;
        }
        
        .cta {
          text-align: center;
          margin-top: 28px;
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
          font-size: 18px;
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
        
        .core-section {
          background: #f8f9ff;
        }
        
        .core-section ul {
          margin: 0 0 18px 18px;
          line-height: 1.7;
        }
        
        .core-section ul li {
          margin-bottom: 8px;
        }
        
        @media (max-width: 720px) {
          .hero h1 {
            font-size: 32px;
          }
          .plan {
            padding: 20px;
          }
        }
      `}</style>

      <div className="websites-container">
        <header className="hero">
          <div className="container">
            <h1>Websites That Just Work</h1>
            <p>From simple one-page sites to complete business websites — Just Code Works helps you get online fast and grow at your own pace.</p>
          </div>
        </header>

        <section className="section section-pad">
          <div className="container center">
            <div className="badge">Website Plans</div>
            <h2>Choose the Type of Website That Fits You</h2>
            <p className="muted">Every JCW website includes EU hosting, SSL, backups, and a free domain for the first year. Start small or go big — your website can grow anytime.</p>
          </div>
        </section>

        <section className="section section-pad" style={{ paddingTop: '30px' }}>
          <div className="container plans">

            {/* BASIC PLAN */}
            <div className="plan" id="plan-basic">
              <h3>Basic Plan — Static Website</h3>
              <p className="muted">A simple, reliable online presence for professionals and small local services who just want to appear on Google and look professional.</p>
              <ul>
                <li>One-page or few-page static website</li>
                <li>Optimized for fast loading</li>
                <li>Includes business info, photos, and contact details</li>
                <li>Contact form & Google Map integration</li>
                <li>Free domain and hosting for 1 year</li>
              </ul>
              <p>Think of it as your digital business card — fast, affordable, and always online.</p>
            </div>

            {/* STARTER PLAN */}
            <div className="plan" id="plan-starter">
              <h3>Starter Plan — Editable Website</h3>
              <p className="muted">Perfect for businesses that want full control of their content, pages, and updates — without needing a developer.</p>
              <ul>
                <li>Everything from the Basic Plan</li>
                <li>Easy-to-use admin panel to edit text, images, and services</li>
                <li>Multi-language options (EN, NL, FR, ES, PT)</li>
                <li>Blog or news section included</li>
                <li>Custom domain + professional email</li>
                <li>Secure hosting and daily backups</li>
              </ul>
              <p>Update your website anytime. No coding, no delays — you're in control.</p>
            </div>

            {/* PREMIUM PLAN */}
            <div className="plan" id="plan-premium">
              <h3>Premium Plan — Advanced Business Website</h3>
              <p className="muted">For businesses ready to grow. Add new content, create pages, and engage visitors with smart, dynamic elements.</p>
              <ul>
                <li>Everything from the Starter Plan</li>
                <li>Sidebar widgets: news tickers, slideshows, announcements</li>
                <li>Advanced forms (quotes, bookings, contact requests)</li>
                <li>Team access (multi-user dashboard)</li>
                <li>Analytics & traffic insights</li>
                <li>Optional add-ons: CRM, newsletter sync, social automation</li>
                <li><b>Add more pages and detailed service or product pages</b></li>
              </ul>
              <p>Ideal for growing businesses that need flexibility, features, and room to expand.</p>
            </div>

            {/* ONLINE STORE */}
            <div className="plan" id="plan-store">
              <h3>Online Store Plan — Sell Products or Services</h3>
              <p className="muted">A full e-commerce website integrated with JCW hosting and payment tools. Simple to set up, powerful to manage.</p>
              <ul>
                <li>Product management dashboard</li>
                <li>EU payments (iDEAL, Bancontact, cards, etc.)</li>
                <li>Shipping and tax settings</li>
                <li>Automatic invoices and email receipts</li>
                <li>Multi-currency support</li>
              </ul>
              <p>Start selling online with your brand — no plugins or technical setup required.</p>
            </div>

          </div>

          <div className="container cta">
            <a className="btn" href="#">Compare Plans</a>
          </div>
        </section>

        <section className="section section-pad core-section">
          <div className="container">
            <h2>Every Plan Comes With Our Core Promise</h2>
            <ul>
              <li>Free domain & hosting for the first year</li>
              <li>EU-based secure servers</li>
              <li>SSL certificate & daily backups</li>
              <li>Fast delivery time</li>
              <li>Ongoing upgrade options</li>
            </ul>
            <p>All websites are created with our smart system that makes content creation simple and intuitive — so you can focus on your business, not on the tools.</p>
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