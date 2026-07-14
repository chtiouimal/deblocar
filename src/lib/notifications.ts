import { notifications } from "@mantine/notifications";

type NotifyProps = {
  title?: string;
  message: string;
};

export const notify = {
  success: ({ title = "Succès", message }: NotifyProps) =>
    notifications.show({
      color: "green",
      title,
      message,
      withCloseButton: false,
    }),

  error: ({ title = "Erreur", message }: NotifyProps) =>
    notifications.show({
      color: "red",
      title,
      message,
      withCloseButton: false,
    }),

  warning: ({ title = "Attention", message }: NotifyProps) =>
    notifications.show({
      color: "yellow",
      title,
      message,
      withCloseButton: false,
    }),

  info: ({ title = "Information", message }: NotifyProps) =>
    notifications.show({
      color: "blue",
      title,
      message,
      withCloseButton: false,
    }),
};
