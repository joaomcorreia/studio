'use client'

import { useEffect } from 'react'

export default function MultiPagePremiumPage() {
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
        
        .multipage-container {
          font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
          margin: 0;
          color: #0f172a;
          background: #fff;
        }
        
        .multipage-container h1,
        .multipage-container h2,
        .multipage-container h3 {
          margin: 0 0 10px;
        }
        
        .multipage-container p {
          margin: 0 0 18px;
          line-height: 1.7;
        }
        
        .multipage-container ul {
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
        
        .plan-box {
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 26px;
          background: #fff;
          box-shadow: 0 8px 20px rgba(33, 82, 255, 0.08);
          transition: all 0.3s ease;
        }
        
        .plan-box:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(33, 82, 255, 0.15);
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
        
        .facebook-section {
          background: #f8f9ff;
        }
        
        .facebook-section ul {
          margin: 0 0 18px 18px;
          line-height: 1.7;
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

      <div className="multipage-container">
        <header className="hero">
          <div className="container">
            <h1>Starter Plan — Editable Multi-Page Website</h1>
            <p>Take control of your content. Update your pages, connect your Facebook, and grow your online presence — all from one place.</p>
          </div>
        </header>

        <section className="section section-pad">
          <div className="container">
            <div className="badge">Editable &amp; Expandable</div>
            <h2>Your Website, Always Up-to-Date</h2>
            <p className="muted">The Starter Plan is built for businesses that want a flexible website with multiple pages and the freedom to update it anytime. You can edit text, photos, services, and SEO details easily from your own dashboard — no coding required.</p>
          </div>
        </section>

        <section className="section section-pad" style={{ paddingTop: '30px' }}>
          <div className="container">
            <div className="plan-box">
              <h3>What's Included</h3>
              <ul>
                <li>Fully editable multi-page website (Home, About, Services, Contact, etc.)</li>
                <li>Clean, responsive design with mobile optimization</li>
                <li>Simple admin panel for content, images, and SEO</li>
                <li>Blog or news section ready to use</li>
                <li>Multi-language support (EN, NL, FR, ES, PT)</li>
                <li>Free domain &amp; hosting for the first year</li>
                <li>SSL, backups, and analytics</li>
              </ul>
              <p className="muted">Update your website anytime you want — we made it simple, secure, and fast.</p>
            </div>
          </div>
        </section>

        <section className="section section-pad facebook-section">
          <div className="container">
            <div className="badge">Facebook Integration</div>
            <h2>Connect Your Website to Facebook</h2>
            <p>The Starter Plan can include Facebook integration — perfect if you want your website and your Facebook Business Page to work together.</p>
            <ul>
              <li>Automatic link between your website and your Facebook page</li>
              <li>Option for JCW to manage or help maintain your business page</li>
              <li>Monthly posting plan — at least <b>two posts per week</b> created and published for you</li>
            </ul>
            <p className="muted">
              If you don't have a Facebook Business Page, we can create one for you.  
              If you already have one, you'll simply grant JCW limited access so we can connect and manage it for posting — we make the setup quick and easy.
            </p>
          </div>
        </section>

        <section className="section section-pad">
          <div className="container">
            <h2>Why Choose the Starter Plan?</h2>
            <ul>
              <li>Full control over your pages and content</li>
              <li>Multi-page structure ready to grow with your business</li>
              <li>Facebook integration for stronger social visibility</li>
              <li>SEO-ready and secure by default</li>
              <li>Upgrade anytime to add more features or widgets</li>
            </ul>
            <p>The Starter Plan is ideal if you want a website that's more than static — one that evolves with your business, and connects smoothly with your social channels.</p>
          </div>
        </section>

        <section className="section section-pad facebook-section">
          <div className="container center">
            <h2>Ready to Take Control of Your Website?</h2>
            <p className="muted">Start editing your own content, connect your Facebook, and grow your online presence with confidence.</p>
            <div className="cta">
              <a href="#" className="btn">Start with Starter Plan</a>
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