export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900">Admin Dashboard</h2>
        </div>
        <nav className="mt-6">
          <a href="/dashboard/admin" className="block px-6 py-3 text-gray-700 hover:bg-gray-100">
            Overview
          </a>
          <a href="/dashboard/admin/tenants" className="block px-6 py-3 text-gray-700 hover:bg-gray-100">
            Tenants
          </a>
          <a href="/dashboard/admin/sections" className="block px-6 py-3 text-gray-700 hover:bg-gray-100">
            Sections
          </a>
          <a href="/dashboard/admin/templates" className="block px-6 py-3 text-gray-700 hover:bg-gray-100">
            Templates
          </a>
          <a href="/dashboard/admin/activity" className="block px-6 py-3 text-gray-700 hover:bg-gray-100">
            Activity Log
          </a>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
}