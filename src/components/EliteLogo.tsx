import React, { useState } from 'react';
import logoImg from '../assets/logo.png';
import { ShieldCheck } from 'lucide-react';

interface EliteLogoProps {
  className?: string;
  imgClassName?: string;
}

export const EliteLogo: React.FC<EliteLogoProps> = ({
  className = "w-10 h-10",
  imgClassName = "w-full h-full object-cover rounded-full",
}) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative rounded-full border-2 border-[#D4AF37]/60 p-0.5 bg-[#0B0B0F] shadow-[0_0_15px_rgba(212,175,55,0.35)] overflow-hidden shrink-0 flex items-center justify-center ${className}`}>
      {!hasError ? (
        <img
          src={logoImg || "/logo.png"}
          alt="Elite Logs Market Logo"
          className={imgClassName}
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="w-full h-full rounded-full bg-gradient-to-br from-[#12121A] to-[#0A0A0E] flex items-center justify-center text-[#D4AF37]">
          <ShieldCheck className="w-2/3 h-2/3 text-[#FFD700] drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]" />
        </div>
      )}
    </div>
  );
};
