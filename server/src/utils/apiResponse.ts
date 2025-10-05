export const apiResponse = (
  res: any,
  statusCode: number,
  message: string,
  data: any = null
) => {
  return res.status(statusCode).json({
    statusCode,
    success: statusCode < 400,
    message,
    data,
  });
};
