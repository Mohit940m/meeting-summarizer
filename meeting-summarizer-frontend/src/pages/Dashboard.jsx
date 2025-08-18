import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import API from "../services/api";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const run = async () => {
      try {
        let token;
        if (isAuthenticated) token = await getAccessTokenSilently();
        const res = await API.get("/user/profile", token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
        setProfile(res.data.user);
      } catch (e) {
        console.error(e);
      }
    };
    run();
  }, [isAuthenticated, getAccessTokenSilently]);

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Dashboard</h1>
      {profile ? (
        <div className="rounded border p-4">
          <div><span className="font-medium">User ID:</span> {profile.userId}</div>
          <div><span className="font-medium">Email:</span> {profile.email || "N/A"}</div>
        </div>
      ) : (
        <div>Loading profile...</div>
      )}
    </div>
  );
}
