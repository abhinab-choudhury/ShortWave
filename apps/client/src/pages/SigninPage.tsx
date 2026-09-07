import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import GoogleLogo from "/google_logo.png";
import GithubLogo from "/github_logo.png";
import AuthLayout from "@/components/layouts/AuthLayout";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Browser } from "@capacitor/browser";
import { App as CapApp } from "@capacitor/app";
import { Preferences } from "@capacitor/preferences";
import { isNative } from "@/lib/platform";

const emailSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field needs to be filled." })
    .email({ message: "Invalid email address." }),
});

const otpSchema = z.object({
  otp: z
    .string()
    .min(6, { message: "Enter the 6-digit code." })
    .regex(/^\d{6}$/, { message: "Code must be 6 digits." }),
});

const AUTH_TOKEN_KEY = "authToken";

type Step = "email" | "otp";

const SigninPage: React.FC = () => {
  const native = isNative();

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });
  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const navigate = useNavigate();
  const { isLoading, user, refreshUser } = useAuth();
  const [step, setStep] = useState<Step>("email");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [resendTimer, setResendTimer] = useState<number>(0);
  const [oauthLoading, setOauthLoading] = useState<{
    google: boolean;
    github: boolean;
  }>({ google: false, github: false });

  useEffect(() => {
    if (!resendTimer) return;
    const id = setInterval(() => {
      setResendTimer((t) => (t <= 1 ? 0 : t - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  const startResendCountdown = () => setResendTimer(30);

  const handleSendOtp = async (values: z.infer<typeof emailSchema>) => {
    try {
      setIsSending(true);
      const response = await axiosInstance.post("/auth/otp/request", {
        email: values.email,
        platform: native ? "native" : "web",
      });
      if (response.status === 200) {
        toast({
          variant: "default",
          title: "Code sent!",
          description:
            "A 6-digit verification code was emailed to " + values.email,
        });
        setStep("otp");
        startResendCountdown();
        emailForm.clearErrors();
      }
    } catch (error: any) {
      console.log("Error: ", error);
      toast({
        variant: "destructive",
        title: "❌ " +
          (error?.response?.data?.message || "Could not send the code."),
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOtp = async (values: z.infer<typeof otpSchema>) => {
    const email = emailForm.getValues("email");
    if (!email) {
      setStep("email");
      return;
    }
    try {
      setIsSending(true);
      const response = await axiosInstance.post("/auth/otp/verify", {
        email,
        otp: values.otp,
        platform: native ? "native" : "web",
      });
      const data = response.data?.data;
      if (response.status === 200 && data?.token) {
        localStorage.setItem(AUTH_TOKEN_KEY, data.token);
        if (native) {
          try {
            await Preferences.set({ key: AUTH_TOKEN_KEY, value: data.token });
          } catch {}
        }
        toast({ variant: "default", title: "✅ Signed in!" });
        await refreshUser();
        navigate("/dashboard", { replace: true });
      }
    } catch (error: any) {
      console.log("Error: ", error);
      toast({
        variant: "destructive",
        title: "❌ " +
          (error?.response?.data?.message || "Invalid code. Try again."),
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleResend = async () => {
    const email = emailForm.getValues("email");
    if (!email) {
      setStep("email");
      return;
    }
    await handleSendOtp({ email });
  };

  const handleOAuthLogin = async (provider: "google" | "github") => {
    try {
      setOauthLoading((prev) => ({ ...prev, [provider]: true }));
      const url = `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/${provider}?platform=${native ? "native" : "web"}`;
      if (native) {
        await Browser.open({ url });
        const listener = await CapApp.addListener("appUrlOpen", async (event) => {
          try {
            const u = new URL(event.url);
            if (u.searchParams.get("token")) {
              await Browser.close();
              listener.remove();
              window.location.href = "/dashboard" + u.search;
            }
          } catch {}
        });
        setTimeout(() => listener.remove(), 120000);
      } else {
        window.open(url, "_self");
      }
    } finally {
      setOauthLoading((prev) => ({ ...prev, [provider]: false }));
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, user]);

  return (
    <AuthLayout>
      <div className="max-w-[420px] w-full flex flex-col gap-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 rounded-2xl p-8 border border-slate-200/60 dark:border-slate-700/50">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome to Shortwave
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {native
              ? "Sign in with your email to receive a one-time code"
              : "Sign in to your account to continue"}
          </p>
        </div>

        {native && step === "otp" ? (
          <form onSubmit={otpForm.handleSubmit(handleVerifyOtp)} className="space-y-5">
            <FormField
              control={otpForm.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                    Verification Code
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="000000"
                      className="h-14 w-full text-center text-2xl font-bold tracking-[0.5em] bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all duration-200 rounded-lg"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-slate-400 dark:text-slate-500 text-center">
                    We emailed a 6-digit code to{" "}
                    <span className="font-medium text-slate-500 dark:text-slate-400">
                      {emailForm.getValues("email")}
                    </span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isSending}
              type="submit"
              variant="default"
              className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] dark:bg-teal-500 dark:hover:bg-teal-400 dark:text-slate-950"
            >
              {isSending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Verify Code"
              )}
            </Button>
            <div className="flex items-center justify-between">
              <button
                type="button"
                disabled={resendTimer > 0}
                onClick={handleResend}
                className="text-xs font-medium text-teal-600 dark:text-teal-400 disabled:text-slate-300 dark:disabled:text-slate-600 disabled:cursor-not-allowed"
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend code"}
              </button>
              <button
                type="button"
                onClick={() => setStep("email")}
                className="text-xs font-medium text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
              >
                Change email
              </button>
            </div>
          </form>
        ) : (
          <>
            <form
              onSubmit={emailForm.handleSubmit(
                native ? handleSendOtp : onSubmitMagicLink,
              )}
              className="space-y-5"
            >
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        className="h-11 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all duration-200 rounded-lg"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-slate-400 dark:text-slate-500">
                      {native
                        ? "Enter your email to receive a one-time sign-in code."
                        : "Enter your email address to receive your secure login link."}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={isLoading || isSending}
                type="submit"
                variant="default"
                className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] dark:bg-teal-500 dark:hover:bg-teal-400 dark:text-slate-950"
              >
                {isLoading || isSending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : native ? (
                  "Send Code"
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </>
        )}

        {!native && (
          <>
            <div className="flex w-auto items-center justify-center gap-3 text-slate-400 dark:text-slate-500">
              <Separator className="flex-1 bg-slate-200 dark:bg-slate-700" />
              <p className="uppercase font-medium text-[11px] tracking-widest whitespace-nowrap">
                Or continue with
              </p>
              <Separator className="flex-1 bg-slate-200 dark:bg-slate-700" />
            </div>

            <div className="flex flex-col gap-2.5">
              <Button
                type="button"
                onClick={() => handleOAuthLogin("google")}
                disabled={oauthLoading.google}
                className="w-full h-11 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg font-medium transition-all duration-200 hover:shadow-sm hover:scale-[1.01] active:scale-[0.99]"
              >
                {oauthLoading.google ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <img src={GoogleLogo} alt="Google logo" className="h-5 w-5 mr-2.5" />
                )}
                Continue with Google
              </Button>

              <Button
                type="button"
                onClick={() => handleOAuthLogin("github")}
                disabled={oauthLoading.github}
                className="w-full h-11 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg font-medium transition-all duration-200 hover:shadow-sm hover:scale-[1.01] active:scale-[0.99]"
              >
                {oauthLoading.github ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <img src={GithubLogo} alt="Github logo" className="h-5 w-5 mr-2.5" />
                )}
                Continue with GitHub
              </Button>
            </div>
          </>
        )}
      </div>
    </AuthLayout>
  );

  async function onSubmitMagicLink(values: z.infer<typeof emailSchema>) {
    try {
      setIsSending(true);
      const response = await axiosInstance.post("/auth/signin", {
        data: values,
      });
      if (response.status === 200) {
        toast({
          variant: "default",
          title: response.data.message || "Check Your Email",
        });
        emailForm.reset();
      } else {
        toast({ variant: "default", title: "❌ Signin Failed!!!" });
      }
    } catch (error) {
      console.log("Error: ", error);
      toast({ variant: "default", title: "❌ Unknown Error has Occurred." });
    } finally {
      setIsSending(false);
    }
  }
};

export default SigninPage;