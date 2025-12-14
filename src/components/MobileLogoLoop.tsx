'use client';

import { LogoLoop, type LogoItem } from './LogoLoop';

/**
 * Partner/Brand logos displayed in the mobile logo loop
 * These are corporate clients/partners where Disha has conducted sessions
 */
const logoItems: LogoItem[] = [
  { src: '/brand-logos/Bosch-Logo.png', alt: 'Bosch' },
  { src: '/brand-logos/RedBull logo.png', alt: 'Red Bull' },
  { src: '/brand-logos/Airtel-Logo-2010-present.jpg', alt: 'Airtel' },
  { src: '/brand-logos/Vodafone_Logo.png', alt: 'Vodafone' },
  { src: '/brand-logos/Tech_Mahindra_New_Logo.svg.png', alt: 'Tech Mahindra' },
  { src: '/brand-logos/ISB _ 20 Final Logo_Blue Clr Logo.png', alt: 'ISB' },
  { src: '/brand-logos/NIFT_official_logo.png', alt: 'NIFT' },
  { src: '/brand-logos/GMR_Group_(logo).svg.png', alt: 'GMR Group' },
  { src: '/brand-logos/Fourth_Partner_Energy_logo.png', alt: 'Fourth Partner Energy' },
  { src: '/brand-logos/Pine_Labs_Logo.jpg', alt: 'Pine Labs' },
  { src: '/brand-logos/Advintek_Logo_PNG_.png', alt: 'Advintek' },
  { src: '/brand-logos/icai logo_egal_download.jpg', alt: 'ICAI' },
];

interface MobileLogoLoopProps {
  className?: string;
}

/**
 * Mobile-only LogoLoop component that displays above the fold
 * Shows partner logos on mobile devices (hidden on md+ screens)
 */
export function MobileLogoLoop({ className = '' }: MobileLogoLoopProps) {
  return (
    <div className={`md:hidden overflow-hidden py-2 bg-white/60 backdrop-blur-sm border-b border-white/30 ${className}`}>
      <p className="text-[10px] text-center text-forest/50 uppercase tracking-widest mb-1.5 font-medium">
        Trusted by leading brands
      </p>
      <div className="[&_img]:grayscale [&_img]:opacity-60 hover:[&_img]:grayscale-0 hover:[&_img]:opacity-100 [&_img]:transition-all [&_img]:duration-300">
        <LogoLoop
          logos={logoItems}
          speed={40}
          direction="left"
          logoHeight={24}
          gap={32}
          pauseOnHover
          ariaLabel="Trusted corporate partners and brands"
        />
      </div>
    </div>
  );
}

export default MobileLogoLoop;
