import React from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';
import { Toaster } from '../ui/toaster';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="p-8 min-h-screen max-h-screen flex flex-col">
      <header className="h-5 flex justify-start">
        <Button variant={'secondary'}>
          <Link to="/" className="flex flex-row gap-1">
            <ArrowLeftIcon />
          </Link>
        </Button>
      </header>
      <div className="flex flex-col items-center min-h-full my-auto">
        {children}
      </div>
      <Toaster />
    </main>
  );
};

export default AuthLayout;
