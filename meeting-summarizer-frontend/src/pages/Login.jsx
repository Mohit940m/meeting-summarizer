import { useAuth0 } from "@auth0/auth0-react";

export default function Login() {
  const { loginWithRedirect, logout, isAuthenticated, user, isLoading } = useAuth0();

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      {isAuthenticated ? (
        <>
          <h2 className="text-lg font-semibold mb-4">Welcome, {user?.name}</h2>
          <button
            onClick={() => logout({ returnTo: window.location.origin })}
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
          >
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={() => loginWithRedirect()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
        >
          Login with Auth0
        </button>
      )}
    </div>
  );
}
