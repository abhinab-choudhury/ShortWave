import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <div className="flex flex-col justify-center align-middle items-center min-h-screen min-w-screen">
      <div className="text-6xl md:text-8xl font-bold">404</div>
      <p className="text-xl font-bold lg:text-3xl mt-3">
        Oopsie! Something's missing...
      </p>
      <p className="mb-5 text-sm md:text-base text-center m-4">
        The page you were looking for doesn't exists, isn't available or was
        loading incorrectly
      </p>
      <Button variant={'outline'}>
        <Link to="/">Back To Home</Link>
      </Button>
    </div>
  );
};

export default PageNotFound;
