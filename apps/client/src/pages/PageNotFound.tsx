import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PageNotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen min-w-screen bg-slate-50 dark:bg-slate-950 px-6">
      <div className="text-center space-y-4">
        <h1 className="text-8xl md:text-9xl font-extrabold tracking-tighter bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
          404
        </h1>
        <p className="text-xl md:text-2xl font-semibold text-slate-800 dark:text-slate-200 tracking-tight">
          Page not found
        </p>
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="pt-4">
          <Button asChild variant="outline" className="rounded-lg border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
