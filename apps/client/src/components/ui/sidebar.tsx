import { cn } from '@/lib/utils';
import { Link, LinkProps, useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IconMenu2, IconX } from '@tabler/icons-react';
import { useSidebar } from '@/hooks/useSidebar';
import { SidebarProvider } from '@/providers/SidebarProvider';

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<'div'>)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <>
      <motion.div
        className={cn(
          'h-full px-4 py-4 hidden md:flex md:flex-col bg-neutral-100 dark:bg-slate-800 w-75 shrink-0',
          className
        )}
        animate={{
          width: animate ? (open ? '300px' : '70px') : '300px',
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        {...props}
      >
        {children}
      </motion.div>
    </>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) => {
  const { open, setOpen } = useSidebar();
  const location = useLocation();

  // Always close the drawer when the active tab changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname, setOpen]);

  return (
    <>
      <div
        className={cn(
          'h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-neutral-100 dark:bg-slate-800 w-full'
        )}
        {...props}
      >
        <div className="flex justify-end z-20 w-full">
          <IconMenu2
            className="text-neutral-800 dark:text-neutral-200"
            onClick={() => setOpen(true)}
          />
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-90 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: 'easeInOut',
              }}
              className={cn(
                'fixed h-full w-[80%] max-w-[300px] inset-y-0 left-0 bg-white dark:bg-slate-900 p-10 z-100 flex flex-col justify-between shadow-2xl',
                className
              )}
            >
              <div
                className="absolute right-6 top-6 z-50 text-neutral-800 dark:text-slate-200"
                onClick={() => setOpen(false)}
              >
                <IconX />
              </div>
              {children}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
  props?: LinkProps;
}) => {
  const location = useLocation();
  const { setOpen } = useSidebar();

  const isActive =
    location.pathname === link.href ||
    location.pathname.startsWith(link.href + '/');
  return (
    <Link
      to={link.href}
      onClick={() => setOpen(false)}
      className={cn(
        'flex items-center justify-start gap-2 group/sidebar py-2 px-3 rounded-md transition-colors',
        isActive
          ? 'bg-gray-200 dark:bg-teal-800'
          : 'hover:bg-gray-100 dark:hover:bg-slate-700',
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'p-2 rounded-full transition-colors',
          isActive
            ? 'bg-gray-300 dark:bg-teal-600 text-white'
            : 'text-neutral-100 dark:text-slate-300'
        )}
      >
        {link.icon}
      </div>

      <span className="text-neutral-700 dark:text-slate-200 text-sm group-hover/sidebar:translate-x-1 transition-all duration-150 whitespace-pre inline-block p-0! m-0!">
        {link.label}
      </span>
    </Link>
  );
};
