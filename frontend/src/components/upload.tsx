import { Button, message, Upload, Image } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { RcFile } from "antd/es/upload";

type CustomUploadProps = {
  defaultSrc?: string;
  imageFile?: RcFile | undefined;
  setImageFile?: (file: RcFile) => void;
  alt: string;
  htmlFor?: string;
  imageClassName?: string;
  imageCategoryName?: string;
  uploadClassName?: string;
  labelButton?: string;
  disabled?: boolean;
  buttonHidden?: boolean;
};

const CustomUpload: React.FC<CustomUploadProps> = ({
  defaultSrc,
  imageFile,
  setImageFile,
  alt,
  htmlFor,
  imageClassName,
  imageCategoryName,
  uploadClassName,
  labelButton = "Tải hình ảnh",
  disabled = false,
  buttonHidden = false,
}) => {
  const beforeUpload = async (file: RcFile) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Chỉ được upload ảnh!");
      return false;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Ảnh phải nhỏ hơn 2MB!");
      return false;
    }

    setImageFile!(file); // Gọi hàm truyền từ component cha
    return false; // Không upload lên server
  };

  return (
    <>
      <Image
        src={
          imageFile
            ? URL.createObjectURL(imageFile) // file upload mới
            : defaultSrc && defaultSrc.startsWith("http")
            ? defaultSrc // avatar cũ full URL
            : defaultSrc
            ? `/src/assets/images/${imageCategoryName}/${defaultSrc}` // tên file local
            : "/src/assets/images/others/no-image.png" // placeholder
        }
        alt={alt}
        className={imageClassName}
      />

      <Upload
        accept="image/*"
        showUploadList={false}
        beforeUpload={beforeUpload}
        id={htmlFor}
        className={uploadClassName} 
      >
        <Button
          icon={<UploadOutlined />}
          id="image-button"
          disabled={disabled}
          style={{ display: buttonHidden ? "none" : "block" }}
        >
          {labelButton}
        </Button>
      </Upload>
    </>
  );
};

export default CustomUpload;
