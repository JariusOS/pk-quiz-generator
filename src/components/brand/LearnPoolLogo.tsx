
interface LogoProps {
  className?: string;
}

export default function LearnPoolLogo({ className }: LogoProps) {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <rect x="2" y="2" width="20" height="20" rx="4" className="fill-primary" />
        <path d="M7 7.5L7 16.5M12 7.5V16.5M17 7.5L17 12.5L12 12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-primary-foreground" />
      </svg>
    </div>
  );
}
