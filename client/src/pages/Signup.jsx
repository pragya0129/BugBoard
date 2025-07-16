import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "developer",
  });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        form
      );
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F4FF] px-4">
      <div className="relative w-full max-w-md">
        {/* Peeking Image */}
        <img
          src="/images/work.png"
          alt="Peeking"
          className="absolute -top-15 left-1/2 transform -translate-x-1/2 w-20 h-20"
        />

        {/* Signup Card */}
        <div className="w-full bg-white rounded-3xl shadow-xl p-8 border border-blue-100 pt-14">
          <h2 className="text-3xl font-semibold text-blue-700 mb-6 text-center tracking-tight">
            Create an Account
          </h2>

          {error && (
            <div className="bg-[#FCD8DF] text-[#410002] p-3 rounded-lg mb-5 text-sm text-center font-medium shadow-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-700 mb-1 font-medium">
                Name
              </label>
              <input
                name="name"
                type="text"
                required
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full rounded-xl border border-gray-300 px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1 font-medium">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full rounded-xl border border-gray-300 px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1 font-medium">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                onChange={handleChange}
                placeholder="Create a password"
                className="w-full rounded-xl border border-gray-300 px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1 font-medium">
                Role
              </label>
              <select
                name="role"
                onChange={handleChange}
                value={form.role}
                className="w-full rounded-xl border border-gray-300 px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              >
                <option value="developer">Developer</option>
                <option value="tester">Tester</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2.5 rounded-full font-medium hover:bg-blue-700 transition shadow-md"
            >
              Sign Up
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
