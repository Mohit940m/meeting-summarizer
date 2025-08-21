import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef, useState } from "react";
import { FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth0();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

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
        <div className="flex items-center gap-3 relative" ref={menuRef}>
          {isAuthenticated ? (
            <>
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                <FaUserCircle className="w-7 h-7" />
                <span className="hidden sm:inline text-sm font-medium">{user?.name || "Account"}</span>
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-56 rounded-md border border-gray-200 bg-white shadow-lg z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm text-gray-500">Signed in as</p>
                    <p className="text-sm font-medium text-gray-800 truncate">{user?.name || "User"}</p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => logout({ returnTo: window.location.origin })}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
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
