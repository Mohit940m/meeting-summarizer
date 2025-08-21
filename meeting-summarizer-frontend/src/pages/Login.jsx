import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", username: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
      } else {
        await register(form);
      }
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.error || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{mode === "login" ? "Login" : "Register"}</h2>
        <button className="text-blue-600 text-sm" onClick={() => setMode(mode === "login" ? "register" : "login")}>
          {mode === "login" ? "Create account" : "Have an account? Login"}
        </button>
      </div>

      {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}

      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input name="email" type="email" required value={form.email} onChange={onChange} className="mt-1 w-full border rounded p-2" />
        </div>
        {mode === "register" && (
          <div>
            <label className="block text-sm font-medium">Username</label>
            <input name="username" type="text" required value={form.username} onChange={onChange} className="mt-1 w-full border rounded p-2" />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input name="password" type="password" required value={form.password} onChange={onChange} className="mt-1 w-full border rounded p-2" />
        </div>
        {mode === "register" && (
          <div>
            <label className="block text-sm font-medium">Confirm Password</label>
            <input name="confirmPassword" type="password" required value={form.confirmPassword} onChange={onChange} className="mt-1 w-full border rounded p-2" />
          </div>
        )}

        <button disabled={loading} type="submit" className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-500">
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
        </button>
      </form>
    </div>
  );
}
