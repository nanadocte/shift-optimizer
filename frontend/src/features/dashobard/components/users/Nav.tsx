import { Link } from 'react-router'
import { Outlet } from 'react-router'

function Nav() {
  return (
    <>
      <nav className="fixed top-0 left-0 flex h-screen w-64 flex-col justify-between border-r border-white/20 bg-white/70 p-6 shadow-xl backdrop-blur-xl">
        {/* Top */}
        <div>
          {/* Logo */}
          <div className="mb-10 flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 shadow-md" />
            <h1 className="text-lg font-semibold text-gray-800">Shift Flow</h1>
          </div>

          {/* Menu */}
          <ul className="flex flex-col gap-3 text-sm font-medium text-gray-600">
            <li className="cursor-pointer rounded-lg px-3 py-2 transition hover:bg-indigo-50 hover:text-indigo-600">
              <Link to={'/dashboard'}>Planning</Link>
            </li>
            <li className="cursor-pointer rounded-lg px-3 py-2 transition hover:bg-indigo-50 hover:text-indigo-600">
              <Link to={'/templates'}>Templates</Link>
            </li>
            <li className="cursor-pointer rounded-lg px-3 py-2 transition hover:bg-indigo-50 hover:text-indigo-600">
              <Link to={'/employees'}>Employees</Link>
            </li>
            <li className="cursor-pointer rounded-lg px-3 py-2 transition hover:bg-indigo-50 hover:text-indigo-600">
              <Link to={'/settings'}>Settings</Link>
            </li>
          </ul>
        </div>

        {/* Bottom user */}
        <div className="flex items-center gap-3 rounded-xl bg-white/60 p-3 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600">
            AG
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">Anne</p>
            <p className="text-xs text-gray-400">Admin</p>
          </div>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default Nav
