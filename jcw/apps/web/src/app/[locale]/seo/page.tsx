'use client';

import { useTranslations } from 'next-intl';

export default function SEOPage() {
  const t = useTranslations('seo');
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="bg-gradient-to-b from-[#0a1a5e] to-[#0d2b88] text-white py-24 text-center">
        <div className="container mx-auto max-w-6xl px-5">
          <h1 className="text-5xl font-bold leading-tight mb-4">
            SEO — Get Found Online
          </h1>
          <p className="max-w-3xl mx-auto text-[#d7e2ff] text-lg">
            SEO makes your website visible to the people who are already looking for what you offer. 
            It's how businesses get discovered, not just visited.
          </p>
        </div>
      </header>

      {/* What is SEO */}
      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-5">
          <div className="inline-block bg-[#eef2ff] text-[#3442d9] px-3 py-1 rounded-full text-sm font-semibold mb-4">
            Visibility
          </div>
          <h2 className="text-3xl font-bold text-[#0a1a5e] mb-4">What Is SEO?</h2>
          <p className="text-[#64748b] mb-6">
            SEO stands for <strong>Search Engine Optimization</strong> — but let's forget the technical name for a moment.
            It simply means <strong>making your website easier to find when someone searches for what you do</strong>.
          </p>
          <p>
            Imagine your website as a store on a busy street. SEO is the bright sign outside that helps people 
            notice you and step in — instead of walking past.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-[#f8f9ff]">
        <div className="container mx-auto max-w-6xl px-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-[#e6ecff] rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Get Discovered</h3>
              <p>
                When people search for a service like yours, they find you instead of your competitors. 
                SEO puts your business in front of real customers — exactly when they need you.
              </p>
            </div>
            <div className="bg-white border border-[#e6ecff] rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Earn Trust</h3>
              <p>
                Websites that show up on the first page of Google look more reliable. 
                People trust results they can find easily — and trust means clicks, calls, and customers.
              </p>
            </div>
            <div className="bg-white border border-[#e6ecff] rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Grow Naturally</h3>
              <p>
                Once your site ranks well, it keeps bringing visitors day and night without paying for ads. 
                That's the beauty of organic growth — steady, sustainable visibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="inline-block bg-[#eef2ff] text-[#3442d9] px-3 py-1 rounded-full text-sm font-semibold mb-4">
                The Process
              </div>
              <h2 className="text-3xl font-bold text-[#0a1a5e] mb-4">How SEO Works (Without The Tech Talk)</h2>
              <p className="mb-6">
                Search engines like Google read your pages and decide which ones answer people's questions best.
                We make sure your website clearly explains who you are, what you do, and where you do it — 
                in the way people actually search.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• We write clear titles and descriptions people want to click.</li>
                <li>• We include your services and locations naturally across the site.</li>
                <li>• We connect your business with Google tools and maps.</li>
                <li>• We keep your site fast, secure, and easy to browse — search engines love that.</li>
              </ul>
            </div>
            <div className="bg-white border border-[#e6ecff] rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold mb-4">What You Get</h3>
              <ul className="space-y-2 mb-4">
                <li>• Optimized pages for each service or product</li>
                <li>• Localized content in multiple languages (EN, NL, FR, ES, PT)</li>
                <li>• Integrated Google Maps and Business Profile</li>
                <li>• Monthly insights and improvement suggestions</li>
              </ul>
              <p className="text-[#64748b] text-sm">
                You don't need to understand how it all works — you just see the results in your 
                visitor numbers and inquiries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Care */}
      <section className="py-20 bg-[#f8f9ff]">
        <div className="container mx-auto max-w-6xl px-5">
          <div className="inline-block bg-[#eef2ff] text-[#3442d9] px-3 py-1 rounded-full text-sm font-semibold mb-4">
            Why It Matters
          </div>
          <h2 className="text-3xl font-bold text-[#0a1a5e] mb-4">Why Businesses (and You) Should Care</h2>
          <p className="mb-12">
            SEO is not about chasing algorithms — it's about helping real people find your business.
            Every day, thousands of people in your area search for services you already provide.
            Without SEO, they might never find you.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-[#e6ecff] rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold mb-4">It Saves Money</h3>
              <p>Instead of paying for every click in ads, SEO keeps you visible for free once you're ranking.</p>
            </div>
            <div className="bg-white border border-[#e6ecff] rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold mb-4">It Builds Momentum</h3>
              <p>The more visitors you get, the stronger your website becomes — Google sees you as more relevant over time.</p>
            </div>
            <div className="bg-white border border-[#e6ecff] rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold mb-4">It Helps Every Plan</h3>
              <p>From a single-page site to a full online store, SEO improves visibility across all JCW website types.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <div className="container mx-auto max-w-6xl px-5">
          <h2 className="text-3xl font-bold text-[#0a1a5e] mb-4">Ready To Be Found?</h2>
          <p className="text-[#64748b] mb-8">
            Let's make your website visible where it matters most — when your future customers are searching.
          </p>
          <a 
            href="/start" 
            className="inline-block bg-[#2152ff] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#1a42cc] transition-colors"
          >
            Improve My SEO
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-10 text-gray-500 text-sm border-t border-[#e6ecff]">
        <div className="container mx-auto max-w-6xl px-5">
          © {new Date().getFullYear()} Just Code Works — Websites That Work
        </div>
      </footer>
    </div>
  );
}