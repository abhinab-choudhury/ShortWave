import LinkCard from '@/components/LinkCard';
import { useEffect, useState } from 'react';
import isEqual from 'lodash/isEqual';
import { ListFilter, SlidersHorizontal } from 'lucide-react';

export interface DashboardLinkData {
  image: string;
  short_link: string;
  orginal_link: string;
  created_at: string;
}
export async function getLink(): Promise<DashboardLinkData[]> {
  return [
    {
      image: 'https://assets.aceternity.com/manu.png',
      short_link: 'dub.sh/abhinab-choudhury',
      orginal_link: 'github.com/abhinab-choudhury',
      created_at: 'Dec 12, 2024',
    },
    {
      image: 'https://assets.aceternity.com/manu.png',
      short_link: 'dub.sh/shortwave-github',
      orginal_link: 'github.com/abhinab-choudhury/ShortWave',
      created_at: 'Dec 3, 2024',
    },
    {
      image: 'https://assets.aceternity.com/manu.png',
      short_link: 'dub.sh/shortwave-github',
      orginal_link: 'github.com/abhinab-choudhury/ShortWave',
      created_at: 'Dec 3, 2024',
    },
    {
      image: 'https://assets.aceternity.com/manu.png',
      short_link: 'dub.sh/shortwave-github',
      orginal_link: 'github.com/abhinab-choudhury/ShortWave',
      created_at: 'Dec 3, 2024',
    },
    {
      image: 'https://assets.aceternity.com/manu.png',
      short_link: 'dub.sh/shortwave-github',
      orginal_link: 'github.com/abhinab-choudhury/ShortWave',
      created_at: 'Dec 3, 2024',
    },
    {
      image: 'https://assets.aceternity.com/manu.png',
      short_link: 'dub.sh/shortwave-github',
      orginal_link: 'github.com/abhinab-choudhury/ShortWave',
      created_at: 'Dec 3, 2024',
    },
    {
      image: 'https://assets.aceternity.com/manu.png',
      short_link: 'dub.sh/shortwave-github',
      orginal_link: 'github.com/abhinab-choudhury/ShortWave',
      created_at: 'Dec 3, 2024',
    },
    {
      image: 'https://assets.aceternity.com/manu.png',
      short_link: 'dub.sh/shortwave-github',
      orginal_link: 'github.com/abhinab-choudhury/ShortWave',
      created_at: 'Dec 3, 2024',
    },
  ];
}

const DashboardPage = () => {
  const [linkList, setLinkList] = useState<DashboardLinkData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const cachedDate: string | null = localStorage.getItem('dashboardLink');
      try {
        if (cachedDate) {
          const parshedData = JSON.parse(cachedDate);
          if (isEqual(parshedData, linkList)) {
            setLinkList(parshedData);
            setIsLoading(false);

            return;
          }
        }
        const data = await getLink();
        setLinkList(data);
        localStorage.setItem('dashboardLink', JSON.stringify(data));
      } catch (error) {
        console.error('Failed to fetch links:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  });

  return (
    <div className="flex flex-1">
      <div className="p-2 md:p-10 border border-neutral-200 dark:border-gray-800 bg-white dark:bg-inherit flex flex-col gap-2 flex-1 w-full overflow-y-scroll scrollbar-slim">
        <h1 className="text-2xl font-bold">Links</h1>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mx-2 md:mx-4">
          <div className="flex gap-2 w-fit md:w-full my-2">
            <button className="flex justify-between items-center text-sm gap-2 px-2 py-1 border-2 rounded-md w-full md:w-fit">
              Filter
              <ListFilter className="w-5 h-5 md:w-3 md:h-3" />
            </button>
            <button className="flex justify-between items-center text-sm gap-2 px-2 py-1 border-2 rounded-md w-full md:w-fit">
              Display
              <SlidersHorizontal className="w-5 h-5 md:w-3 md:h-3" />
            </button>
          </div>
          <div className="flex gap-2 mr-auto w-fit items-center">
            <input
              className="border rounded-md px-3 py-[0.4rem] text-sm md:text-base w-full md:w-auto min-h-full dark:bg-gray-100 dark:text-black focus:outline-none focus:ring focus:border-gray-300"
              type="text"
              placeholder="Search..."
            />
            <button className="active:scale-95 px-2 py-2 text-sm font-semibold transition border rounded-md w-auto whitespace-nowrap bg-black text-white border-gray-300 hover:bg-gray-800 dark:bg-gray-200 dark:text-black dark:border-gray-700 dark:hover:bg-gray-200">
              Create Link
            </button>
          </div>
        </div>
        <div className="flex gap-2 flex-1">
          {isLoading ? (
            <div className="p-4 h-full w-full rounded-lg  bg-gray-100 animate-pulse">
              <div className="border rounded h-[82px] w-full bg-gray-300animate-pulse"></div>
            </div>
          ) : (
            <div className="h-full w-full rounded-lg bg-gray-100p-2 md:p-4">
              {linkList.length > 0 ? (
                linkList.map((linkData, index) => (
                  <LinkCard
                    key={index}
                    image={linkData.image}
                    orginal_link={linkData.orginal_link}
                    short_link={linkData.short_link}
                    created_at={linkData.created_at}
                  />
                ))
              ) : (
                <div className="flex justify-center align-middle items-center text-gray-500">
                  No links available.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
