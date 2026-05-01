import { LogoIconProps } from "@/types/logo";

export default function GlowingLogo({
  size = 120,
  color = "#302D2D",
  active = false,
  style,
  className,
  path,
  activePath
}: LogoIconProps) {
  const filterId = "logoGlow";

  return (
    <svg
      width={size}
      height={size}
      viewBox={active ? "0 0 240 240" : "0 0 120 120"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      className={className}
    >
      {active && (
        <defs>
          <filter
            id={filterId}
            x="0"
            y="0"
            width="240"
            height="240"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="30" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.862745 0 0 0 0 0.121569 0 0 0 0 0.14902 0 0 0 0.4 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow"
              result="shape"
            />
          </filter>
        </defs>
      )}
      <g filter={active ? `url(#${filterId})` : undefined}>
        <path
          d={active ? activePath : path}
          fill={active ? "#DC1F26" : color}
        />
      </g>
    </svg>
  );
}