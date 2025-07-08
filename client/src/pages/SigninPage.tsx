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
import AuthLayout from "@/components/Layouts/AuthLayout";
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
  console.log("User : ", user);
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate, user]);
  return (
    <AuthLayout>
      <Form {...form}>
        <div className="max-w-[420px] w-full flex flex-col gap-5">
          <h1 className="text-3xl text-center">Welcome to Shortwave</h1>
          <p className="text-base text-center">Create an account</p>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter your email address to receive your secure login link.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isLoading || isSending ? true : false}
              type="submit"
              variant={"secondary"}
              className="w-full"
            >
              {isLoading || isSending ? (
                <Loader2 className="h-8 w-8 animate-spin text-black dark:text-white" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
          <div className="flex w-auto items-center align-middle justify-center">
            <Separator className="mx-2 w-28" />
            <p className="uppercase font-thin text-sm">Or continue with</p>
            <Separator className="mx-2 w-28" />
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
              className="w-full text-base flex justify-center align-middle items-center"
            >
              <img
                src={GoogleLogo}
                alt="Google logo"
                className="h-8 w-8 mr-2"
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
              className="w-full text-base flex justify-center align-middle items-center"
            >
              <img
                src={GithubLogo}
                alt="Google logo"
                className="h-6 w-6 mr-2"
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
