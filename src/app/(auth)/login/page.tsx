"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import Image from "next/image";

import SideBG from "../../../../public/animated-images/Student with books.json";
import Logo from "../../../../public/image/Brand-Logo.png";
import { getAccessToken, setTokens } from "@/lib/auth";
import { authApi } from "@/services/auth/api";

const OTP_LENGTH = 6;

export default function LoginPage() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(otpArray(OTP_LENGTH));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const accessToken = getAccessToken();

  // Redirect if already authenticated
  useEffect(() => {
    if (accessToken) router.push("/dashboard");
  }, [accessToken, router]);

  // Focus first OTP input on step change
  useEffect(() => {
    if (step === "otp") {
      otpRefs.current[0]?.focus();
    }
  }, [step]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const nextOtp = [...otp];
    nextOtp[index] = value;
    setOtp(nextOtp);

    if (value && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  function otpArray(n: number): string[] {
    return Array(n).fill("");
  }
  function isOtpComplete(otp: string[]) {
    return otp.every((digit) => digit !== "");
  }

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .slice(0, OTP_LENGTH)
      .split("");
    const newOtp = [...pasted, ...otpArray(OTP_LENGTH)].slice(0, OTP_LENGTH);
    setOtp(newOtp);
    const idx = newOtp.findIndex((d) => d === "");
    otpRefs.current[idx === -1 ? OTP_LENGTH - 1 : idx]?.focus();
  };

  // --- FORM HANDLERS ---

  const sendEmail = async (
    e: React.FormEvent<HTMLFormElement> | { preventDefault: () => void }
  ) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await authApi.sendOtp(email);
      if (!res.success) throw new Error(res.message);
      setStep("otp");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const otpString = otp.join("");
      const res = await authApi.verifyOtp(email, otpString);
      const { accessToken, refreshToken } = res.tokens;
      setTokens(accessToken, refreshToken);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left hero */}
      <div className="relative hidden lg:block bg-gradient-to-b from-primary to-primary text-primary-foreground">
        <Lottie animationData={SideBG} loop autoplay className="w-full mt-52" />
        <div className="absolute bottom-10 left-10">
          <div className="mb-6 flex items-center gap-2 bg-white/30 backdrop:blur-sm rounded-full w-fit px-3 py-1">
            <Image
              src={Logo}
              alt="Brand Logo"
              width={1920}
              height={1080}
              className="w-auto h-10"
            />
          </div>
          <h2 className="text-4xl xl:text-5xl font-extrabold leading-tight">
            Learn smarter, level up faster
          </h2>
          <p className="mt-4 max-w-md">
            Bite-sized quizzes. Clear explanations. Real progress—one chapter at
            a time.
          </p>
        </div>
      </div>
      {/* Right panel */}
      <div className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground">
              Welcome Back
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to your account
            </p>
          </div>
          {/* Error */}
          {error && (
            <div
              className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive animate-[shake_0.5s_ease-in-out]"
              aria-live="assertive"
            >
              {error}
            </div>
          )}
          {/* Email step */}
          {step === "email" && (
            <form onSubmit={sendEmail} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-foreground"
                >
                  Your Email
                </label>
                <input
                  id="email"
                  type="email"
                  aria-label="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-input bg-background px-4 py-3"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading || !email}
                className="w-full rounded-lg bg-primary text-primary-foreground px-4 py-3 font-bold flex items-center justify-center"
              >
                {loading ? (
                  <span className="h-5 w-5 animate-spin border-2 border-background border-t-transparent rounded-full" />
                ) : (
                  "Send OTP"
                )}
              </button>
            </form>
          )}
          {/* OTP step */}
          {step === "otp" && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-lg font-semibold text-foreground">
                  Enter Verification Code
                </h2>
                <p className="text-sm text-muted-foreground">
                  We've sent a 6-digit code to{" "}
                  <span className="font-medium">{email}</span>
                </p>
              </div>
              <form onSubmit={verifyOtp} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-center gap-3">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          otpRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        onChange={(e) =>
                          handleOtpChange(
                            index,
                            e.target.value.replace(/\D/g, "")
                          )
                        }
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={handleOtpPaste}
                        className="w-12 h-12 md:w-14 md:h-14 text-center text-xl md:text-2xl font-bold border-2 border-input rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
                        aria-label={`Digit ${index + 1}`}
                      />
                    ))}
                  </div>
                  {/* Visual indicator for completion */}
                  <div className="flex justify-center gap-1">
                    {otp.map((digit, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          digit ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading || !isOtpComplete(otp)}
                  className="w-full rounded-lg bg-primary text-primary-foreground px-4 py-3 font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? (
                    <span className="h-5 w-5 animate-spin border-2 border-primary-foreground border-t-transparent rounded-full" />
                  ) : (
                    "Verify & Login"
                  )}
                </button>
                <div className="text-center space-y-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("email");
                      setOtp(otpArray(OTP_LENGTH));
                      setError("");
                    }}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← Back to Email
                  </button>
                  <div className="text-sm text-muted-foreground">
                    Didn't receive code?{" "}
                    <button
                      type="button"
                      onClick={() =>
                        sendEmail({
                          preventDefault: () => {},
                        } as React.FormEvent<HTMLFormElement>)
                      }
                      className="text-primary hover:underline font-medium"
                    >
                      Resend OTP
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
