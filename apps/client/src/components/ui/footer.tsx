import { ArrowUp } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

interface linkType {
  to: string;
  text: string;
}
const Footer: React.FC = () => {
  const FooterLink: linkType[] = [
    {
      to: '/dashboard',
      text: 'Dashboard',
    },
    {
      to: '#',
      text: 'Services',
    },
    {
      to: '#',
      text: 'About',
    },
  ];

  return (
    <section>
      <footer className="dark:bg-slate-800">
        <div className="relative mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 lg:pt-24">
          <div className="absolute end-4 top-4 sm:end-6 sm:top-6 lg:end-8 lg:top-8">
            <a
              className="inline-block rounded-full bg-teal-600 p-2 text-white shadow transition hover:bg-teal-500 sm:p-3 lg:p-4 dark:bg-gray-950 dark:text-teal-300 dark:hover:bg-gray-600"
              href="#MainContent"
            >
              <span className="sr-only">Back to top</span>
              <ArrowUp />
            </a>
          </div>

          <div className="lg:flex lg:items-end lg:justify-between">
            <div>
              <div className="flex justify-center text-teal-600 lg:justify-start dark:text-teal-300">
                <h1 className="text-5xl font-extrabold min-w-fit">ShortWave</h1>
              </div>

              <p className="mx-auto mt-6 max-w-md text-center leading-relaxed text-gray-500 lg:text-left dark:text-gray-400">
                Effortlessly shorten URLs and gain insights with advanced
                analytics. Simple, fast, and powerful URL management.
              </p>
            </div>

            <ul className="mt-12 flex flex-wrap justify-center gap-6 md:gap-8 lg:mt-0 lg:justify-end lg:gap-12">
              {FooterLink.map((linkinfo: linkType, idx: number) => (
                <li key={idx}>
                  <Link
                    className="text-gray-700 transition hover:text-gray-700/75 dark:text-white dark:hover:text-white/75"
                    to={linkinfo.to}
                  >
                    {linkinfo.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-12 text-center text-sm text-gray-500 lg:text-right dark:text-gray-400">
            Copyright &copy;{new Date().getFullYear()}. All rights reserved.
          </p>
        </div>
      </footer>
    </section>
  );
};

export default Footer;
