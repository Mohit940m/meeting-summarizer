import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth0();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-lg font-semibold text-gray-800">
            Meeting Summarizer
          </Link>
          <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
            Dashboard
          </Link>
        </div>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-600 hidden sm:inline">{user?.name}</span>
              <button
                onClick={() => logout({ returnTo: window.location.origin })}
                className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
