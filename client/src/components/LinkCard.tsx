import { Copy, Link2, QrCode } from 'lucide-react';

export interface LinkCardI {
  orginal_link: string;
  short_link: string;
  created_at: string;
}

export default function LinkCard({
  orginal_link,
  short_link,
  created_at,
}: LinkCardI) {
  return (
    <div className="border dark:border-transparent rounded-lg mb-2 px-4 py-5 bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center space-x-4">
            <div>
              <div className="flex items-center gap-1 text-sm font-medium leading-none my-1">
                {orginal_link}
                <button className="border rounded-md p-1">
                  <Copy className="w-3 h-3" />
                </button>
                <button className="border rounded-md p-1">
                  <QrCode className="w-3 h-3" />
                </button>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <div className="border rounded-md p-1">
                  <Link2 className="w-3 h-3" />
                </div>
                {short_link}
              </div>
            </div>
          </div>
          <div className="mb-auto text-end text-[0.8rem] text-muted-foreground">
            {created_at}
          </div>
        </div>
      </div>
    </div>
  );
}
