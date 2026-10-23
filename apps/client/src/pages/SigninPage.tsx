import {
  Form,
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
// @ts-ignore
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
import { ArrowLeft, Loader2 } from "lucide-react";
import { Preferences } from "@capacitor/preferences";
import { isNative } from "@/lib/platform";

const emailSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Enter your email address." })
    .email({ message: "Enter a valid email address." }),
});

const otpSchema = z.object({
  otp: z
    .string()
    .min(6, { message: "Enter the 6-digit code." })
    .regex(/^\d{6}$/, { message: "The code must be 6 digits." }),
});

const AUTH_TOKEN_KEY = "authToken";

type Step = "email" | "otp";

function getErrorMessage(error: unknown, fallback: string) {
  const responseError = error as {
    response?: {
      data?: {
        message?: string;
        data?: { errors?: string[] };
      };
    };
  };
  return (
    responseError.response?.data?.message ||
    responseError.response?.data?.data?.errors?.[0] ||
    fallback
  );
}

const SigninPage: React.FC = () => {
  const native = isNative();
  const navigate = useNavigate();
  const { isLoading, user, refreshUser } = useAuth();

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    // @ts-ignore
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });
  const otpForm = useForm<z.infer<typeof otpSchema>>({
    // @ts-ignore
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const [step, setStep] = useState<Step>("email");
  const [isSending, setIsSending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [oauthLoading, setOauthLoading] = useState({
    google: false,
    github: false,
  });

  useEffect(() => {
    if (!resendTimer) return;
    const id = window.setInterval(() => {
      setResendTimer((seconds) => (seconds <= 1 ? 0 : seconds - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [resendTimer]);

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [navigate, user]);

  const requestCode = async (email: string) => {
    try {
      setIsSending(true);
      await axiosInstance.post("/auth/otp/request", {
        email,
        platform: native ? "native" : "web",
      });
      toast({
        title: "Code sent",
        description: `A 6-digit code was sent to ${email}.`,
      });
      setStep("otp");
      setResendTimer(30);
      otpForm.reset();
    } catch (error) {
      toast({
        title: "Couldn't send the code",
        description: getErrorMessage(error, "Please try again."),
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleSendOtp = async (values: z.infer<typeof emailSchema>) => {
    await requestCode(values.email);
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
            await Preferences.set({
              key: AUTH_TOKEN_KEY,
              value: data.token,
            });
          } catch {
            // The web storage fallback still holds the session.
          }
        }
        toast({ title: "Signed in", description: "Welcome back." });
        await refreshUser();
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      toast({
        title: "Couldn't verify the code",
        description: getErrorMessage(error, "Check the code and try again."),
        variant: "destructive",
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
    await requestCode(email);
  };

  const handleOAuthLogin = async (provider: "google" | "github") => {
    setOauthLoading((current) => ({ ...current, [provider]: true }));
    try {
      const url = `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/${provider}?platform=web`;
      window.location.assign(url);
    } finally {
      setOauthLoading((current) => ({ ...current, [provider]: false }));
    }
  };

  async function onSubmitMagicLink(values: z.infer<typeof emailSchema>) {
    try {
      setIsSending(true);
      const response = await axiosInstance.post("/auth/signin", {
        data: values,
      });
      toast({
        title: "Check your email",
        description:
          response.data.message ||
          "Open the secure sign-in link we sent to your inbox.",
      });
      emailForm.reset();
    } catch (error) {
      toast({
        title: "Couldn't send the sign-in link",
        description: getErrorMessage(error, "Please try again."),
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <AuthLayout>
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="space-y-2">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-primary">
            {native ? "Android app" : "Welcome back"}
          </p>
          <h1 className="font-display text-4xl leading-none tracking-[-0.03em]">
            {step === "otp" ? "Check your inbox." : "Sign in to Shortwave."}
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            {native
              ? "Enter your email and we'll send a one-time sign-in code."
              : step === "otp"
                ? `Enter the code we sent to ${emailForm.getValues("email")}.`
                : "Use an email link or continue with Google or GitHub."}
          </p>
        </div>

        {native && step === "otp" ? (
          <Form {...otpForm}>
            <form
              onSubmit={otpForm.handleSubmit(handleVerifyOtp)}
              className="mt-7 space-y-5"
            >
              <FormField
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification code</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        placeholder="000000"
                        className="h-16 text-center font-mono text-2xl tracking-[0.45em]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The code expires shortly. You can request another one
                      below.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSending}
              >
                {isSending ? <Loader2 className="size-5 animate-spin" /> : null}
                {isSending ? "Verifying..." : "Verify code"}
              </Button>
              <div className="flex items-center justify-between gap-4 text-sm">
                <button
                  type="button"
                  disabled={resendTimer > 0 || isSending}
                  onClick={handleResend}
                  className="font-medium text-primary transition-colors hover:text-primary/80 disabled:cursor-not-allowed disabled:text-muted-foreground"
                >
                  {resendTimer > 0
                    ? `Resend in ${resendTimer}s`
                    : "Resend code"}
                </button>
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ArrowLeft className="size-3.5" aria-hidden="true" />
                  Change email
                </button>
              </div>
            </form>
          </Form>
        ) : (
          <>
            <Form {...emailForm}>
              <form
                onSubmit={emailForm.handleSubmit(
                  native ? handleSendOtp : onSubmitMagicLink,
                )}
                className="mt-7 space-y-5"
              >
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          autoComplete="email"
                          placeholder="name@example.com"
                          className="h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {native
                          ? "We'll email you a 6-digit code to sign in."
                          : "We'll email you a secure link that signs you in."}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isLoading || isSending}
                >
                  {isLoading || isSending ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : null}
                  {isSending
                    ? "Sending..."
                    : native
                      ? "Send sign-in code"
                      : "Email me a sign-in link"}
                </Button>
              </form>
            </Form>

            {!native ? (
              <>
                <div className="my-6 flex items-center gap-3 text-muted-foreground">
                  <Separator className="flex-1" />
                  <p className="text-[0.68rem] font-medium uppercase tracking-[0.14em]">
                    or continue with
                  </p>
                  <Separator className="flex-1" />
                </div>

                <div className="grid gap-2.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => handleOAuthLogin("google")}
                    disabled={oauthLoading.google}
                    className="w-full"
                  >
                    {oauthLoading.google ? (
                      <Loader2 className="mr-2.5 size-5 animate-spin" />
                    ) : (
                      <img
                        src={GoogleLogo}
                        alt=""
                        className="mr-2.5 size-5"
                      />
                    )}
                    Continue with Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => handleOAuthLogin("github")}
                    disabled={oauthLoading.github}
                    className="w-full"
                  >
                    {oauthLoading.github ? (
                      <Loader2 className="mr-2.5 size-5 animate-spin" />
                    ) : (
                      <img
                        src={GithubLogo}
                        alt=""
                        className="mr-2.5 size-5"
                      />
                    )}
                    Continue with GitHub
                  </Button>
                </div>
              </>
            ) : null}
          </>
        )}

        <p className="mt-7 border-t border-border/70 pt-5 text-center text-xs leading-5 text-muted-foreground">
          By continuing, you agree to receive transactional email about your
          account.
        </p>
      </div>
    </AuthLayout>
  );
};

export default SigninPage;
