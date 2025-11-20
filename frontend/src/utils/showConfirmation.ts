import { App } from "antd";

export const useConfirmation = () => {
  const { modal } = App.useApp();

  const openConfirmation = ({
    title,
    content,
    okText = "Đồng ý",
    cancelText = "Từ chối",
    icon,
  }: {
    title: string;
    content?: React.ReactNode;
    okText?: string;
    cancelText?: string;
    icon?: React.ReactNode;
  }): Promise<boolean> => {
    return new Promise((resolve) => {
      modal.confirm({
        title,
        content,
        icon,
        okText,
        cancelText,
        onOk: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });
  };

  return { openConfirmation };
};
