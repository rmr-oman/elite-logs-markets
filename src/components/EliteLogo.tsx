import React, { useState } from 'react';
import logoImg from '../assets/logo.png';

interface EliteLogoProps {
  className?: string;
  imgClassName?: string;
}

export const EliteLogo: React.FC<EliteLogoProps> = ({
  className = "w-10 h-10",
  imgClassName = "w-full h-full object-cover rounded-full",
}) => {
  const [imgSrc, setImgSrc] = useState<string>(logoImg || "/logo.png");

  const handleError = () => {
    if (imgSrc !== "/logo.png") {
      setImgSrc("/logo.png");
    } else if (logoImg && imgSrc !== logoImg) {
      setImgSrc(logoImg);
    }
  };

  return (
    <div className={`relative rounded-full border-2 border-[#D4AF37]/60 p-0.5 bg-[#0B0B0F] shadow-[0_0_15px_rgba(212,175,55,0.35)] overflow-hidden shrink-0 flex items-center justify-center ${className}`}>
      <img
        src={imgSrc}
        alt="Elite Logs Market Logo"
        className={imgClassName}
        onError={handleError}
      />
    </div>
  );
};

