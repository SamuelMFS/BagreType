import { useMemo } from "react";

const OceanFloor = () => {
  // Theme-aware color correction
  const imageFilter = useMemo(() => {
    const isDark = document.documentElement.classList.contains('deep');
    
    if (isDark) {
      // Dark theme: darker image with blue tint
      return 'brightness(0.35) contrast(1.4) hue-rotate(60deg) saturate(0.4)';
    } else {
      // Light theme: lighter image with subtle blue tint
      return 'brightness(0.95) contrast(1.1) hue-rotate(15deg) saturate(1)';
    }
  }, []);

  return (
    <div 
      className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none" 
      style={{ zIndex: 2 }}
    >
      {/* Ocean floor image */}
      <div 
        className="absolute bottom-0 w-full h-full"
        style={{
          backgroundImage: 'url("/Sand floor.png")',
          backgroundSize: '100% 100%',
          backgroundPosition: 'bottom',
          backgroundRepeat: 'no-repeat',
          filter: imageFilter,
        }}
      />
    </div>
  );
};

export default OceanFloor;
