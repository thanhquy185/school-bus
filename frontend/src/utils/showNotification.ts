// Theo chuẩn Antd v5
import { App } from "antd";

export const useNotification = () => {
  const { notification } = App.useApp();

  const openNotification = ({
    type,
    message,
    description,
    duration = 1,
    placement = "topRight",
    className = "notification",
  }: {
    type: "success" | "info" | "warning" | "error";
    message?: string;
    description?: string;
    duration?: number;
    placement?: "topLeft" | "topRight" | "top" | "bottom" | "bottomLeft" | "bottomRight";
    className?: string;
  }) => {
    notification[type]({
      message,
      description,
      duration,
      placement,
      className,
    });
  };

  return { openNotification };
};
