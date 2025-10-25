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
            My Site
          </a>
          <a href="/dashboard/user/sections" className="block px-6 py-3 text-gray-700 hover:bg-gray-100">
            Section Library
          </a>
          <a href="/dashboard/user/theme" className="block px-6 py-3 text-gray-700 hover:bg-gray-100">
            Theme Settings
          </a>
          <a href="/dashboard/user/preview" className="block px-6 py-3 text-gray-700 hover:bg-gray-100">
            Preview Site
          </a>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
}