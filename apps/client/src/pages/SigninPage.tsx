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

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field needs to be filled." })
    .email({ message: "Invalid email address." }),
});

const SigninPage: React.FC = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const navigate = useNavigate();
  const { isLoading, user } = useAuth();
  const [isSending, setIsSending] = useState<boolean>(false);
  const [oauthLoading, setOauthLoading] = useState<{
    google: boolean;
    github: boolean;
  }>({ google: false, github: false });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
        form.reset();
      } else {
        toast({
          variant: "default",
          title: "❌ Signin Failed!!!",
        });
      }
    } catch (error) {
      console.log("Error: ", error);
      toast({
        variant: "default",
        title: "❌ Unknown Error has Occurred.",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleOAuthLogin = async (provider: "google" | "github") => {
    try {
      setOauthLoading((prev) => ({ ...prev, [provider]: true }));
      window.open(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/${provider}`,
        "_self"
      );
    } finally {
      setOauthLoading((prev) => ({ ...prev, [provider]: false }));
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate, user]);

  return (
    <AuthLayout>
      <Form {...form}>
        <div className="max-w-[420px] w-full flex flex-col gap-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 rounded-2xl p-8 border border-slate-200/60 dark:border-slate-700/50">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Welcome to Shortwave
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
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
                      className="h-11 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 dark:focus:border-teal-400 transition-all duration-200 rounded-lg"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-slate-400 dark:text-slate-500">
                    Enter your email address to receive your secure login link.
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
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

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
        </div>
      </Form>
    </AuthLayout>
  );
};

export default SigninPage;
