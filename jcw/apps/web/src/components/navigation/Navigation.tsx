'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Navigation() {
  const [isWebsitesOpen, setIsWebsitesOpen] = useState(false)

  return (
    <>
      <style jsx>{`
        .nav-container {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: linear-gradient(135deg, #0a1a5e 0%, #2152ff 50%, #0d2b88 100%);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
        }
        
        .nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 70px;
          position: relative;
        }
        
        .logo {
          font-size: 22px;
          font-weight: 700;
          color: #ffffff;
          text-decoration: none;
        }
        
        .nav-center {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
        
        .nav-menu {
          display: flex;
          align-items: center;
          gap: 40px;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        
        .nav-item {
          position: relative;
        }
        
        .nav-link {
          color: #ffffff;
          text-decoration: none;
          font-weight: 500;
          padding: 20px 0;
          transition: color 0.3s ease;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .nav-link:hover {
          color: #ffd166;
        }
        
        .dropdown-arrow {
          transition: transform 0.3s ease;
        }
        
        .dropdown-arrow.open {
          transform: rotate(180deg);
        }
        
        .mega-dropdown {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          width: 800px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(33, 82, 255, 0.15);
          border: 1px solid #e6ecff;
          padding: 40px;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          margin-top: 10px;
        }
        
        .mega-dropdown.open {
          opacity: 1;
          visibility: visible;
        }
        
        .dropdown-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 30px;
        }
        
        .dropdown-section {
          padding: 0;
        }
        
        .dropdown-item {
          display: block;
          color: #0f172a;
          text-decoration: none;
          padding: 15px 20px;
          border-radius: 12px;
          transition: all 0.3s ease;
          border: 1px solid transparent;
        }
        
        .dropdown-item:hover {
          background: #f8f9ff;
          border-color: #e6ecff;
          transform: translateY(-2px);
        }
        
        .dropdown-item h4 {
          margin: 0 0 8px 0;
          color: #2152ff;
          font-size: 16px;
          font-weight: 600;
        }
        
        .dropdown-item p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
          line-height: 1.5;
        }
        
        .mobile-menu-toggle {
          display: none;
          background: none;
          border: none;
          font-size: 24px;
          color: #0f172a;
          cursor: pointer;
        }
        
        @media (max-width: 768px) {
          .nav-menu {
            display: none;
          }
          
          .mobile-menu-toggle {
            display: block;
          }
          
          .mega-dropdown {
            width: 90vw;
            left: 5vw;
            transform: none;
          }
          
          .dropdown-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }
      `}</style>
      
      <nav className="nav-container">
        <div className="nav-inner">
          <Link href="/" className="logo">
            Just Code Works
          </Link>
          
          <div className="nav-center">
            <ul className="nav-menu">
              <li className="nav-item">
                <Link href="/" className="nav-link">
                  Home
                </Link>
              </li>
              
              <li className="nav-item">
                <Link href="/prints" className="nav-link">
                  Prints
                </Link>
              </li>
              
              <li 
                className="nav-item"
                onMouseEnter={() => setIsWebsitesOpen(true)}
                onMouseLeave={() => setIsWebsitesOpen(false)}
              >
                <span className="nav-link">
                  Websites
                  <svg 
                    className={`dropdown-arrow ${isWebsitesOpen ? 'open' : ''}`}
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </span>
                
                <div className={`mega-dropdown ${isWebsitesOpen ? 'open' : ''}`}>
                  <div className="dropdown-grid">
                    <div className="dropdown-section">
                      <Link href="/onepage" className="dropdown-item">
                        <h4>One Page Website</h4>
                        <p>Simple & effective</p>
                      </Link>
                    </div>
                    
                    <div className="dropdown-section">
                      <Link href="/multipage" className="dropdown-item">
                        <h4>Multi-Page Website</h4>
                        <p>Admin & Facebook ready</p>
                      </Link>
                    </div>
                    
                    <div className="dropdown-section">
                      <Link href="/ecommerce" className="dropdown-item">
                        <h4>E-commerce Store</h4>
                        <p>Full payment processing</p>
                      </Link>
                    </div>
                    
                    <div className="dropdown-section">
                      <Link href="/custom" className="dropdown-item">
                        <h4>Custom Solutions</h4>
                        <p>Tailored for you</p>
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          
          <button className="mobile-menu-toggle">
            ☰
          </button>
        </div>
      </nav>
    </>
  )
}