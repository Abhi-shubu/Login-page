import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  // Load saved credentials if "Remember me" was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRemember(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = { message: await response.text() };
      }

      if (!response.ok) {
        toast.error(data.message || "Login failed");
        return;
      }

      toast.success("Login successful ✅");

      // Save credentials if "Remember me" is checked
      if (remember) {
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
      } else {
        localStorage.removeItem("email");
        localStorage.removeItem("password");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side */}
      <div className="hidden md:flex flex-col justify-center bg-black text-white w-1/2 p-12">
        <div className="mb-10">
          <img src="/logo.webp" alt="Logo" className="h-12" />
          <h1 className="text-2xl font-bold">
            Login<span className="text-blue-400">Radius</span>
          </h1>
        </div>
        <h1 className="text-3xl font-bold mb-6">
          Effortlessly add Login to your{" "}
          <span className="text-blue-400">app</span>
        </h1>
        <ul className="space-y-4 text-lg">
          <li>✔️ Implement passwordless, passkeys, and social logins in minutes</li>
          <li>✔️ Design modern signup and login workflows with no-code orchestration</li>
          <li>✔️ Protect your app with MFA, bot protection, and risk-based security</li>
        </ul>
        <div className="mt-8 text-sm opacity-80">Trusted by brands worldwide</div>
      </div>

      {/* Right side (Login Form) */}
      <div className="flex justify-center items-center w-full md:w-1/2 bg-gray-50">
        <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
          <Toaster />
          <h2 className="text-2xl font-bold text-center mb-1">Sign In</h2>
          <p className="text-gray-500 text-center mb-6">Welcome Back</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Password with eye icon */}
            <div>
              <label className="block text-sm mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me (no Forgot Password) */}
            <div className="flex items-center text-sm text-gray-600">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                  className="w-4 h-4 text-blue-600"
                />
                Remember me
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-600 font-medium hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
