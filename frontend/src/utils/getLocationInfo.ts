// Hàm lấy ra thông tin của vị trí (sử dụng Nominatim)
export const getLocationInfo = async (lat: number, lng: number) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
  );

  return await response.json();
};
