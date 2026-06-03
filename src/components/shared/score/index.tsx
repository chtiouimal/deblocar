import { Badge } from "@mantine/core";
import { CircleIcon, FireIcon, SnowflakeIcon } from "@phosphor-icons/react";

interface CustomScoreProps {
  value: "Chaud" | "Tiède" | "Froid";
}

const scoreConfig = {
  Chaud: {
    icon: <FireIcon size={20} weight="duotone" color="orange" />,
  },
  Tiède: {
    icon: <CircleIcon size={20} weight="duotone" color="yellow" />,
  },
  Froid: {
    icon: <SnowflakeIcon size={20} weight="duotone" color="skyblue" />,
  },
} as const;

function CustomScore({ value }: CustomScoreProps) {
  const config = scoreConfig[value];

  return (
    <Badge leftSection={config.icon} bg="transparent">
      {value}
    </Badge>
  );
}

export default CustomScore;
