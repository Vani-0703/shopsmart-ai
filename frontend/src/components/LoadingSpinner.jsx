const LoadingSpinner = ({ fullScreen, size = "md" }) => {
  const sizes = { sm: "w-5 h-5", md: "w-10 h-10", lg: "w-16 h-16" };
  const spinner = (
    <div className={`${sizes[size]} rounded-full border-4 border-brand-200 dark:border-brand-900 border-t-brand-600 animate-spin`} />
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-light dark:bg-surface-dark">
        {spinner}
      </div>
    );
  }
  return <div className="flex items-center justify-center py-10">{spinner}</div>;
};

export default LoadingSpinner;
