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
          defaultSrc && !imageFile
            ? "/src/assets/images/" + imageCategoryName + "/" + defaultSrc
            : imageFile
            ? URL.createObjectURL(imageFile)
            : "/src/assets/images/others/no-image.png"
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
        <Button icon={<UploadOutlined />} id="image-button" disabled={disabled}>
          {labelButton}
        </Button>
      </Upload>
    </>
  );
};

export default CustomUpload;