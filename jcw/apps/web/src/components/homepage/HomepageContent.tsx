'use client'

import React, { useState, useEffect } from 'react'
import { AnimatedSection, HoverEffect, ParallaxEffect, LoadingEffect, ClickEffect, ParticleNetwork } from '../effects'

export function HomepageContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  // Set current year for footer
  useEffect(() => {
    const yearElement = document.getElementById('year')
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear().toString()
    }
  }, [])

  return (
    <div>
      <style jsx>{`
        :root{
          --bg:#0a1a5e;
          --bg2:#0d2b88;
          --blue:#2152ff;
          --blue-2:#3a6bff;
          --indigo:#4f46e5;
          --white:#ffffff;
          --text:#0f172a;
          --muted:#64748b;
          --soft:#f6f9ff;
          --card:#ffffff;
          --line:#e6ecff;
          --accent:#ffb703;
          --success:#00c389;
          --shadow:0 10px 25px rgba(13,27,136,.12);
          --radius:16px;
          --radius-sm:12px;
          --radius-lg:22px;
          --max:1120px;
        }

        /* ——— Base ——— */
        *{box-sizing:border-box}
        html,body{margin:0;padding:0;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:var(--text);background:#fff}
        img{max-width:100%;display:block}
        /* Container styles - boxed for main content, full width for header/footer */
        .container{max-width:var(--max);margin:0 auto;padding:0 20px}
        .container-full{width:100%;padding:0}
        .content-boxed{max-width:1200px;margin:0 auto;padding:0 20px}
        
        .grid{display:grid;gap:20px}
        .btn{display:inline-flex;align-items:center;justify-content:center;padding:12px 18px;border-radius:999px;font-weight:600;text-decoration:none;transition:.2s}
        .btn-primary{background:var(--blue);color:#fff;box-shadow:0 8px 20px rgba(33,82,255,.25)}
        .btn-primary:hover{transform:translateY(-1px);filter:brightness(1.05)}
        .btn-ghost{background:#fff;color:var(--blue);border:1px solid var(--line)}
        .badge{display:inline-block;padding:6px 10px;border-radius:999px;background:#eef2ff;color:#3442d9;font-weight:600;font-size:12px}
        .muted{color:var(--muted)}
        .card{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow)}
        .section-pad{padding:80px 0}
        .center{text-align:center}

        /* Main content sections - boxed layout */
        .main-content{
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Placeholders */
        .ph{background:#e5e7eb;border:2px dashed #c7cddc;border-radius:12px;position:relative;display:flex;align-items:center;justify-content:center;color:#6b7280;font-weight:700}
        .ph::after{content:attr(data-size);font-size:14px;letter-spacing:.6px}

        /* ——— Top band / header ——— */
        #jcw-core-01-hero{
          background: linear-gradient(135deg, #0a1a5e 0%, #2152ff 50%, #0d2b88 100%);
          color:#fff; 
          position:relative; 
          overflow:hidden;
          width: 100%;
        }
        .topbar{
          font-size:12px;
          opacity:.9;
          padding:8px 0;
          border-bottom:1px solid rgba(255,255,255,.15);
          background: linear-gradient(135deg, #0a1a5e 0%, #2152ff 50%, #0d2b88 100%);
          width: 100%;
        }
        nav.header{display:flex;align-items:center;justify-content:space-between;padding:18px 0}
        .logo{display:flex;gap:10px;align-items:center;font-weight:800;letter-spacing:.2px}
        .logo span{opacity:.9}
        .nav-actions{display:flex;gap:10px;align-items:center}
        .hero{display:grid;grid-template-columns:1.2fr .9fr;gap:32px;align-items:center;padding:36px 0 24px}
        .hero h1{font-size:42px;line-height:1.1;margin:0 0 16px}
        .hero h1 .accent{color:#ffd166}
        .hero p{color:#d7e2ff;margin:0 0 22px}
        .hero .cta{display:flex;gap:12px;align-items:center}
        .hero .micro{display:flex;gap:14px;margin-top:22px}
        .hero .micro .mini{background:#0f1f75;border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:14px 16px;min-width:120px}
        .hero .mini b{display:block;color:#fff}
        .hero .mini small{color:#9fb3ff}

        /* icon grid band below hero */
        #jcw-core-02-icons .icons{display:grid;grid-template-columns:repeat(6,1fr);gap:18px}
        #jcw-core-02-icons .icon{padding:16px;border-radius:12px;background:#fff;border:1px solid var(--line);box-shadow:var(--shadow);text-align:center}
        #jcw-core-02-icons .icon b{display:block;margin-top:8px}

        /* ——— Hosting features ——— */
        #jcw-core-03-benefits .cols{display:grid;grid-template-columns:1.1fr 1fr;gap:28px}
        .feature-stack{display:grid;gap:14px}
        .feature{display:grid;grid-template-columns:54px 1fr;gap:12px;padding:14px;border:1px solid var(--line);border-radius:12px;background:#fff}
        .feature h4{margin:2px 0 6px}
        .feature p{margin:0;color:var(--muted);font-size:14px}
        .diagram{display:grid;grid-template-columns:1fr;gap:14px}

        /* ——— Stats band ——— */
        #jcw-core-04-stats{padding:50px 0}
        .stats{display:grid;grid-template-columns:1fr 1fr;gap:28px;align-items:center}
        .stat-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
        .stat{border:1px solid var(--line);border-radius:12px;background:#fff;padding:14px 16px;text-align:center}
        .stat b{font-size:22px}

        /* ——— Pricing ——— */
        #jcw-core-05-pricing{background:var(--soft)}
        .pricing-head{margin-bottom:18px}
        .plans{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}
        .plan{position:relative;padding:22px 18px;border-radius:16px;border:1px solid var(--line);background:#fff;box-shadow:var(--shadow)}
        .plan .title{font-weight:800}
        .plan .price{font-size:32px;margin:10px 0}
        .plan ul{list-style:none;margin:12px 0 0;padding:0;display:grid;gap:8px;color:var(--muted);font-size:14px}
        .plan .cta{margin-top:16px}
        .plan.hot{border-color:var(--blue);outline:3px solid rgba(33,82,255,.15)}
        .plan .ribbon{position:absolute;top:-10px;right:18px;background:var(--blue);color:#fff;padding:5px 10px;border-radius:999px;font-size:12px}

        /* ——— Services grid ——— */
        #jcw-core-06-services .grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}
        #jcw-core-06-services .svc{padding:18px;border:1px solid var(--line);border-radius:14px;background:#fff}
        #jcw-core-06-services .svc h4{margin:8px 0}

        /* ——— Flash sale strip ——— */
        #jcw-core-07-flash{
          background:linear-gradient(135deg, #0d2b88, #1633a3 60%, #2152ff);
          color:#fff;
        }
        .flash{display:grid;grid-template-columns:.9fr 1.1fr;gap:24px;align-items:center}
        .flash .promo-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
        .promo{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.18);border-radius:14px;padding:16px}
        .promo b{display:block;color:#fff;margin-bottom:6px}

        /* ——— Payments CTA ——— */
        #jcw-core-08-payments .wrap{display:grid;grid-template-columns:1fr .8fr;gap:28px;align-items:center}

        /* ——— Support banner ——— */
        #jcw-core-09-support .support{display:grid;grid-template-columns:140px 1fr 120px;gap:18px;align-items:center;padding:18px;border-radius:16px;border:1px solid var(--line);background:#fff;box-shadow:var(--shadow)}

        /* ——— FAQ ——— */
        #jcw-core-10-faq .faq{display:grid;grid-template-columns:1fr;gap:10px}
        details{border:1px solid var(--line);border-radius:12px;padding:14px;background:#fff}
        details>summary{cursor:pointer;font-weight:600}
        details p{margin:10px 0 0;color:var(--muted)}

        /* ——— Blog cards ——— */
        #jcw-core-11-blog .posts{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
        .post{border:1px solid var(--line);border-radius:14px;background:#fff;overflow:hidden;box-shadow:var(--shadow)}
        .post .body{padding:14px}
        .post .meta{font-size:12px;color:var(--muted)}

        /* ——— Footer ——— */
        #jcw-core-12-footer{
          background:linear-gradient(180deg,#0d1c6a,#0a1654 60%,#071041);
          color:#c9d2ff;
        }
        .footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:28px}
        .footer-grid h5{color:#fff;margin:8px 0}
        .footer-grid ul{list-style:none;margin:0;padding:0;display:grid;gap:8px}
        .footer-grid a{color:#c9d2ff;text-decoration:none}
        .sub-footer{border-top:1px solid rgba(255,255,255,.15);margin-top:28px;padding-top:14px;color:#aab4ff;font-size:13px;display:flex;justify-content:space-between;align-items:center}

        /* ——— Responsive ——— */
        @media (max-width:1080px){
          .hero{grid-template-columns:1fr}
          #jcw-core-02-icons .icons{grid-template-columns:repeat(3,1fr)}
          .plans{grid-template-columns:repeat(2,1fr)}
          #jcw-core-06-services .grid4{grid-template-columns:repeat(2,1fr)}
          .flash{grid-template-columns:1fr}
          .flash .promo-cards{grid-template-columns:repeat(2,1fr)}
          #jcw-core-08-payments .wrap{grid-template-columns:1fr}
          .footer-grid{grid-template-columns:1fr 1fr}
        }
        @media (max-width:640px){
          .stat-cards{grid-template-columns:1fr}
          .plans{grid-template-columns:1fr}
          #jcw-core-06-services .grid4{grid-template-columns:1fr}
          .flash .promo-cards{grid-template-columns:1fr}
          #jcw-core-09-support .support{grid-template-columns:1fr}
          #jcw-core-02-icons .icons{grid-template-columns:repeat(2,1fr)}
          .footer-grid{grid-template-columns:1fr}
        }

        /* Footer: split into top + bottom sections */
        #jcw-core-12-footer .footer-top{
          display:grid; gap:20px; margin-bottom:26px;
        }
        .footer-top .groups{
          display:grid; grid-template-columns:2fr 2fr; gap:18px;
        }
        .footer-card{
          background:rgba(255,255,255,.04);
          border:1px solid rgba(255,255,255,.15);
          border-radius:14px; padding:18px;
        }
        .footer-card h5{color:#fff;margin:0 0 10px}
        .footer-card ul{list-style:none;margin:0;padding:0;display:grid;gap:10px}
        .footer-card a{
          color:#d7deff; text-decoration:none;
        }
        .footer-card a:hover{ text-decoration:underline }

        /* keep your existing .footer-grid below the divider (unchanged) */
        #jcw-core-12-footer .divider{
          border-top:1px solid rgba(255,255,255,.18);
          margin:6px 0 20px 0;
        }

        /* responsive */
        @media (max-width:900px){
          .footer-top .groups{grid-template-columns:1fr}
        }

        /* ——— Cloud/Smoke Effects ——— */
        .clouds {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
          pointer-events: none;
        }
        
        .cloud {
          position: absolute;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 100px;
          opacity: 0.6;
          animation: float 20s infinite linear;
          filter: blur(2px);
        }
        
        .cloud:before {
          content: '';
          position: absolute;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 100px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 120%;
          height: 120%;
        }
        
        .cloud1 {
          width: 200px;
          height: 60px;
          top: 20%;
          left: -200px;
          animation-duration: 25s;
          animation-delay: 0s;
        }
        
        .cloud2 {
          width: 150px;
          height: 40px;
          top: 40%;
          left: -150px;
          animation-duration: 30s;
          animation-delay: 5s;
        }
        
        .cloud3 {
          width: 180px;
          height: 50px;
          top: 60%;
          left: -180px;
          animation-duration: 35s;
          animation-delay: 10s;
        }
        
        .cloud4 {
          width: 120px;
          height: 35px;
          top: 80%;
          left: -120px;
          animation-duration: 28s;
          animation-delay: 15s;
        }
        
        .cloud5 {
          width: 160px;
          height: 45px;
          top: 10%;
          left: -160px;
          animation-duration: 32s;
          animation-delay: 20s;
        }
        
        @keyframes float {
          0% {
            transform: translateX(0) translateY(0px);
          }
          25% {
            transform: translateX(25vw) translateY(-10px);
          }
          50% {
            transform: translateX(50vw) translateY(5px);
          }
          75% {
            transform: translateX(75vw) translateY(-5px);
          }
          100% {
            transform: translateX(100vw) translateY(0px);
          }
        }
        
        /* Nebula Effect */
        .nebula {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(ellipse at 20% 30%, rgba(33, 82, 255, 0.05) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 70%, rgba(26, 41, 128, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 60% 20%, rgba(255, 209, 102, 0.03) 0%, transparent 40%);
          pointer-events: none;
          animation: nebulaPulse 15s ease-in-out infinite alternate;
        }
        
        @keyframes nebulaPulse {
          0% {
            opacity: 0.3;
          }
          100% {
            opacity: 0.7;
          }
        }
      `}</style>

      <div>
        {/* Top thin strip */}
        <div className="topbar" id="topbar">
          <div className="container center" style={{color:'#d7e2ff'}}>
            Just Code Works · Websites with <b>Domain &amp; Hosting</b> for the first year · AI tools included
          </div>
        </div>

        {/* Header + Hero */}
        <header id="jcw-core-01-hero" style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Nebula Background Effect */}
          <div className="nebula"></div>
          
          {/* Clouds/Smoke Effect */}
          <div className="clouds">
            <div className="cloud cloud1"></div>
            <div className="cloud cloud2"></div>
            <div className="cloud cloud3"></div>
            <div className="cloud cloud4"></div>
            <div className="cloud cloud5"></div>
          </div>
          
          {/* Particle Network Background */}
          <ParticleNetwork 
            className="z-0"
            particleCount={60}
            connectionDistance={150}
            particleSpeed={0.3}
            colors={[
              '#3B82F6', // Blue
              '#8B5CF6', // Purple  
              '#EF4444', // Red
              '#10B981', // Green
              '#F59E0B', // Amber
              '#EC4899', // Pink
              '#06B6D4', // Cyan
              '#FFD166'  // Gold accent
            ]}
          />
          <div className="container" style={{ position: 'relative', zIndex: 10 }}>
            <AnimatedSection animation="fadeIn" duration={0.6}>
              <nav className="header">
                <HoverEffect effect="lift" intensity="light">
                  <div className="logo">
                    <div className="ph" data-size="Logo" style={{width:'38px',height:'38px',background:'#3353ff',borderColor:'#89a0ff',color:'#fff',borderStyle:'solid'}}></div>
                    <span>Just Code Works</span>
                  </div>
                </HoverEffect>
                <div className="nav-actions">
                  <ClickEffect effect="ripple">
                    <a className="btn btn-ghost" href="#">Login</a>
                  </ClickEffect>
                  <ClickEffect effect="glow">
                    <a className="btn btn-primary" href="#">Get Started</a>
                  </ClickEffect>
                </div>
              </nav>
            </AnimatedSection>

            <section className="hero">
              <AnimatedSection animation="slideUp" delay={0.2}>
                <div>
                  <AnimatedSection animation="fadeIn" delay={0.4}>
                    <span className="badge">Websites • Domains • Hosting • AI</span>
                  </AnimatedSection>
                  <AnimatedSection animation="slideUp" delay={0.6}>
                    <h1>Websites With <span className="accent">Domain</span> &amp; Hosting<br/>For The First Year</h1>
                  </AnimatedSection>
                  <AnimatedSection animation="fadeIn" delay={0.8}>
                    <p>Create your site quickly with our AI tools, secure hosting, and friendly dashboard.</p>
                  </AnimatedSection>
                  <AnimatedSection animation="slideUp" delay={1.0}>
                    <div className="cta">
                      <HoverEffect effect="lift" intensity="medium">
                        <ClickEffect effect="pulse">
                          <a className="btn btn-primary" href="#">Start Free</a>
                        </ClickEffect>
                      </HoverEffect>
                      <HoverEffect effect="glow" intensity="light">
                        <ClickEffect effect="ripple">
                          <a className="btn btn-ghost" href="#">See Plans</a>
                        </ClickEffect>
                      </HoverEffect>
                    </div>
                  </AnimatedSection>
                  <AnimatedSection animation="slideUp" delay={1.2}>
                    <div className="micro">
                      <HoverEffect effect="lift" intensity="light">
                        <div className="mini"><b>99.9% Uptime</b><small>monitored 24/7</small></div>
                      </HoverEffect>
                      <HoverEffect effect="lift" intensity="light">
                        <div className="mini"><b>SSL &amp; Backups</b><small>always-on</small></div>
                      </HoverEffect>
                      <HoverEffect effect="lift" intensity="light">
                        <div className="mini"><b>EU-Ready</b><small>multi-language</small></div>
                      </HoverEffect>
                    </div>
                  </AnimatedSection>
                </div>
              </AnimatedSection>
              <AnimatedSection animation="slideLeft" delay={0.4}>
                <div>
                  <ParallaxEffect speed={-0.1}>
                    <HoverEffect effect="scale" intensity="light">
                      <div className="ph" data-size="504x675" style={{width:'100%',height:'520px'}}></div>
                    </HoverEffect>
                  </ParallaxEffect>
                </div>
              </AnimatedSection>
            </section>
          </div>
        </header>

        {/* Icon grid band */}
        <AnimatedSection animation="fadeIn" delay={0.3}>
          <section id="jcw-core-02-icons" className="section-pad" style={{paddingTop:'24px'}}>
            <div className="main-content">
              <div className="icons">
                <AnimatedSection animation="bounceIn" delay={0.1}>
                  <HoverEffect effect="lift" intensity="medium">
                    <div className="icon"><div className="ph" data-size="24" style={{width:'36px',height:'36px'}}></div><b>Modern Web Design</b></div>
                  </HoverEffect>
                </AnimatedSection>
                <AnimatedSection animation="bounceIn" delay={0.2}>
                  <HoverEffect effect="lift" intensity="medium">
                    <div className="icon"><div className="ph" data-size="24" style={{width:'36px',height:'36px'}}></div><b>SEO &amp; Google Tools</b></div>
                  </HoverEffect>
                </AnimatedSection>
                <AnimatedSection animation="bounceIn" delay={0.3}>
                  <HoverEffect effect="lift" intensity="medium">
                    <div className="icon"><div className="ph" data-size="24" style={{width:'36px',height:'36px'}}></div><b>AI &amp; Automation</b></div>
                  </HoverEffect>
                </AnimatedSection>
                <AnimatedSection animation="bounceIn" delay={0.4}>
                  <HoverEffect effect="lift" intensity="medium">
                    <div className="icon"><div className="ph" data-size="24" style={{width:'36px',height:'36px'}}></div><b>Secure Hosting</b></div>
                  </HoverEffect>
                </AnimatedSection>
                <AnimatedSection animation="bounceIn" delay={0.5}>
                  <HoverEffect effect="lift" intensity="medium">
                    <div className="icon"><div className="ph" data-size="24" style={{width:'36px',height:'36px'}}></div><b>Free Domain &amp; Email</b></div>
                  </HoverEffect>
                </AnimatedSection>
                <AnimatedSection animation="bounceIn" delay={0.6}>
                  <HoverEffect effect="lift" intensity="medium">
                    <div className="icon"><div className="ph" data-size="24" style={{width:'36px',height:'36px'}}></div><b>Admin Dashboard</b></div>
                  </HoverEffect>
                </AnimatedSection>
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* Hosting + diagram */}
        <AnimatedSection animation="slideUp">
          <section id="jcw-core-03-benefits" className="section-pad">
            <div className="main-content cols">
              <AnimatedSection animation="slideRight" delay={0.2}>
                <div className="feature-stack">
                  <AnimatedSection animation="fadeIn" delay={0.1}>
                    <span className="badge">Secure Web Application Hosting</span>
                  </AnimatedSection>
                  <AnimatedSection animation="slideUp" delay={0.3}>
                    <h2 style={{margin:'10px 0 6px'}}>Just Code Works Provides Secure &amp; Web Application Hosting</h2>
                  </AnimatedSection>
                  <AnimatedSection animation="slideUp" delay={0.4}>
                    <HoverEffect effect="lift" intensity="light">
                      <div className="feature">
                        <div className="ph" data-size="54" style={{width:'54px',height:'54px'}}></div>
                        <div>
                          <h4>Free &amp; Simple Hosting</h4>
                          <p>Launch fast on our EU servers. SSL, backups, and CDN included.</p>
                        </div>
                      </div>
                    </HoverEffect>
                  </AnimatedSection>
                  <AnimatedSection animation="slideUp" delay={0.5}>
                    <HoverEffect effect="lift" intensity="light">
                      <div className="feature">
                        <div className="ph" data-size="54" style={{width:'54px',height:'54px'}}></div>
                        <div>
                          <h4>Managed Updates</h4>
                          <p>We ship security updates and keep your stack healthy.</p>
                        </div>
                      </div>
                    </HoverEffect>
                  </AnimatedSection>
                  <AnimatedSection animation="slideUp" delay={0.6}>
                    <HoverEffect effect="lift" intensity="light">
                      <div className="feature">
                        <div className="ph" data-size="54" style={{width:'54px',height:'54px'}}></div>
                        <div>
                          <h4>Global CDN &amp; Backups</h4>
                          <p>Daily snapshots with one-click restore points.</p>
                        </div>
                      </div>
                    </HoverEffect>
                  </AnimatedSection>
                </div>
              </AnimatedSection>
              <AnimatedSection animation="slideLeft" delay={0.4}>
                <div className="diagram">
                  <ParallaxEffect speed={0.2}>
                    <HoverEffect effect="scale" intensity="light">
                      <div className="ph" data-size="666x637" style={{width:'100%',height:'420px'}}></div>
                    </HoverEffect>
                  </ParallaxEffect>
                </div>
              </AnimatedSection>
            </div>
          </section>
        </AnimatedSection>

        {/* Stats */}
        <section id="jcw-core-04-stats" className="section-pad" style={{paddingTop:'20px'}}>
          <div className="main-content stats">
            <div>
              <span className="badge">Our Mission</span>
              <h3 style={{margin:'8px 0 10px'}}>Helping Small Businesses Succeed Online</h3>
              <p className="muted">Affordable, scalable websites with built-in tools so you can focus on your business, not tooling.</p>
            </div>
            <div className="stat-cards">
              <div className="stat"><b>50+</b><div className="muted">Integrations</div></div>
              <div className="stat"><b>100%</b><div className="muted">GDPR Ready</div></div>
              <div className="stat">
                <div className="ph" data-size="110x45" style={{width:'100%',height:'45px'}}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="jcw-core-05-pricing" className="section-pad">
          <div className="main-content center">
            <div className="pricing-head">
              <span className="badge">Plans &amp; Pricing</span>
              <h3 style={{margin:'10px 0 6px'}}>Choose The Right Plan For Your Business</h3>
              <div className="muted">Start simple — upgrade anytime.</div>
            </div>

            <div className="plans">
              <div className="plan">
                <div className="title">Starter</div>
                <div className="price">€9<span style={{fontSize:'14px'}}> /mo</span></div>
                <ul>
                  <li>Website + Free Domain (Year 1)</li>
                  <li>SSL &amp; Backups</li>
                  <li>Basic AI Tools</li>
                </ul>
                <div className="cta"><a className="btn btn-ghost" href="#">Choose Starter</a></div>
              </div>

              <div className="plan hot">
                <div className="ribbon">Popular</div>
                <div className="title">Growth</div>
                <div className="price">€19<span style={{fontSize:'14px'}}> /mo</span></div>
                <ul>
                  <li>Everything in Starter</li>
                  <li>Blog + SEO tools</li>
                  <li>E-commerce Ready</li>
                </ul>
                <div className="cta"><a className="btn btn-primary" href="#">Choose Growth</a></div>
              </div>

              <div className="plan">
                <div className="title">Business</div>
                <div className="price">€29<span style={{fontSize:'14px'}}> /mo</span></div>
                <ul>
                  <li>Advanced AI &amp; Automations</li>
                  <li>Priority Support</li>
                  <li>Custom Domains (Multi)</li>
                </ul>
                <div className="cta"><a className="btn btn-ghost" href="#">Choose Business</a></div>
              </div>

              <div className="plan">
                <div className="title">Contact Us</div>
                <div className="price">Custom</div>
                <ul>
                  <li>Enterprise &amp; Dedicated</li>
                  <li>White-Label Options</li>
                  <li>Migration Services</li>
                </ul>
                <div className="cta"><a className="btn btn-ghost" href="#">Talk to Sales</a></div>
              </div>
            </div>
          </div>
        </section>

        {/* Services grid */}
        <section id="jcw-core-06-services" className="section-pad">
          <div className="main-content">
            <div className="center" style={{marginBottom:'18px'}}>
              <span className="badge">What's Included</span>
              <h3 style={{margin:'10px 0 6px'}}>Domains, Tools &amp; Services Built For Your Business</h3>
            </div>
            <div className="grid4">
              <div className="svc">
                <div className="ph" data-size="64" style={{width:'48px',height:'48px'}}></div>
                <h4>Free Domain &amp; Hosting</h4>
                <p className="muted">First year included for new sites.</p>
              </div>
              <div className="svc">
                <div className="ph" data-size="64" style={{width:'48px',height:'48px'}}></div>
                <h4>SEO &amp; Growth Tools</h4>
                <p className="muted">Google-friendly pages and JSON-LD.</p>
              </div>
              <div className="svc">
                <div className="ph" data-size="64" style={{width:'48px',height:'48px'}}></div>
                <h4>AI &amp; Automation</h4>
                <p className="muted">Content, images, assistants.</p>
              </div>
              <div className="svc">
                <div className="ph" data-size="64" style={{width:'48px',height:'48px'}}></div>
                <h4>Pro Design</h4>
                <p className="muted">Templates + custom sections.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Flash sale strip */}
        <section id="jcw-core-07-flash" className="section-pad">
          <div className="main-content flash">
            <div>
              <span className="badge" style={{background:'#2237c8',color:'#fff',border:'1px solid rgba(255,255,255,.25)'}}>Limited Time</span>
              <h3 style={{margin:'10px 0 6px',color:'#fff'}}>Hosting Flash Sale</h3>
              <p style={{color:'#e4e9ff'}}>Claim introductory pricing and free setup when you launch this week.</p>
              <a className="btn btn-primary" href="#" style={{background:'#fff',color:'#1b2fff'}}>Claim Offer</a>
            </div>
            <div className="promo-cards">
              <div className="promo"><b>–40% First 6 Months</b><small>applied at checkout</small></div>
              <div className="promo"><b>Free Domain</b><small>.com/.eu/.nl (yr 1)</small></div>
              <div className="promo"><b>Free Setup</b><small>we migrate or install</small></div>
            </div>
          </div>
        </section>

        {/* Payments CTA */}
        <section id="jcw-core-08-payments" className="section-pad">
          <div className="main-content wrap">
            <div>
              <span className="badge">Point of Sale &amp; Online</span>
              <h3 style={{margin:'10px 0 6px'}}>Accept Payments In Store, Online, Or Anywhere</h3>
              <p className="muted">Connect your preferred provider and start selling with invoices, checkout links, and POS.</p>
              <ul className="muted" style={{lineHeight:'1.9'}}>
                <li>Card, Apple/Google Pay, iDEAL, Bancontact</li>
                <li>Invoices &amp; recurring subscriptions</li>
                <li>Catalog, tax, and shipping rules</li>
              </ul>
              <a className="btn btn-ghost" href="#">Explore Payments</a>
            </div>
            <div className="ph" data-size="615x592" style={{width:'100%',height:'380px'}}></div>
          </div>
        </section>

        {/* Support banner */}
        <section id="jcw-core-09-support" className="section-pad" style={{paddingTop:'10px'}}>
          <div className="main-content">
            <div className="support">
              <div className="ph" data-size="234x251" style={{width:'120px',height:'120px'}}></div>
              <div>
                <b>24/7 Expert Hosting Support — Powered By AI &amp; Humans</b>
                <div className="muted">Chat with our assistant or a human engineer anytime.</div>
              </div>
              <div><a className="btn btn-primary" href="#">Ask Now</a></div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="jcw-core-10-faq" className="section-pad">
          <div className="main-content">
            <div className="center" style={{marginBottom:'10px'}}>
              <h3>Common Questions About Getting Started Online</h3>
            </div>
            <div className="faq">
              <details>
                <summary>Who Owns My Domain &amp; Website?</summary>
                <p>You do. We can manage DNS/renewals for you, or you can transfer anytime.</p>
              </details>
              <details>
                <summary>Can I Connect Google Analytics and Search Console?</summary>
                <p>Yes — included in all plans via our admin dashboard.</p>
              </details>
              <details>
                <summary>Do You Offer SEO or Marketing Services?</summary>
                <p>We offer DIY tools and optional managed add-ons.</p>
              </details>
              <details>
                <summary>Can I Sell Physical or POS Products?</summary>
                <p>Yes. Use online checkout, POS, or both with unified inventory.</p>
              </details>
            </div>
          </div>
        </section>

        {/* Blog / Insights */}
        <section id="jcw-core-11-blog" className="section-pad" style={{paddingTop:'10px'}}>
          <div className="main-content">
            <div className="center" style={{marginBottom:'16px'}}>
              <h3>Our Latest Tips &amp; Insights</h3>
            </div>
            <div className="posts">
              <article className="post">
                <div className="ph" data-size="450x252" style={{width:'100%',height:'160px'}}></div>
                <div className="body">
                  <div className="meta">5 min • Guide</div>
                  <h4>Why Just Code Works</h4>
                </div>
              </article>
              <article className="post">
                <div className="ph" data-size="450x252" style={{width:'100%',height:'160px'}}></div>
                <div className="body">
                  <div className="meta">6 min • Tutorial</div>
                  <h4>From DIY to Done-For-You</h4>
                </div>
              </article>
              <article className="post">
                <div className="ph" data-size="450x252" style={{width:'100%',height:'160px'}}></div>
                <div className="body">
                  <div className="meta">4 min • Update</div>
                  <h4>New Tools That Save Time</h4>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer id="jcw-core-12-footer" className="section-pad" style={{background:'#f8fafc'}}>
          <div className="container">
            <div className="footer">
              <div>
                <div className="logo">
                  <strong>Just Code Works</strong>
                </div>
                <div className="muted" style={{marginTop:'4px'}}>Websites that work for your business.</div>
              </div>
              <div className="footer-links">
                <div>
                  <b>Product</b>
                  <a href="#" className="muted">Features</a>
                  <a href="#" className="muted">Pricing</a>
                  <a href="#" className="muted">Hosting</a>
                  <a href="#" className="muted">Templates</a>
                </div>
                <div>
                  <b>Resources</b>
                  <a href="#" className="muted">Blog</a>
                  <a href="#" className="muted">Help</a>
                  <a href="#" className="muted">Status</a>
                  <a href="#" className="muted">Guides</a>
                </div>
                <div>
                  <b>Company</b>
                  <a href="#" className="muted">About</a>
                  <a href="#" className="muted">Contact</a>
                  <a href="#" className="muted">Jobs</a>
                  <a href="#" className="muted">Terms</a>
                </div>
              </div>
            </div>
            <div className="footer-bottom">
              <div className="muted">© 2024 Just Code Works. All rights reserved.</div>
              <div className="footer-legal">
                <a href="#" className="muted">Privacy</a>
                <a href="#" className="muted">Terms</a>
                <a href="#" className="muted">Cookies</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}