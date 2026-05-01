import { useEffect, useState } from "react";

type DeviceType = "mobile" | "tablet" | "desktop";

type ViewportInfo = {
  width: number;
  height: number;
  device: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
};

const getDevice = (width: number): DeviceType => {
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
};

export const useViewport = (): ViewportInfo => {
  const [viewport, setViewport] = useState<ViewportInfo>({
    width: 0,
    height: 0,
    device: "desktop",
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  });

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const device = getDevice(width);

      setViewport({
        width,
        height,
        device,
        isMobile: device === "mobile",
        isTablet: device === "tablet",
        isDesktop: device === "desktop",
      });
    };

    update(); // run once on mount
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return viewport;
};
