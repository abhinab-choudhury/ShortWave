import { cn } from '@/lib/utils';

export default function DashboardQuickInfoCard({
  title,
  data,
  icon,
  footer,
  className,
  icon_styles,
}: {
  title: string;
  data: string;
  icon: React.ReactNode;
  footer: string;
  className: string;
  icon_styles: string;
}) {
  return (
    <>
      <div
        className={cn(
          className,
          'p-5 rounded-2xl shadow-md border transition hover:shadow-lg hover:-translate-y-1 duration-200'
        )}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-teal-800 dark:text-teal-300">
              {title}
            </p>
            <h2 className="text-3xl font-bold text-teal-900 dark:text-white mt-1">
              {data}
            </h2>
          </div>
          <div className={cn(icon_styles, 'p-3 rounded-full')}>{icon}</div>
        </div>
        <p className="mt-3 text-xs text-teal-700/70 dark:text-slate-400">
          {footer}
        </p>
      </div>
    </>
  );
}
