'use client'

import { useEffect } from 'react'

export default function EcommercePage() {
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
        
        .ecommerce-container {
          font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
          margin: 0;
          color: #0f172a;
          background: #fff;
        }
        
        .ecommerce-container h1,
        .ecommerce-container h2,
        .ecommerce-container h3 {
          margin: 0 0 10px;
        }
        
        .ecommerce-container p {
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
        
        @media (max-width: 720px) {
          .hero h1 {
            font-size: 32px;
          }
          .plan-box {
            padding: 20px;
          }
        }
      `}</style>

      <div className="ecommerce-container">
        <header className="hero">
          <div className="container">
            <h1>E-commerce Store Solutions</h1>
            <p>Start selling online with a professional e-commerce website. Payment processing, inventory management, and everything you need to run a successful online business.</p>
          </div>
        </header>

        <section className="section section-pad">
          <div className="container">
            <div className="badge">Full E-commerce Platform</div>
            <h2>Everything You Need to Sell Online</h2>
            <p className="muted">Our e-commerce solutions include professional design, secure payment processing, inventory management, and all the tools you need to run a successful online store.</p>
          </div>
        </section>

        <section className="section section-pad" style={{ paddingTop: '30px' }}>
          <div className="container">
            <div className="plan-box">
              <h3>E-commerce Features</h3>
              <ul>
                <li>Professional online store design</li>
                <li>Secure payment processing (EU compliant)</li>
                <li>Inventory management system</li>
                <li>Order tracking and management</li>
                <li>Customer account system</li>
                <li>Multi-currency support</li>
                <li>Mobile-optimized shopping experience</li>
                <li>SEO optimization for products</li>
                <li>Analytics and reporting</li>
                <li>SSL security and daily backups</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="section section-pad center" style={{ background: '#f8f9ff' }}>
          <div className="container">
            <h2>Ready to Start Selling Online?</h2>
            <p className="muted">Get your e-commerce store up and running with professional design and all the features you need to succeed.</p>
            <div className="cta">
              <a href="#" className="btn">Start Your Store</a>
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