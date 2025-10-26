'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function PrintsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  return (
    <div>
      <style jsx>{`
        .prints-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8faff 0%, #f1f5ff 100%);
          padding: 0;
        }
        
        .prints-header {
          background: linear-gradient(135deg, #0a1a5e 0%, #2152ff 50%, #0d2b88 100%);
          color: white;
          padding: 80px 0 60px;
          text-align: center;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .prints-header h1 {
          font-size: 48px;
          font-weight: 800;
          margin: 0 0 16px;
          color: white;
        }
        
        .prints-header p {
          font-size: 20px;
          color: #d7e2ff;
          margin: 0;
          max-width: 600px;
          margin: 0 auto;
        }
        
        .prints-content {
          padding: 80px 0;
        }
        
        .category-section {
          margin-bottom: 80px;
        }
        
        .category-header {
          text-align: center;
          margin-bottom: 50px;
        }
        
        .category-header h2 {
          font-size: 36px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 12px;
        }
        
        .category-header p {
          font-size: 18px;
          color: #64748b;
          margin: 0;
        }
        
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
        }
        
        .product-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(13, 27, 136, 0.08);
          transition: all 0.3s ease;
          border: 1px solid #e6ecff;
        }
        
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(13, 27, 136, 0.15);
        }
        
        .product-image {
          width: 100%;
          height: 200px;
          background: linear-gradient(45deg, #f1f5ff 0%, #e6ecff 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          color: #2152ff;
          position: relative;
        }
        
        .product-content {
          padding: 24px;
        }
        
        .product-title {
          font-size: 20px;
          font-weight: 600;
          color: #0f172a;
          margin: 0 0 8px;
        }
        
        .product-description {
          font-size: 14px;
          color: #64748b;
          margin: 0 0 16px;
          line-height: 1.6;
        }
        
        .product-price {
          font-size: 18px;
          font-weight: 700;
          color: #2152ff;
          margin: 0 0 16px;
        }
        
        .product-button {
          width: 100%;
          padding: 12px 24px;
          background: #2152ff;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
          text-align: center;
        }
        
        .product-button:hover {
          background: #1a42d8;
          transform: translateY(-1px);
        }
        
        .coming-soon {
          background: #f8f9ff;
          border: 2px dashed #c7cddc;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 40px 20px;
          text-align: center;
          border-radius: 16px;
        }
        
        .coming-soon-icon {
          font-size: 48px;
          color: #64748b;
          margin-bottom: 16px;
        }
        
        .coming-soon-text {
          font-size: 18px;
          font-weight: 600;
          color: #64748b;
          margin: 0;
        }
        
        .breadcrumb {
          padding: 20px 0;
          background: white;
          border-bottom: 1px solid #e6ecff;
        }
        
        .breadcrumb-nav {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }
        
        .breadcrumb-nav a {
          color: #2152ff;
          text-decoration: none;
        }
        
        .breadcrumb-nav a:hover {
          text-decoration: underline;
        }
        
        .breadcrumb-nav span {
          color: #64748b;
        }
        
        @media (max-width: 768px) {
          .prints-header h1 {
            font-size: 36px;
          }
          
          .prints-header p {
            font-size: 16px;
          }
          
          .category-header h2 {
            font-size: 28px;
          }
          
          .products-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .prints-content {
            padding: 40px 0;
          }
          
          .category-section {
            margin-bottom: 50px;
          }
        }
      `}</style>
      
      <div className="prints-container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <div className="container">
            <nav className="breadcrumb-nav">
              <Link href="/">Home</Link>
              <span>•</span>
              <span>Print Products</span>
            </nav>
          </div>
        </div>

        {/* Header */}
        <header className="prints-header">
          <div className="container">
            <h1>Print Products</h1>
            <p>Professional printing solutions for your business and personal needs. High-quality materials, fast delivery, and competitive pricing.</p>
          </div>
        </header>

        {/* Content */}
        <main className="prints-content">
          <div className="container">
            
            {/* Business Cards Section */}
            <section className="category-section">
              <div className="category-header">
                <h2>Business Cards</h2>
                <p>Make a lasting impression with premium business cards</p>
              </div>
              <div className="products-grid">
                <div className="product-card">
                  <div className="product-image">
                    💼
                  </div>
                  <div className="product-content">
                    <h3 className="product-title">Standard Business Cards</h3>
                    <p className="product-description">Premium 350gsm cardstock with matte or gloss finish. Perfect for professional networking.</p>
                    <div className="product-price">Starting at $29.99</div>
                    <button className="product-button">Design Now</button>
                  </div>
                </div>
                
                <div className="product-card">
                  <div className="product-image">
                    ✨
                  </div>
                  <div className="product-content">
                    <h3 className="product-title">Luxury Business Cards</h3>
                    <p className="product-description">Premium finishes including foil stamping, embossing, and specialty papers.</p>
                    <div className="product-price">Starting at $59.99</div>
                    <button className="product-button">Design Now</button>
                  </div>
                </div>
                
                <div className="coming-soon">
                  <div className="coming-soon-icon">🔄</div>
                  <p className="coming-soon-text">More Options Coming Soon</p>
                </div>
              </div>
            </section>

            {/* Trifolds Section */}
            <section className="category-section">
              <div className="category-header">
                <h2>Trifold Brochures</h2>
                <p>Showcase your services with professional tri-fold brochures</p>
              </div>
              <div className="products-grid">
                <div className="product-card">
                  <div className="product-image">
                    📄
                  </div>
                  <div className="product-content">
                    <h3 className="product-title">Standard Trifolds</h3>
                    <p className="product-description">High-quality 130gsm paper with full-color printing on both sides.</p>
                    <div className="product-price">Starting at $89.99</div>
                    <button className="product-button">Design Now</button>
                  </div>
                </div>
                
                <div className="product-card">
                  <div className="product-image">
                    📋
                  </div>
                  <div className="product-content">
                    <h3 className="product-title">Premium Trifolds</h3>
                    <p className="product-description">Premium 200gsm cardstock with UV coating for enhanced durability.</p>
                    <div className="product-price">Starting at $129.99</div>
                    <button className="product-button">Design Now</button>
                  </div>
                </div>
                
                <div className="coming-soon">
                  <div className="coming-soon-icon">🔄</div>
                  <p className="coming-soon-text">Custom Sizes Coming Soon</p>
                </div>
              </div>
            </section>

            {/* Gifts Section */}
            <section className="category-section">
              <div className="category-header">
                <h2>Custom Gifts</h2>
                <p>Personalized gifts for every occasion</p>
              </div>
              <div className="products-grid">
                <div className="product-card">
                  <div className="product-image">
                    ☕
                  </div>
                  <div className="product-content">
                    <h3 className="product-title">Custom Mugs</h3>
                    <p className="product-description">11oz ceramic mugs with full-color printing. Perfect for corporate gifts or personal use.</p>
                    <div className="product-price">Starting at $19.99</div>
                    <button className="product-button">Design Now</button>
                  </div>
                </div>
                
                <div className="product-card">
                  <div className="product-image">
                    🖼️
                  </div>
                  <div className="product-content">
                    <h3 className="product-title">Photo Prints</h3>
                    <p className="product-description">High-quality photo prints on premium paper. Various sizes available.</p>
                    <div className="product-price">Starting at $9.99</div>
                    <button className="product-button">Upload Photo</button>
                  </div>
                </div>
                
                <div className="coming-soon">
                  <div className="coming-soon-icon">🔄</div>
                  <p className="coming-soon-text">More Gift Options Coming Soon</p>
                </div>
              </div>
            </section>

            {/* Clothing Section */}
            <section className="category-section">
              <div className="category-header">
                <h2>Custom Clothing</h2>
                <p>High-quality apparel with your custom designs</p>
              </div>
              <div className="products-grid">
                <div className="product-card">
                  <div className="product-image">
                    👕
                  </div>
                  <div className="product-content">
                    <h3 className="product-title">Custom T-Shirts</h3>
                    <p className="product-description">100% cotton t-shirts with screen printing or DTG printing options.</p>
                    <div className="product-price">Starting at $24.99</div>
                    <button className="product-button">Design Now</button>
                  </div>
                </div>
                
                <div className="product-card">
                  <div className="product-image">
                    🧢
                  </div>
                  <div className="product-content">
                    <h3 className="product-title">Custom Hats</h3>
                    <p className="product-description">Embroidered caps and beanies with your logo or custom design.</p>
                    <div className="product-price">Starting at $34.99</div>
                    <button className="product-button">Design Now</button>
                  </div>
                </div>
                
                <div className="coming-soon">
                  <div className="coming-soon-icon">🔄</div>
                  <p className="coming-soon-text">More Apparel Coming Soon</p>
                </div>
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  )
}