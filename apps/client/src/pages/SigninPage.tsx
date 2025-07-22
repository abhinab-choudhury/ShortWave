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
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSending(true);
      const response = await axiosInstance.post("/auth/signin", {
        data: values,
      });
      if (response.status == 200) {
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
    } catch (err) {
      console.log("Error: ", err);
      toast({
        variant: "default",
        title: "❌ Unknow Error has Occured.",
      });
    } finally {
      setIsSending(false);
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
        <div className="max-w-[420px] w-full flex flex-col gap-6 bg-white dark:bg-slate-900 shadow-md rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
          <h1 className="text-3xl text-center font-semibold text-slate-800 dark:text-white">
            Welcome to Shortwave
          </h1>
          <p className="text-sm text-center text-slate-600 dark:text-slate-300">
            Create an account
          </p>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 dark:text-slate-300">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-primary focus:border-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-slate-500 dark:text-slate-400">
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
              className="w-full bg-primary hover:bg-primary/90 text-white dark:text-black"
            >
              {isLoading || isSending ? (
                <Loader2 className="h-5 w-5 animate-spin text-white" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="flex w-auto items-center justify-center text-slate-500 dark:text-slate-400">
            <Separator className="mx-2 w-24 bg-slate-300 dark:bg-slate-600" />
            <p className="uppercase font-medium text-xs tracking-wide">
              Or continue with
            </p>
            <Separator className="mx-2 w-24 bg-slate-300 dark:bg-slate-600" />
          </div>

          <div className="flex flex-col gap-2">
            <Button
              type="button"
              onClick={() =>
                window.open(
                  `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/google`,
                  "_self",
                )
              }
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <img
                src={GoogleLogo}
                alt="Google logo"
                className="h-6 w-6 mr-2"
              />
              Google
            </Button>
            <Button
              type="button"
              onClick={() =>
                window.open(
                  `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/github`,
                  "_self",
                )
              }
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <img
                src={GithubLogo}
                alt="Github logo"
                className="h-5 w-5 mr-2"
              />
              Github
            </Button>
          </div>
        </div>
      </Form>
    </AuthLayout>
  );
};

export default SigninPage;
