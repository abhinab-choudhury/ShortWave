import React from 'react';
import { Toaster } from '../ui/toaster';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="p-8 min-h-screen max-h-screen flex flex-col">
      <div className="flex flex-col items-center min-h-full my-auto">
        {children}
      </div>
      <Toaster />
    </main>
  );
};

export default AuthLayout;
