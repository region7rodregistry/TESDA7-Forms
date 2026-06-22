"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signInWithEmailAndPassword } from "firebase/auth";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getAuthClient } from "@/lib/firebase";
import { redirectFor } from "@/lib/roles";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteCredit } from "@/components/site/SiteCredit";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // If already signed in, bounce to the right dashboard.
  useEffect(() => {
    if (!authLoading && user?.email) router.replace(redirectFor(user.email));
  }, [authLoading, user, router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const cred = await signInWithEmailAndPassword(getAuthClient(), email, password);
      router.replace(redirectFor(cred.user.email));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed.";
      toast.error("Login failed", { description: message });
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-black via-blue-900 to-white">
      <div className="flex flex-1 items-center justify-center p-4">
        <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-lg">
          <div className="mb-8 text-center">
            <Image
              src="/icons/t7ilogo.png"
              alt="TESDA Region VII"
              width={96}
              height={96}
              className="mx-auto mb-4 object-contain"
            />
            <h1 className="text-3xl font-bold text-white">Welcome</h1>
            <h2 className="text-xl font-semibold text-blue-200">NTTC PO Focal</h2>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-sky-400 to-white" />
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-blue-100">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-white/30 bg-white/10 text-white placeholder:text-blue-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-blue-100">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-white/30 bg-white/10 pr-11 text-white placeholder:text-blue-200"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200 hover:text-white"
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              size="lg"
              className="w-full rounded-lg"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 size-5 animate-spin" /> Signing In…
                </>
              ) : (
                <>
                  <LogIn className="mr-2 size-5" /> Sign In
                </>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-blue-200">
            Don&apos;t have an account?{" "}
            <span className="font-semibold text-white">Contact Administrator</span>
          </p>
        </div>

        <p className="mt-8 text-center text-sm text-white/70">
          © {new Date().getFullYear()} NTTC PO Focal. All rights reserved.
        </p>
        </motion.div>
      </div>

      <SiteCredit />
    </main>
  );
}
