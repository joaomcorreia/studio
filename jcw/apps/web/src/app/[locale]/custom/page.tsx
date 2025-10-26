'use client'

import { useEffect } from 'react'

export default function CustomWebsitesPage() {
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
        :root{
          --bg:#0a1a5e;--bg2:#0d2b88;--blue:#2152ff;
          --white:#fff;--muted:#64748b;--line:#e6ecff;--max:1100px;
        }
        
        .custom-container {
          font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
          margin:0;color:#0f172a;background:#fff;
        }
        
        .custom-container h1,
        .custom-container h2,
        .custom-container h3{margin:0 0 10px}
        
        .custom-container p{margin:0 0 18px;line-height:1.7}
        
        .custom-container ul{margin:0 0 18px 18px;line-height:1.7}
        
        .container{max-width:var(--max);margin:0 auto;padding:0 20px}
        
        .section-pad{padding:80px 0}
        
        .badge{display:inline-block;background:#eef2ff;color:#3442d9;padding:6px 10px;
               border-radius:999px;font-size:12px;font-weight:600;margin-bottom:14px}
        
        .muted{color:var(--muted)}
        
        .card{border:1px solid var(--line);border-radius:16px;padding:26px;background:#fff;
              box-shadow:0 8px 20px rgba(33,82,255,.08)}
        
        .grid{display:grid;gap:18px}
        .grid-2{grid-template-columns:1fr 1fr}
        .grid-3{grid-template-columns:repeat(3,1fr)}
        
        .cta{text-align:center;margin-top:40px}
        
        .btn{background:var(--blue);color:#fff;text-decoration:none;padding:12px 22px;
             border-radius:999px;font-weight:600}
        
        header#jcw-pages-06-custom-hero{
          background:linear-gradient(180deg,var(--bg),var(--bg2));color:#fff;padding:100px 0;text-align:center;
        }
        
        header h1{font-size:42px;line-height:1.1;margin-bottom:14px}
        header p{max-width:720px;margin:0 auto;color:#d7e2ff}
        
        section h2{font-size:26px;color:#0a1a5e;margin-bottom:10px}
        
        footer{text-align:center;padding:40px 0;color:#9ca3af;font-size:14px;border-top:1px solid var(--line)}
        
        @media (max-width:900px){.grid-3{grid-template-columns:1fr 1fr}}
        @media (max-width:720px){
          header h1{font-size:32px}
          .grid-2,.grid-3{grid-template-columns:1fr}
        }
      `}</style>

      <div className="custom-container">
        {/* HERO */}
        <header id="jcw-pages-06-custom-hero">
          <div className="container">
            <h1>Custom Websites</h1>
            <p>Tailored websites built for specific goals, advanced features, or full system integrations — designed around your business, not a template.</p>
          </div>
        </header>

        {/* OVERVIEW */}
        <section id="jcw-pages-06-overview" className="section-pad">
          <div className="container">
            <div className="badge">Fully Tailored</div>
            <h2>When You Need More Than a Standard Website</h2>
            <p className="muted">
              Custom Websites are built for projects that go beyond the limits of regular plans. 
              From unique layouts to advanced dashboards and multi-system integrations, every feature is adapted to fit your exact needs. 
              Ideal for companies that require automation, dynamic content, or custom data handling.
            </p>
          </div>
        </section>

        {/* FEATURES */}
        <section id="jcw-pages-06-features" className="section-pad" style={{paddingTop:'30px'}}>
          <div className="container grid grid-3">
            <div className="card">
              <h3>Custom Design & Layouts</h3>
              <ul>
                <li>Unique page structures designed for your brand</li>
                <li>Advanced animations and visual effects (React, Next.js, Framer Motion)</li>
                <li>Personalized user journeys and landing flows</li>
              </ul>
            </div>

            <div className="card">
              <h3>Custom Forms & Logic</h3>
              <ul>
                <li>Unlimited custom forms (quotes, bookings, requests, reports)</li>
                <li>Conditional logic and field validation</li>
                <li>Email routing, file uploads, and form analytics</li>
              </ul>
              <p className="muted">Forms can be connected to CRMs, spreadsheets, or your own admin dashboard for follow-ups.</p>
            </div>

            <div className="card">
              <h3>Advanced Integrations</h3>
              <ul>
                <li>Facebook, Instagram, and Google Business integration</li>
                <li>Payment and booking systems</li>
                <li>CRM and newsletter tools (HubSpot, Mailchimp, etc.)</li>
                <li>POS or print-on-demand connectivity (ProWebZone compatible)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* MANAGEMENT */}
        <section id="jcw-pages-06-manage" className="section-pad" style={{background:'#f8f9ff'}}>
          <div className="container grid grid-2">
            <div>
              <div className="badge">Control & Expand</div>
              <h2>Flexible Admin and Scalable Structure</h2>
              <p>Each custom site includes an editable dashboard, just like our Starter and Premium plans, but extended with modules made for your project. You can manage pages, services, or even custom data directly from your admin panel.</p>
              <ul>
                <li>Multi-language support (EN, NL, FR, ES, PT)</li>
                <li>Advanced SEO controls and structured data</li>
                <li>Role-based access for teams</li>
                <li>Integrated analytics and reporting</li>
              </ul>
            </div>
            <div className="card">
              <h3>Examples of Custom Use Cases</h3>
              <ul>
                <li>Booking or appointment systems</li>
                <li>Customer portals with login</li>
                <li>Directory or listing features (ListAcross-style)</li>
                <li>Product configurators or calculators</li>
                <li>Printable materials and QR-code tools</li>
              </ul>
            </div>
          </div>
        </section>

        {/* SUPPORT */}
        <section id="jcw-pages-06-support" className="section-pad">
          <div className="container">
            <div className="badge">Ongoing Support</div>
            <h2>We Stay Involved After Launch</h2>
            <p className="muted">
              Our team monitors performance, runs updates, and can implement new modules as your business grows.
              You can request changes, add features, or connect external platforms anytime through your dashboard.
            </p>
            <ul>
              <li>Regular backups and uptime monitoring</li>
              <li>Priority technical support</li>
              <li>Monthly reports and recommendations</li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section id="jcw-pages-06-cta" className="section-pad" style={{background:'#f0f4ff'}}>
          <div className="container" style={{textAlign:'center'}}>
            <h2>Ready For a Custom Website?</h2>
            <p className="muted">Let's build a website designed around your workflow, customers, and goals — not a template. You share your idea; we design the system.</p>
            <div className="cta">
              <a href="#" className="btn">Request a Custom Build</a>
            </div>
          </div>
        </section>

        <footer>
          <div className="container">
            © <span id="year"></span> Just Code Works — Websites That Work
          </div>
        </footer>
      </div>
    </>
  )
}