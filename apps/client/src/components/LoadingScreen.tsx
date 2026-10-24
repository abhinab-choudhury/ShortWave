import ShortwaveLogo from "/shortwave_logo.png";

export const LoadingScreen = () => {
  return (
    <div
      className="flex min-h-dvh items-center justify-center bg-background px-6"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative">
          <div className="absolute inset-0 size-14 animate-pulse rounded-full bg-primary/15 blur-xl" />
          <img
            src={ShortwaveLogo}
            alt=""
            width={56}
            height={56}
            className="relative size-14 animate-pulse object-contain"
          />
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          Opening your workspace...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
