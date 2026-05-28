import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export const LoadingScreen = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen min-w-screen bg-slate-50 dark:bg-slate-950 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="text-center space-y-4 flex flex-col items-center justify-center"
      >
        <div className="relative flex items-center justify-center">
          {/* Elegant glow effect behind the spinner */}
          <div className="absolute w-12 h-12 rounded-full bg-teal-500/20 blur-xl animate-pulse" />
          <Loader2 className="w-10 h-10 animate-spin text-teal-600 dark:text-teal-400 relative z-10" />
        </div>
        <p className="text-sm font-semibold tracking-wide text-slate-500 dark:text-slate-400 animate-pulse">
          Loading...
        </p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
