import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (pwd) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(pwd);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (!validatePassword(password)) {
      toast.error(
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character."
      );
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
console.log(response)
      let data;
    try {
      data = await response.json();
    } catch {
      const text = await response.text();
      data = { message: text };
    }

    if (!response.ok) {
   
      toast.error(data.message || `Signup failed (Error ${response.status})`);
      return;
    }

    toast.success("Signup successful! Please login.");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  } catch (error) {
    console.error("Error:", error);
    toast.error("Network error. Please check your connection.");
  }
};

  return (
    <div className="flex min-h-screen">
      {/* Left side (Logo + Marketing Text) */}
      <div className="hidden md:flex flex-col justify-center bg-black text-white w-1/2 p-12">
        <div className="mb-10">
          <img src="/logo.webp" alt="Logo" className="h-12" />
          <h1 className="text-2xl font-bold">
            Login<span className="text-blue-400">Radius</span>
          </h1>
        </div>

        <h1 className="text-3xl font-bold mb-6">
          Create your <span className="text-blue-400">account</span>
        </h1>
        <ul className="space-y-4 text-lg">
          <li>✔️ Quick signup with email & password</li>
          <li>✔️ Supports passkeys and social login</li>
          <li>✔️ Built-in security & MFA protection</li>
        </ul>
        <div className="mt-8 text-sm opacity-80">Trusted by brands worldwide</div>
      </div>

      {/* Right side (Signup Form) */}
      <div className="flex justify-center items-center w-full md:w-1/2 bg-gray-50">
        <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
          <Toaster /> {/* Toast container */}
          <h2 className="text-2xl font-bold text-center mb-1">Sign Up</h2>
          <p className="text-gray-500 text-center mb-6">Create a new account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              {/* Live password validation */}
              {password && !validatePassword(password) && (
                <p className="text-red-600 text-sm mt-1">
                  Must be 8+ chars, include uppercase, lowercase, number & symbol.
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2 text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {/* Live confirm password check */}
              {confirmPassword && password === confirmPassword && (
                <p className="flex items-center gap-1 text-green-600 text-sm mt-1">
                  <CheckCircle2 size={16} /> Passwords match
                </p>
              )}
              {confirmPassword && password !== confirmPassword && (
                <p className="flex items-center gap-1 text-red-600 text-sm mt-1">
                  <XCircle size={16} /> Passwords do not match
                </p>
              )}
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Sign Up
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 font-medium hover:underline">
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
