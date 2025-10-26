'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import LanguageSwitcher from '@/components/language-switcher/LanguageSwitcher'

export default function Navigation() {
  const t = useTranslations('navigation')
  const locale = useLocale()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSmartSitesOpen, setIsSmartSitesOpen] = useState(false)
  const [isBrandMaterialsOpen, setIsBrandMaterialsOpen] = useState(false)

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 920) {
        setIsMenuOpen(false)
        setIsSmartSitesOpen(false)
        setIsBrandMaterialsOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleMegaPanel = (panel: 'smartSites' | 'brandMaterials') => {
    if (window.innerWidth <= 920) {
      if (panel === 'smartSites') {
        setIsSmartSitesOpen(!isSmartSitesOpen)
        setIsBrandMaterialsOpen(false)
      } else {
        setIsBrandMaterialsOpen(!isBrandMaterialsOpen)
        setIsSmartSitesOpen(false)
      }
    }
  }

  return (
    <>
      <style jsx>{`
        /* ===== MEGA MENU ===== */
        .jcw-nav { 
          position: relative; 
          z-index: 50; 
          background: linear-gradient(135deg, #0a1a5e 0%, #2152ff 50%, #0d2b88 100%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
        }
        .jcw-nav .bar { 
          display: flex; 
          align-items: center; 
          justify-content: space-between; 
          padding: 14px 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .jcw-nav .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 22px;
          font-weight: 700;
          color: #ffffff;
          text-decoration: none;
        }
        .jcw-nav .logo .ph {
          width: 38px;
          height: 38px;
          background: #3353ff;
          border: 2px solid #89a0ff;
          color: #fff;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }
        .jcw-nav .menu { 
          list-style: none; 
          margin: 0; 
          padding: 0; 
          display: flex; 
          gap: 20px; 
          align-items: center; 
        }
        .jcw-nav a { 
          text-decoration: none; 
          color: #ffffff; 
          font-weight: 600; 
          transition: color 0.3s ease;
        }
        .jcw-nav a:hover {
          color: #ffd166;
        }
        .jcw-nav .btn-primary { 
          color: #fff; 
          background: rgba(255, 255, 255, 0.15);
          padding: 8px 16px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }
        .jcw-nav .btn-primary:hover {
          background: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .jcw-nav .mega-parent { position: relative; }
        .jcw-nav .mega {
          position: absolute; 
          left: 50%; 
          transform: translateX(-50%);
          top: 100%; 
          margin-top: 14px; 
          width: min(1100px,92vw);
          background: #fff; 
          border: 1px solid #e6ecff; 
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(13,27,136,.18); 
          padding: 18px; 
          display: none;
        }
        .jcw-nav .mega-grid { 
          display: grid; 
          grid-template-columns: repeat(4,1fr); 
          gap: 14px; 
        }
        .jcw-nav .mega h5 { 
          margin: 4px 0 8px; 
          color: #0a1a5e; 
          font-size: 16px;
          font-weight: 600;
        }
        .jcw-nav .mega p { 
          margin: 6px 0 0; 
          color: #64748b; 
          font-size: 14px; 
          line-height: 1.5; 
        }
        .jcw-nav .mega a.card {
          display: block; 
          padding: 14px; 
          border: 1px solid #e6ecff; 
          border-radius: 14px; 
          background: #fff;
          transition: all 0.3s ease;
        }
        .jcw-nav .mega a.card:hover { 
          border-color: #2152ff; 
          box-shadow: 0 8px 30px rgba(33,82,255,.12); 
          transform: translateY(-2px);
        }
        .jcw-nav .mega .group-title { 
          font-size: 12px; 
          font-weight: 800; 
          letter-spacing: .08em; 
          color: #64748b; 
          margin: 6px 0 8px; 
          text-transform: uppercase; 
          grid-column: 1/-1;
        }

        /* Show on hover (desktop) */
        @media (hover:hover){
          .jcw-nav .mega-parent:hover > .mega { display: block; }
        }

        /* Mobile */
        .jcw-nav .toggle { 
          display: none; 
          background: rgba(255, 255, 255, 0.15);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 10px 14px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }
        .jcw-nav .toggle:hover {
          background: rgba(255, 255, 255, 0.25);
        }
        @media (max-width:920px){
          .jcw-nav .toggle { 
            display: inline-flex; 
            align-items: center; 
            gap: 8px; 
          }
          .jcw-nav .menu { 
            display: none; 
            position: absolute; 
            top: 100%; 
            left: 0; 
            right: 0; 
            background: #fff; 
            border-top: 1px solid #e6ecff; 
            padding: 14px; 
            flex-direction: column; 
            gap: 10px; 
          }
          .jcw-nav .menu a {
            color: #0f172a;
          }
          .jcw-nav .menu a:hover {
            color: #2152ff;
          }
          .jcw-nav.open .menu { display: flex; }
          .jcw-nav .mega { 
            position: static; 
            transform: none; 
            width: 100%; 
            margin: 8px 0 0 0; 
            display: none; 
          }
          .jcw-nav .mega-parent.open > .mega { display: block; }
          .jcw-nav .mega-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
      
      <nav className={`jcw-nav ${isMenuOpen ? 'open' : ''}`}>
        <div className="bar">
          <Link href={`/${locale}`} className="logo">
            <div className="ph">JCW</div>
            <span>Just Code Works</span>
          </Link>

          <button 
            className="toggle" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="jcwMenu"
          >
            Menu
          </button>

          <ul className="menu" id="jcwMenu">
            <li><Link href={`/${locale}`}>Home</Link></li>

            {/* Smart Sites (Websites) */}
            <li className={`mega-parent ${isSmartSitesOpen ? 'open' : ''}`}>
              <Link 
                href={`/${locale}/websites`} 
                aria-haspopup="true" 
                aria-expanded={isSmartSitesOpen}
                onClick={(e) => {
                  if (window.innerWidth <= 920) {
                    e.preventDefault()
                    toggleMegaPanel('smartSites')
                  }
                }}
              >
                Smart Sites
              </Link>
              <div className="mega" role="menu" aria-label="Smart Sites">
                <div className="group-title">Website Types</div>
                <div className="mega-grid">
                  <Link className="card" href={`/${locale}/onepage`}>
                    <h5>One Page Website</h5>
                    <p>Launch fast with a clean single page and contact form + map.</p>
                  </Link>
                  <Link className="card" href={`/${locale}/starter`}>
                    <h5>Multi-Page (Starter)</h5>
                    <p>Edit pages anytime. Blog, languages, and Facebook connection.</p>
                  </Link>
                  <Link className="card" href={`/${locale}/ecommerce`}>
                    <h5>E-commerce</h5>
                    <p>Products, EU payments, VAT & shipping — ready to sell.</p>
                  </Link>
                  <Link className="card" href={`/${locale}/custom-websites`}>
                    <h5>Custom Websites</h5>
                    <p>Unique layouts, custom forms, CRM/booking integrations.</p>
                  </Link>
                </div>
              </div>
            </li>

            {/* Brand Materials (Prints) */}
            <li className={`mega-parent ${isBrandMaterialsOpen ? 'open' : ''}`}>
              <Link 
                href={`/${locale}/brand-materials`} 
                aria-haspopup="true" 
                aria-expanded={isBrandMaterialsOpen}
                onClick={(e) => {
                  if (window.innerWidth <= 920) {
                    e.preventDefault()
                    toggleMegaPanel('brandMaterials')
                  }
                }}
              >
                Brand Materials
              </Link>
              <div className="mega" role="menu" aria-label="Brand Materials">
                <div className="group-title">Cards & Stationery</div>
                <div className="mega-grid">
                  <Link className="card" href={`/${locale}/prints/business-cards`}>
                    <h5>Business Cards</h5>
                    <p>Premium stocks, rounded corners, double-sided, QR options.</p>
                  </Link>
                  <Link className="card" href={`/${locale}/prints/flyers`}>
                    <h5>Flyers</h5>
                    <p>Promotions, menus, events — multiple paper sizes.</p>
                  </Link>
                  <Link className="card" href={`/${locale}/prints/brochures`}>
                    <h5>Brochures & Trifolds</h5>
                    <p>Service overviews, price lists, take-away info.</p>
                  </Link>
                  <Link className="card" href={`/${locale}/prints/posters`}>
                    <h5>Posters</h5>
                    <p>Window, event, and in-store displays.</p>
                  </Link>

                  <div className="group-title">Merch & Extras</div>

                  <Link className="card" href={`/${locale}/prints/tshirts`}>
                    <h5>T-Shirts</h5>
                    <p>DTG/embroidery options, sizes S–XXL.</p>
                  </Link>
                  <Link className="card" href={`/${locale}/prints/mugs`}>
                    <h5>Mugs</h5>
                    <p>Classic, color-inside, and jumbo mugs.</p>
                  </Link>
                  <Link className="card" href={`/${locale}/prints/stickers`}>
                    <h5>Stickers</h5>
                    <p>Die-cut, sheets, labels for packaging.</p>
                  </Link>
                  <Link className="card" href={`/${locale}/prints/banners`}>
                    <h5>Banners & Roll-ups</h5>
                    <p>Indoor/outdoor formats, event-ready.</p>
                  </Link>
                </div>
              </div>
            </li>

            <li><Link href={`/${locale}/pos-systems`}>POS Systems</Link></li>
            <li><Link href={`/${locale}/seo`}>SEO</Link></li>
            <li><Link href={`/${locale}/help-center`}>Help Center</Link></li>
            <li><Link href={`/${locale}/about`}>About Us</Link></li>

            <li style={{ marginLeft: 'auto', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <LanguageSwitcher />
              <Link className="btn btn-primary" href={`/${locale}/start`}>Get Started</Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  )
}