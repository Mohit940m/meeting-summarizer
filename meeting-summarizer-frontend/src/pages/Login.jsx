import { useAuth0 } from "@auth0/auth0-react";

export default function Login() {
  const { loginWithRedirect, isAuthenticated, isLoading, error } = useAuth0();

  if (isLoading) return <div className="p-6">Loading...</div>;

  if (isAuthenticated) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-2">You are already logged in.</h2>
      </div>
    );
  }

  return (
    <div className="p-6">
      {error && (
        <div className="mb-3 text-red-600 text-sm">
          Login error: {error.message}
        </div>
      )}
      <button
        onClick={() => loginWithRedirect({ appState: { returnTo: "/" } })}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
      >
        Continue to Auth0 Login
      </button>
    </div>
  );
}
