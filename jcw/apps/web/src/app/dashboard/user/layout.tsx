export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900">My Dashboard</h2>
        </div>
        <nav className="mt-6">
          <a href="/dashboard/user" className="block px-6 py-3 text-gray-700 hover:bg-gray-100">
            Dashboard
          </a>
          <a href="/dashboard/user/content-strategy" className="block px-6 py-3 text-gray-700 hover:bg-gray-100">
            Content Strategy
          </a>
          <a href="/dashboard/user/subscriptions" className="block px-6 py-3 text-gray-700 hover:bg-gray-100">
            Subscriptions
          </a>
          <a href="/dashboard/user/settings" className="block px-6 py-3 text-gray-700 hover:bg-gray-100">
            Settings
          </a>
          <a href="/dashboard/user/edit-website" className="block px-6 py-3 text-gray-700 hover:bg-gray-100">
            Edit Website
          </a>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
}