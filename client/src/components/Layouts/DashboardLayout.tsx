'use client';
import { useState } from 'react';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import {
  IconArrowLeft,
  IconLayoutDashboard,
  IconSettings,
  IconChartCovariate,
} from '@tabler/icons-react';
import { Link, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from '../ui/use-toast';
import { ToastAction } from '@/components/ui/toast';
import ShortwaveLogo from '/shortwave_logo.png';
import { ThemeToggle } from '../ui/theme-toggle';

export function DashboardLayout() {
  const links = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: (
        <IconLayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: 'Analytics',
      href: '/dashboard/analytics',
      icon: (
        <IconChartCovariate className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: 'Settings',
      href: '/dashboard/settings',
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  const animate = false;
  const [open, setOpen] = useState(false);
  const handleLogout = () => {
    console.log('Logout btn Clicked');
    toast({
      title: 'Logged Out',
      description: 'You’re all set. Come back soon!',
    });
    toast({
      title: 'Session Expired',
      description: 'You’ve been logged out for security. Please sign in again',
      action: <ToastAction altText="Try again">Signin</ToastAction>,
    });
    toast({
      title: 'Logout Unsuccessful',
      description: 'Something went wrong. Please try again.',
      action: <ToastAction altText="Try again">Try again</ToastAction>,
    });
  };

  return (
    <div
      className={cn(
        'relative rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-gray-950 w-full h-screen flex-1 mx-auto border border-neutral-200 dark:border-gray-700 overflow-hidden',
      )}
    >
      <Sidebar open={open} setOpen={setOpen} animate={animate}>
        <SidebarBody className="justify-between gap-10 dark:bg-gray-950 pt-8 overflow-hidden">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden mb-auto">
            <Logo />
            <div className="mt-8 flex flex-col gap-2 h-fit">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
              <div
                onClick={handleLogout}
                className="flex items-center justify-start gap-2  group/sidebar py-2 cursor-pointer"
              >
                <div className="border-gray-300 border rounded-full p-2">
                  <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                </div>
                <div className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0">
                  Logout
                </div>
              </div>
            </div>
          </div>
          <div className='mt-[100%] md:mt-0'>
            <SidebarLink
              link={{
                label: 'Manu Arora',
                href: '/profile',
                icon: (
                  <img
                    src="https://assets.aceternity.com/manu.png"
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      <Outlet />
    </div>
  );
}
export const Logo = () => {
  return (
    <div className="flex gap-3 justify-between mt-12 md:m-0">
      <Link
        to="/"
        className="font-normal flex space-x-2 items-center text-sm text-gray-950 py-1 relative z-20"
      >
        <div className="flex gap-3">
          <img
            width={30}
            height={30}
            src={ShortwaveLogo}
            alt="Shortwave Logo"
          />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-medium text-teal-600 text-xl dark:text-white whitespace-pre"
          >
            ShortWave
          </motion.span>
        </div>
      </Link>
      <ThemeToggle />
    </div>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      to="/"
      className="font-normal flex space-x-2 items-center text-sm text-gray-950 py-1 relative z-20"
    >
      <img width={30} height={30} src={ShortwaveLogo} alt="Shortwave Logo" />
    </Link>
  );
};

export default DashboardLayout;
