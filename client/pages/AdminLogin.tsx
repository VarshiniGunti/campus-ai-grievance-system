import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Lock, Mail, ArrowLeft, LogIn } from "lucide-react";
import { toast } from "sonner";
import { loginAdmin } from "@/utils/admin-auth";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!pin.trim()) {
      setError("PIN is required");
      return;
    }

    if (pin.length !== 4) {
      setError("PIN must be 4 digits");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const authUser = loginAdmin(email, pin);

      if (authUser) {
        toast.success(`Welcome back, ${email}!`);
        navigate("/admin-dashboard");
      } else {
        setError("Invalid email or PIN. Please try again.");
        toast.error("Login failed");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
            <span className="font-semibold text-slate-900">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            <span className="text-sm text-slate-600 font-semibold">Admin Login</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Access</h1>
            <p className="text-slate-600">
              Sign in with your email and PIN to access the admin dashboard
            </p>
          </div>

          {/* Login Card */}
          <Card className="p-8 border-slate-200 shadow-lg">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Error Alert */}
              {error && (
                <Alert className="border-destructive/20 bg-destructive/5">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <AlertTitle>Login Failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-900 mb-2">
                  Email Address <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@campus.edu"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    disabled={isLoading}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* PIN Field */}
              <div>
                <label htmlFor="pin" className="block text-sm font-semibold text-slate-900 mb-2">
                  Admin PIN <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="pin"
                    type="password"
                    placeholder="••••"
                    value={pin}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      if (value.length <= 4) {
                        setPin(value);
                      }
                      if (error) setError("");
                    }}
                    maxLength={4}
                    disabled={isLoading}
                    className="pl-10"
                    inputMode="numeric"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">Enter your 4-digit PIN</p>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 gap-2 h-11"
              >
                {isLoading ? (
                  <>
                    <span className="inline-block animate-spin">⏳</span>
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            {/* Test Credentials Info */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <details className="group cursor-pointer">
                <summary className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition">
                  🔐 Demo Credentials (for testing)
                </summary>
                <div className="mt-4 space-y-3 text-sm text-slate-600 bg-slate-50 p-4 rounded-lg">
                  <div>
                    <p className="font-mono text-xs bg-white px-2 py-1 rounded border border-slate-200 mb-1">
                      admin@campus.edu
                    </p>
                    <p className="font-mono text-xs bg-white px-2 py-1 rounded border border-slate-200">
                      PIN: 1234
                    </p>
                  </div>
                  <div className="border-t border-slate-200 pt-3">
                    <p className="font-mono text-xs bg-white px-2 py-1 rounded border border-slate-200 mb-1">
                      grievance@campus.edu
                    </p>
                    <p className="font-mono text-xs bg-white px-2 py-1 rounded border border-slate-200">
                      PIN: 5678
                    </p>
                  </div>
                </div>
              </details>
            </div>
          </Card>

          {/* Footer Info */}
          <div className="mt-8 text-center text-sm text-slate-600">
            <p>
              Contact your system administrator if you need access credentials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
