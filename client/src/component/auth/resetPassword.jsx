import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "../../service/axiosInstance";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenVerified, setIsTokenVerified] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(
          `/api/auth/validate-token?email=${email}&token=${token}`
        );
        setIsLoading(false);
        if (response.data.success) {
          setIsTokenVerified(true);
        } else {
          setIsTokenVerified(false);
        }
      } catch (err) {
        setIsLoading(false);
        console.log(err);
        toast.error("Error while validating token.");
      }
    };
    checkToken();
  }, []);

  useEffect(() => {
    console.log("isTokenVerified:", isTokenVerified);
  }, [isTokenVerified]);

  const validatePassword = (pass) => {
    if (pass.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(pass))
      return "Password must contain an uppercase letter.";
    if (!/[0-9]/.test(pass)) return "Password must contain a number.";
    if (!/[!@#$%^&*]/.test(pass))
      return "Password must contain a special character (!@#$%^&*).";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Password don't match.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axiosInstance.post("/api/auth/reset-password", {
        email,
        password,
        token,
      });

      setIsLoading(false);
      if (response.data.success) {
        setSuccess(true);
        setTimeout(()=> {
          navigate("/login")
        }, 5000)
      } else {
        toast.error(response.data.message || "Error while resetting password");
      }
    } catch (err) {
      console.log(err.message);
      toast.error("Error while reseting password.");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-80 h-80 bg-linear-to-br from-blue-500/30 to-cyan-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-linear-to-br from-orange-500/30 to-pink-500/20 rounded-full blur-3xl"></div>
      </div>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-linear-to-br from-blue-600 to-cyan-500 rounded-xl mb-4 shadow-lg">
            <span className="text-2xl font-bold text-white">E</span>
          </div>
          <a href="/">
            <h1 className="text-4xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              Eventra
            </h1>
          </a>
          <p className="text-slate-400 text-lg">Reset your password</p>
        </div>

        {!success ? (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-200"
                >
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-slate-600/50 rounded-xl bg-slate-700/30 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-semibold text-slate-200"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-slate-600/50 rounded-xl bg-slate-700/30 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="p-4 bg-slate-700/20 border border-slate-600/30 rounded-xl space-y-2">
                <p className="text-xs font-semibold text-slate-300">
                  Password requirements:
                </p>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li className={password.length >= 8 ? "text-cyan-400" : ""}>
                    • At least 8 characters
                  </li>
                  <li className={/[A-Z]/.test(password) ? "text-cyan-400" : ""}>
                    • One uppercase letter
                  </li>
                  <li className={/[0-9]/.test(password) ? "text-cyan-400" : ""}>
                    • One number
                  </li>
                  <li
                    className={
                      /[!@#$%^&*]/.test(password) ? "text-cyan-400" : ""
                    }
                  >
                    • One special character (!@#$%^&*)
                  </li>
                </ul>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-900/20 border border-red-700/50 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !isTokenVerified}
                className="w-full py-3 px-4 bg-linear-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg mt-6"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Resetting Password...
                  </>
                ) : !isTokenVerified ? (
                  <>
                    <Lock className="w-5 h-5" />
                    Invalid Token
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Reset Password
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          // Success State
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 bg-linear-to-br from-cyan-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center mx-auto border border-cyan-500/50">
              <CheckCircle className="w-8 h-8 text-cyan-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">
                Password Reset Successful!
              </h2>
              <p className="text-slate-400">
                Your password has been updated. You can now log in with your new
                password.
              </p>
            </div>
            <a
              href="/login"
              className="inline-block w-full py-3 px-4 bg-linear-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 shadow-lg"
            >
              Back to Login
            </a>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-slate-400 text-sm mt-6">
          Remember your password?{" "}
          <a
            href="/login"
            className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
          >
            Sign in here
          </a>
        </p>
      </div>
    </div>
  );
}
