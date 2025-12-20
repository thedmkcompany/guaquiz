import Image from 'next/image';
import { getCDNUrl } from '@/lib/cdn';

/**
 * Partner/Brand logos displayed in the mobile logo loop
 * These are corporate clients/partners where Disha has conducted sessions
 */
const logos = [
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
 * Mobile-only LogoLoop component - CSS-only animation (no JS layout measurements)
 * Uses pure CSS animation for smooth, performant scrolling without forced reflows
 */
export function MobileLogoLoop({ className = '' }: MobileLogoLoopProps) {
  return (
    <div className={`md:hidden overflow-hidden py-2 bg-white/60 backdrop-blur-sm border-b border-white/30 ${className}`}>
      <p className="text-[10px] text-center text-forest/50 uppercase tracking-widest mb-1.5 font-medium">
        Trusted by leading brands
      </p>
      <div
        className="flex w-max animate-scroll-left"
        role="region"
        aria-label="Trusted corporate partners and brands"
      >
        {/* First set of logos */}
        {logos.map((logo, i) => (
          <div
            key={`logo-1-${i}`}
            className="flex-shrink-0 mx-4 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
          >
            <Image
              src={getCDNUrl(logo.src)}
              alt={logo.alt}
              width={80}
              height={24}
              className="h-6 w-auto object-contain"
              loading="lazy"
            />
          </div>
        ))}
        {/* Duplicate set for seamless loop */}
        {logos.map((logo, i) => (
          <div
            key={`logo-2-${i}`}
            className="flex-shrink-0 mx-4 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            aria-hidden="true"
          >
            <Image
              src={getCDNUrl(logo.src)}
              alt=""
              width={80}
              height={24}
              className="h-6 w-auto object-contain"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MobileLogoLoop;
