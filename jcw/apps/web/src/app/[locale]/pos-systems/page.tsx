'use client';

import { useTranslations } from 'next-intl';

export default function POSSystemsPage() {
  const t = useTranslations('pos');
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="bg-gradient-to-b from-[#0a1a5e] to-[#0d2b88] text-white py-24 text-center">
        <div className="container mx-auto max-w-6xl px-5">
          <h1 className="text-5xl font-bold leading-tight mb-4">
            POS Systems
          </h1>
          <p className="max-w-3xl mx-auto text-[#d7e2ff] text-lg">
            Accept payments in store, at events, and on the go — with inventory, taxes, and receipts 
            handled in one connected system for the EU.
          </p>
        </div>
      </header>

      {/* Overview */}
      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-5">
          <div className="inline-block bg-[#eef2ff] text-[#3442d9] px-3 py-1 rounded-full text-sm font-semibold mb-4">
            In-Store • Online • Anywhere
          </div>
          <h2 className="text-3xl font-bold text-[#0a1a5e] mb-4">Point of Sale Built To Work With Your Website</h2>
          <p className="text-[#64748b]">
            We supply and configure POS solutions that connect to your Just Code Works website.
            Take card and local payment methods, sync products and stock, and keep everything under one dashboard.
            We'll match you with a provider per country to ensure compliance and uptime.
          </p>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-12">
        <div className="container mx-auto max-w-6xl px-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-[#e6ecff] rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Hardware</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Countertop and mobile terminals</li>
                <li>• Receipt printers & cash drawers</li>
                <li>• Barcode scanners & label printers</li>
                <li>• Tablet stands and accessories</li>
              </ul>
            </div>
            <div className="bg-white border border-[#e6ecff] rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Payments</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Cards, Apple Pay, Google Pay</li>
                <li>• EU methods: iDEAL, Bancontact, Girocard (where applicable)</li>
                <li>• Refunds and partial refunds</li>
                <li>• Tips, discounts, and custom notes</li>
              </ul>
            </div>
            <div className="bg-white border border-[#e6ecff] rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Operations</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Products, variants, and barcodes</li>
                <li>• Inventory & stock adjustments</li>
                <li>• Receipts (email/PDF/print)</li>
                <li>• Staff roles & permissions</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Sync with Store */}
      <section className="py-20 bg-[#f8f9ff]">
        <div className="container mx-auto max-w-6xl px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="inline-block bg-[#eef2ff] text-[#3442d9] px-3 py-1 rounded-full text-sm font-semibold mb-4">
                Omnichannel
              </div>
              <h2 className="text-3xl font-bold text-[#0a1a5e] mb-4">Sync With Your Online Store</h2>
              <p className="mb-6">
                Sell the same catalog online and in person. Keep stock synced, share discounts, and view orders in one place.
                If you already run a JCW e-commerce site, POS can connect to the same products and tax rules — no duplication.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Unified products, prices, and taxes</li>
                <li>• Real-time inventory updates</li>
                <li>• Order history across channels</li>
                <li>• Customer profiles and loyalty options</li>
              </ul>
            </div>
            <div className="bg-white border border-[#e6ecff] rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Invoices & Subscriptions</h3>
              <ul className="space-y-2 mb-4">
                <li>• On-the-spot invoices with VAT details</li>
                <li>• Save customer details for future orders</li>
                <li>• Simple subscriptions and renewals</li>
                <li>• Export to accounting tools (CSV/PDF)</li>
              </ul>
              <p className="text-[#64748b] text-sm">
                We'll help you choose formats compatible with your accountant's workflow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance & Reporting */}
      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-[#e6ecff] rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold mb-4">EU VAT & Taxes</h3>
              <p>
                Configure VAT rates per country or region, including reduced rates where applicable. 
                Tax appears on receipts and exports.
              </p>
            </div>
            <div className="bg-white border border-[#e6ecff] rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Security</h3>
              <p>
                PCI-aware setups, SSL everywhere, and provider-level encryption. 
                We select providers with strong compliance track records.
              </p>
            </div>
            <div className="bg-white border border-[#e6ecff] rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Reports</h3>
              <p>
                Daily totals, product performance, staff summaries, and payout reconciliation 
                so you always know what was sold and where.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Provider Model */}
      <section className="py-20 bg-[#f8f9ff]">
        <div className="container mx-auto max-w-6xl px-5">
          <div className="inline-block bg-[#eef2ff] text-[#3442d9] px-3 py-1 rounded-full text-sm font-semibold mb-4">
            EU Coverage
          </div>
          <h2 className="text-3xl font-bold text-[#0a1a5e] mb-4">Provider-Agnostic, Country by Country</h2>
          <p className="text-[#64748b] mb-6">
            We partner with payment and POS providers across the EU.
            Based on your country and business type, we'll recommend supported terminals and service plans, 
            then configure everything to work with your JCW website and dashboard.
          </p>
          <ul className="space-y-2 text-gray-700">
            <li>• Local acquiring and settlement where available</li>
            <li>• Hardware availability and warranty per region</li>
            <li>• Clear fees and payout schedules</li>
            <li>• Migration help if you change providers later</li>
          </ul>
        </div>
      </section>

      {/* Installation & Onboarding */}
      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="inline-block bg-[#eef2ff] text-[#3442d9] px-3 py-1 rounded-full text-sm font-semibold mb-4">
                Setup
              </div>
              <h2 className="text-3xl font-bold text-[#0a1a5e] mb-4">Installation & Onboarding</h2>
              <p className="mb-6">
                We'll guide you from hardware selection to first checkout. 
                You get a checklist and a live test before going public.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Hardware handover and pairing</li>
                <li>• Catalog import and tax setup</li>
                <li>• Receipt branding & email templates</li>
                <li>• Staff training and best practices</li>
              </ul>
            </div>
            <div className="bg-white border border-[#e6ecff] rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold mb-4">After Launch</h3>
              <ul className="space-y-2">
                <li>• Monitoring and updates</li>
                <li>• Priority support</li>
                <li>• Add new registers or locations anytime</li>
                <li>• Seasonal price lists and promos</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-5">
          <div className="inline-block bg-[#eef2ff] text-[#3442d9] px-3 py-1 rounded-full text-sm font-semibold mb-4">
            Common Questions
          </div>
          <h2 className="text-3xl font-bold text-[#0a1a5e] mb-8">FAQ</h2>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <div className="bg-white border border-[#e6ecff] rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Which countries are supported?</h3>
              <p>We're expanding EU-wide. Tell us your location and we'll propose supported providers and hardware available there.</p>
            </div>
            <div className="bg-white border border-[#e6ecff] rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Do I need an online store?</h3>
              <p>No, you can run POS only. If you add e-commerce later, we'll connect stock and orders so everything stays in sync.</p>
            </div>
            <div className="bg-white border border-[#e6ecff] rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Can I keep my existing terminals?</h3>
              <p>In many cases yes. We'll review compatibility and advise whether to keep, re-configure, or replace.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#f0f4ff] text-center">
        <div className="container mx-auto max-w-6xl px-5">
          <h2 className="text-3xl font-bold text-[#0a1a5e] mb-4">Ready To Take Payments Anywhere?</h2>
          <p className="text-[#64748b] mb-8">
            Tell us your country and business type. We'll match a provider, supply the hardware, 
            and connect it to your website and dashboard.
          </p>
          <a 
            href="/start" 
            className="inline-block bg-[#2152ff] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#1a42cc] transition-colors"
          >
            Request POS Setup
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