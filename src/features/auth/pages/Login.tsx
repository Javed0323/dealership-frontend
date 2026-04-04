import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useAuth } from "@/shared/hooks/useAuth";
import { loginRequest } from "../api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const siteKey = import.meta.env.VITE_RECAPTCHASTEKEY;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get recaptcha token
    const recaptchaToken = recaptchaRef.current?.getValue();
    if (!recaptchaToken) {
      alert("Please complete the reCAPTCHA");
      return;
    }

    try {
      setLoading(true);
      const data = await loginRequest(username, password, recaptchaToken);
      login(data.access_token);
      navigate("/admin/dashboard");
    } catch (error: any) {
      logout();
      console.error(error);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-xl bg-slate-200 border-slate-300 mx-auto my-18 p-10 rounded">
        <div className="mb-6">
          <h1 className="text-5xl font-bold text-center">Welcome Back!</h1>
          <p className="text-center text-slate-600 mt-2">
            Please login to your account to continue.
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center w-80 mx-auto gap-y-2"
        >
          <input
            className="border border-slate-300 p-3 m-2 w-full bg-white outline-none rounded"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="border border-slate-300 p-3 m-2 w-full bg-white outline-none rounded"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* reCAPTCHA widget */}
          <ReCAPTCHA sitekey={siteKey} ref={recaptchaRef} className="my-2" />

          <button
            disabled={loading}
            type="submit"
            className="bg-blue-500
            disabled:bg-blue-300
             text-white py-2 my-2 rounded ml-auto px-6 hover:bg-white hover:text-blue-500 border border-blue-500 transition-colors duration-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
