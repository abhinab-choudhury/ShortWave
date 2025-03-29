import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import GoogleLogo from '/google_logo.png';
import GithubLogo from '/github_logo.png';
import AuthLayout from '@/components/Layouts/AuthLayout';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'This field need to be filled.' })
    .email({ message: 'Invalid Email Address.' }),
});

const SignupPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('Login Button Clicked');
    console.log('Value : ', values);
  };
  return (
    <AuthLayout>
      <Form {...form}>
        <h1 className="text-3xl">Welcome to Shortwave</h1>
        <p className="text-base">Sign up for an account</p>
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
                  Enter your email address to receive your secure signup link.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant={'secondary'} className="w-full">
            Sign up
          </Button>
          <div className="flex w-auto items-center align-middle justify-center">
            <Separator className="mx-2 w-28" />
            <p className="uppercase font-thin text-sm">Or continue with</p>
            <Separator className="mx-2 w-28" />
          </div>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              className="w-full text-base flex justify-center align-middle items-center"
            >
              <img
                src={GoogleLogo}
                alt="Google logo"
                className="h-5 w-5 mr-2"
              />
              Google
            </Button>
            <Button
              type="button"
              className="w-full text-base flex justify-center align-middle items-center"
            >
              <img
                src={GithubLogo}
                alt="Google logo"
                className="h-5 w-5 mr-2"
              />
              Github
            </Button>
          </div>
        </form>
      </Form>
      <div className="mt-4 text-center">
        <p className="text-sm">
          Already have an account?{' '}
          <Link to="/signin" className="text-blue-500">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignupPage;
