import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await API.get("api/user/profile");
        setProfile(res.data.user);
      } catch (e) {
        console.error(e);
      }
    };
    run();
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Dashboard</h1>
      {profile ? (
        <div className="rounded border p-4">
          <div><span className="font-medium">User ID:</span> {profile._id}</div>
          <div><span className="font-medium">Email:</span> {profile.email || "N/A"}</div>
          <div><span className="font-medium">Username:</span> {profile.username || "N/A"}</div>
        </div>
      ) : (
        <div>Loading profile...</div>
      )}
    </div>
  );
}
