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
  const [viewport, setViewport] = useState<ViewportInfo>(() => {
    const width = typeof window !== "undefined" ? window.innerWidth : 0;
    const height = typeof window !== "undefined" ? window.innerHeight : 0;
    const device = getDevice(width);

    return {
      width,
      height,
      device,
      isMobile: device === "mobile",
      isTablet: device === "tablet",
      isDesktop: device === "desktop",
    };
  });

  useEffect(() => {
    const handleResize = () => {
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

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return viewport;
};
