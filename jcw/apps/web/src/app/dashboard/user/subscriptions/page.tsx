'use client'

import { useState, useEffect } from 'react'

export default function SubscriptionsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [subscriptionData, setSubscriptionData] = useState<any>(null)

  useEffect(() => {
    // Load subscription data
    loadSubscriptionData()
  }, [])

  const loadSubscriptionData = async () => {
    try {
      // In a real app, this would fetch from your API
      // For now, we'll use mock data
      const mockSubscription = {
        hostingPlan: {
          name: "Professional",
          type: "premium",
          price: "$29.99/month",
          features: [
            "50GB SSD Storage",
            "Unlimited Bandwidth",
            "Free SSL Certificate",
            "Daily Backups",
            "24/7 Support",
            "Custom Domain Included"
          ],
          status: "active",
          renewalDate: "2025-11-26"
        },
        websiteType: {
          template: "Modern Business",
          category: "Professional Services",
          features: [
            "Responsive Design",
            "Contact Forms",
            "SEO Optimized",
            "Social Media Integration",
            "Blog Functionality",
            "Analytics Integration"
          ]
        },
        domain: {
          primary: "demo-business.com",
          status: "active",
          registrar: "JCW Domains",
          expirationDate: "2026-03-15",
          dnsStatus: "configured",
          sslStatus: "active"
        }
      }
      setSubscriptionData(mockSubscription)
    } catch (error) {
      console.error('Failed to load subscription data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      active: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    }
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Subscriptions</h1>
        <p className="text-gray-600 mt-2">
          Manage your hosting plan, website features, and domain settings.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12l5 5L20 7" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Plan Status</p>
              <p className="text-lg font-semibold text-gray-900">Active</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Domain</p>
              <p className="text-lg font-semibold text-gray-900">{subscriptionData?.domain?.primary}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Monthly Cost</p>
              <p className="text-lg font-semibold text-gray-900">{subscriptionData?.hostingPlan?.price}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hosting Plan */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Hosting Plan</h2>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(subscriptionData?.hostingPlan?.status)}`}>
                {subscriptionData?.hostingPlan?.status?.charAt(0).toUpperCase() + subscriptionData?.hostingPlan?.status?.slice(1)}
              </span>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">{subscriptionData?.hostingPlan?.name}</h3>
              <p className="text-2xl font-bold text-gray-900">{subscriptionData?.hostingPlan?.price}</p>
            </div>
            <div className="space-y-3 mb-6">
              {subscriptionData?.hostingPlan?.features.map((feature: string, index: number) => (
                <div key={index} className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-600">{feature}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4">
              <p className="text-sm text-gray-600">
                <strong>Next Renewal:</strong> {subscriptionData?.hostingPlan?.renewalDate}
              </p>
            </div>
            <div className="mt-4 flex space-x-3">
              <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                Upgrade Plan
              </button>
              <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                Manage Billing
              </button>
            </div>
          </div>
        </div>

        {/* Website Type & Features */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Website Features</h2>
          </div>
          <div className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">{subscriptionData?.websiteType?.template}</h3>
              <p className="text-sm text-gray-600">{subscriptionData?.websiteType?.category}</p>
            </div>
            <div className="space-y-3 mb-6">
              {subscriptionData?.websiteType?.features.map((feature: string, index: number) => (
                <div key={index} className="flex items-center">
                  <svg className="w-4 h-4 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-600">{feature}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex space-x-3">
              <button className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700">
                Customize Template
              </button>
              <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                View Features
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Domain Details */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Domain Details</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600">Primary Domain</label>
              <p className="text-lg font-semibold text-gray-900 mt-1">{subscriptionData?.domain?.primary}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <div className="mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(subscriptionData?.domain?.status)}`}>
                  {subscriptionData?.domain?.status?.charAt(0).toUpperCase() + subscriptionData?.domain?.status?.slice(1)}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Registrar</label>
              <p className="text-sm text-gray-900 mt-1">{subscriptionData?.domain?.registrar}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Expiration Date</label>
              <p className="text-sm text-gray-900 mt-1">{subscriptionData?.domain?.expirationDate}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-900">DNS Configuration</p>
                  <p className="text-xs text-gray-600">Properly configured</p>
                </div>
              </div>
              <span className="text-green-600 text-sm font-medium">Active</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-900">SSL Certificate</p>
                  <p className="text-xs text-gray-600">Auto-renewal enabled</p>
                </div>
              </div>
              <span className="text-green-600 text-sm font-medium">Secured</span>
            </div>
          </div>

          <div className="mt-6 flex space-x-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
              Manage DNS
            </button>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
              Renew Domain
            </button>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
              Transfer Domain
            </button>
          </div>
        </div>
      </div>

      {/* Billing Summary */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">💳 Billing Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Current Period</p>
            <p className="text-lg font-semibold text-gray-900">Oct 26 - Nov 26, 2025</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Next Payment</p>
            <p className="text-lg font-semibold text-gray-900">{subscriptionData?.hostingPlan?.price}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Payment Method</p>
            <p className="text-lg font-semibold text-gray-900">•••• •••• •••• 4532</p>
          </div>
        </div>
        <div className="mt-4 flex space-x-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            View Invoices
          </button>
          <button className="border border-blue-300 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100">
            Update Payment Method
          </button>
        </div>
      </div>
    </div>
  )
}