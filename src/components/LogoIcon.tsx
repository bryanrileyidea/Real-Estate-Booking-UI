interface LogoIconProps {
  className?: string;
}

const LogoIcon = ({ className = "w-6 h-6" }: LogoIconProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Central circle representing a coin/token */}
      <circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.9" />
      
      {/* Interconnected nodes representing blockchain/network */}
      <circle cx="6" cy="6" r="2" fill="currentColor" opacity="0.6" />
      <circle cx="18" cy="6" r="2" fill="currentColor" opacity="0.6" />
      <circle cx="6" cy="18" r="2" fill="currentColor" opacity="0.6" />
      <circle cx="18" cy="18" r="2" fill="currentColor" opacity="0.6" />
      
      {/* Connecting lines representing network connections */}
      <line
        x1="12"
        y1="8"
        x2="6"
        y2="6"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.4"
        strokeLinecap="round"
      />
      <line
        x1="16"
        y1="12"
        x2="18"
        y2="6"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.4"
        strokeLinecap="round"
      />
      <line
        x1="8"
        y1="12"
        x2="6"
        y2="18"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.4"
        strokeLinecap="round"
      />
      <line
        x1="12"
        y1="16"
        x2="18"
        y2="18"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.4"
        strokeLinecap="round"
      />
      
      {/* Additional connection lines for network effect */}
      <line
        x1="7.5"
        y1="7.5"
        x2="9"
        y2="9"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.3"
        strokeLinecap="round"
      />
      <line
        x1="16.5"
        y1="7.5"
        x2="15"
        y2="9"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.3"
        strokeLinecap="round"
      />
      <line
        x1="7.5"
        y1="16.5"
        x2="9"
        y2="15"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.3"
        strokeLinecap="round"
      />
      <line
        x1="16.5"
        y1="16.5"
        x2="15"
        y2="15"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.3"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default LogoIcon;
