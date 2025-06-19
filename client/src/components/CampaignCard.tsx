import { Link2 } from 'lucide-react';

export interface CampaignCardI {
  campaign_name: string;
  page_link: string;
  created_at: string;
}

export default function CampaignCard({
  campaign_name,
  page_link,
  created_at,
}: CampaignCardI) {
  return (
    <div className="border border-transparent rounded-xl px-5 py-6 h-auto min-h-[8rem] md:max-w-[560px] w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col justify-between h-full gap-4">
        {/* Campaign Title */}
        <div className="text-lg font-semibold leading-tight tracking-tight text-teal-700 dark:text-teal-300">
          {campaign_name}
        </div>

        {/* Page Link */}
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
          <div className="p-1.5 rounded-md bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600">
            <Link2 className="w-4 h-4 text-gray-600 dark:text-slate-300" />
          </div>
          <span className="truncate">{page_link}</span>
        </div>

        {/* Created At */}
        <div className="text-xs text-right text-muted-foreground mt-auto">
          Created on {created_at}
        </div>
      </div>
    </div>
  );
}
