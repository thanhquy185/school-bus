import { useState } from "react";
import type { RestResponse } from "./api";
import { useNotification } from "../utils/showNotification";
import { useConfirmation } from "../utils/showConfirmation";

const useCallApi = () => {
  const { openNotification } = useNotification();
  const { openConfirmation } = useConfirmation();
  
  const [loading, setLoading] = useState<boolean>(false);

  const execute = async (apiCall: Promise<RestResponse>, handleCRUD: boolean) => {
    if(handleCRUD) {
        const answer = await openConfirmation({
          title: "Bạn chắc chắn thực hiện hành động này ?",
          content: "Hành động này không thể hoàn tác !",
        });
        if (!answer) return;
        setLoading(true)
    }
    
    try {
      const restResponse = await apiCall;
      const statusCode = restResponse?.statusCode || 500;
      if (statusCode === 401) {
        openNotification({
          type: "error",
          message: "Lỗi xác thực",
          description:
            "Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại.",
        });
      }
      if (statusCode === 403) {
        openNotification({
          type: "error",
          message: "Lỗi phân quyền",
          description: "Bạn không có quyền thực hiện hành động này.",
        });
      }
      return restResponse;
    } catch (error: any) {
      console.error("API call error:", error.message);
      openNotification({
        type: "error",
        message: "Lỗi hệ thống",
        description: "Máy chủ không phản hồi.",
      });
      return {
        result: false,
        statusCode: 500,
        data: null,
        message: "",
        errorMessage: ["Máy chủ không phản hồi"],
      } as RestResponse;
    } finally {
      setLoading(false);
    }
  };

  const notify = (restResponse: RestResponse, successMessage?: string) => {
    if (!restResponse) return;
    const isSuccess =
      restResponse.result &&
      (restResponse.statusCode == 200 || restResponse.statusCode == 201);
    if (isSuccess) {
      if (successMessage) {
        openNotification({
          type: "success",
          message: "Thành công",
          description: successMessage,
        });
      }
    } else {
      const apiErrorMessage = restResponse.errorMessage;
      if (apiErrorMessage) {
        if (Array.isArray(apiErrorMessage)) {
          apiErrorMessage.forEach((error: string) => {
            openNotification({
              type: "warning",
              message: "Lưu ý",
              description: error,
            });
          });
        } else {
          openNotification({
            type: "warning",
            message: "Lưu ý",
            description: apiErrorMessage,
          });
        }
      }
    }
  };

  return { execute, notify, loading };
};

export default useCallApi;
