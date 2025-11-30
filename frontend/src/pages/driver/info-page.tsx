import { useEffect, useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Menu,
  Row,
  Col,
  DatePicker,
  Select,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import CustomUpload from "../../components/upload";
import type { RcFile } from "antd/es/upload";
import { ruleEmail, rulePhone, ruleRequired } from "../../common/rules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import {
  getInfo,
  updateDriver,
  uploadDriverAvatar,
} from "../../services/driver-service";
import { useNotification } from "../../utils/showNotification";
import { updatePassword } from "../../services/account-service";
import useCallApi from "../../api/useCall";
import type { DriverFormatType } from "../../common/types";
import dayjs from "dayjs";

// Info Page
const DriverInfoPage = () => {
  const { openNotification } = useNotification();
  const { execute, notify } = useCallApi();

  //
  const [selectedMenu, setSelectedMenu] = useState<"personal" | "account">(
    "personal"
  );
  const handleMenuClick = (e: any) => {
    setSelectedMenu(e.key);
  };

  // Truy vấn thông tin tài xế (cá nhân và tài khoản)
  const [driverInfo, setDriverInfo] = useState<DriverFormatType>();
  const getDriverInfo = async () => {
    const response = await execute(getInfo(), false);
    const data = response?.data;
    setDriverInfo(data);
  };
  useEffect(() => {
    getDriverInfo();
  }, []);

  const PersonalInfo = () => {
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [imageFile, setImageFile] = useState<RcFile>();
    useEffect(() => {
      form.setFieldsValue({ avatar: imageFile?.name });
    }, [imageFile]);

    const handleUpdate = async () => {
      if (!driverInfo?.id) return;

      const updateData = {
        full_name: form.getFieldValue("full_name"),
        birth_date: form.getFieldValue("birthday").format("DD/MM/YYYY"),
        gender: form.getFieldValue("gender"),
        phone: form.getFieldValue("phone"),
        email: form.getFieldValue("email"),
        address: form.getFieldValue("address"),
      };

      try {
        // Cập nhật thông tin tài xế
        const response = await updateDriver(driverInfo.id, updateData);
        if (response.statusCode === 200) {
          openNotification({
            type: "success",
            message: "Thành công",
            description: "Cập nhật thông tin tài xế thành công!",
            duration: 2,
          });

          // Upload avatar nếu có
          if (imageFile) {
            const formData = new FormData();
            formData.append("avatar", imageFile);
            const uploadResponse = await execute(
              uploadDriverAvatar(driverInfo.id, formData),
              false
            );
            notify(uploadResponse!, "Cập nhật ảnh đại diện thành công!");
          }

          // Load lại thông tin và tắt chế độ edit
          getDriverInfo();
          setIsEditing(false);
        }
      } catch (error) {
        console.log("Lỗi cập nhật thông tin tài xế:", error);
      }
    };

    return (
      <div className="driver-content client">
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            full_name: driverInfo?.full_name || undefined,
            birthday: driverInfo?.birth_date
              ? dayjs(driverInfo?.birth_date, "DD/MM/YYYY")
              : undefined,
            gender: driverInfo?.gender || undefined,
            phone: driverInfo?.phone || undefined,
            email: driverInfo?.email || undefined,
            address: driverInfo?.address || undefined,
          }}
          autoComplete="off"
          onFinish={handleUpdate}
        >
          <Row className="split-2">
            <Col>
              <Form.Item
                name="avatar"
                label="Ảnh đại diện"
                valuePropName="fileList"
              >
                <CustomUpload
                  defaultSrc={
                    driverInfo?.avatar ? driverInfo.avatar : undefined
                  }
                  imageFile={imageFile}
                  setImageFile={setImageFile}
                  alt="image-preview"
                  imageClassName="image-preview"
                  imageCategoryName="Drivers"
                  uploadClassName="image-uploader"
                  labelButton="Tải ảnh lên"
                  disabled={!isEditing} // khóa/mở khi chỉnh sửa
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                name="full_name"
                label="Họ và tên"
                rules={
                  isEditing
                    ? [ruleRequired("Họ và tên không được để trống !")]
                    : []
                }
              >
                <Input placeholder="Nhập Họ và tên" disabled={!isEditing} />
              </Form.Item>
              <Row className="split-2">
                <Col>
                  <Form.Item
                    name="birthday"
                    label="Ngày sinh"
                    rules={
                      isEditing ? [ruleRequired("Cần chọn Ngày sinh !")] : []
                    }
                  >
                    <DatePicker
                      allowClear
                      format="DD/MM/YYYY"
                      disabled={!isEditing}
                    />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item
                    name="gender"
                    label="Giới tính"
                    rules={
                      isEditing ? [ruleRequired("Cần chọn Giới tính !")] : []
                    }
                  >
                    <Select
                      allowClear
                      disabled={!isEditing}
                      options={[
                        { label: "Nam", value: "MALE" },
                        { label: "Nữ", value: "FEMALE" },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row className="split-2">
                <Col>
                  <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={
                      isEditing
                        ? [
                            ruleRequired("Số điện thoại không được để trống !"),
                            rulePhone(),
                          ]
                        : []
                    }
                  >
                    <Input
                      placeholder="Nhập Số điện thoại"
                      disabled={!isEditing}
                    />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={isEditing ? [ruleEmail()] : []}
                  >
                    <Input placeholder="Nhập Email" disabled={!isEditing} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="address" label="Địa chỉ">
                <Input placeholder="Nhập Địa chỉ" disabled={!isEditing} />
              </Form.Item>
            </Col>
          </Row>
          <div className="buttons">
            {!isEditing ? (
              <Button
                type="primary"
                htmlType="button"
                className="only"
                onClick={(e) => {
                  e.preventDefault();
                  setIsEditing(true);
                }}
              >
                Cập nhật thông tin cá nhân
              </Button>
            ) : (
              <>
                <Button type="primary" htmlType="submit">
                  Lưu thay đổi
                </Button>
                <Button
                  htmlType="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsEditing(false);
                  }}
                >
                  Hủy
                </Button>
              </>
            )}
          </div>
        </Form>
      </div>
    );
  };
  const AccountInfo = () => {
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const handleUpdate = async (values: any) => {
      if (values.newPassword.trim() !== values.newPassword2.trim()) {
        openNotification({
          type: "warning",
          message: "Cảnh báo",
          description: "Mật khẩu mới không khớp!",
          duration: 2,
        });
        return;
      }

      try {
        const response = await updatePassword(
          driverInfo?.account_id!,
          values.newPassword
        );
        if (response.statusCode === 400) {
          openNotification({
            type: "error",
            message: "Lỗi",
            description: response.errorMessage || "Cập nhật mật khẩu thất bại!",
            duration: 2,
          });
        } else if (response.statusCode === 200) {
          setIsEditing(false);
          getDriverInfo();
          openNotification({
            type: "success",
            message: "Thành công",
            description: "Cập nhật mật khẩu thành công!",
            duration: 2,
          });
        }
      } catch (error) {
        console.log("Lỗi cập nhật mật khẩu:", error);
      }
    };

    return (
      <div className="driver-content client-account">
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            username: driverInfo?.username,
            password: "Mật khẩu đã được mã hoá !",
          }}
          autoComplete="off"
          onFinish={handleUpdate}
        >
          <Row className="split-2">
            <Col>
              <Form.Item
                name="username"
                label="Tên tài khoản"
                className={!isEditing ? "multiple-2" : ""}
              >
                <Input disabled={true} />
              </Form.Item>
              <Form.Item
                name="password"
                label="Mật khẩu"
                className={!isEditing ? "multiple-2" : ""}
              >
                <Input disabled={true} />
              </Form.Item>
            </Col>
            <Col>
              {isEditing && (
                <Form.Item
                  name="newPassword"
                  label="Mật khẩu mới"
                  rules={
                    isEditing
                      ? [ruleRequired("Mật khẩu mới không được để trống !")]
                      : []
                  }
                >
                  <Input placeholder="Nhập Mật khẩu mới" />
                </Form.Item>
              )}
              {isEditing && (
                <Form.Item
                  name="newPassword2"
                  label="Mật khẩu mới lần 2"
                  rules={
                    isEditing
                      ? [
                          ruleRequired(
                            "Mật khẩu mới lần 2 không được để trống !"
                          ),
                        ]
                      : []
                  }
                >
                  <Input placeholder="Nhập Mật khẩu mới lần 2" />
                </Form.Item>
              )}
            </Col>
          </Row>
          <div className="buttons">
            {!isEditing ? (
              <Button
                type="primary"
                htmlType="button"
                className="only"
                onClick={(e) => {
                  e.preventDefault();
                  setIsEditing(true);
                }}
              >
                Thay đổi mật khẩu
              </Button>
            ) : (
              <>
                <Button type="primary" htmlType="submit">
                  Lưu thay đổi
                </Button>
                <Button
                  htmlType="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsEditing(false);
                  }}
                >
                  Hủy
                </Button>
              </>
            )}
          </div>
        </Form>
      </div>
    );
  };

  return (
    <div className="client-layout__main Driver">
      <h2 className="client-layout__title">
        <span>
          <FontAwesomeIcon icon={faUser} />
          <strong>Thông tin</strong>
        </span>
      </h2>
      <Row className="client-layout__info">
        <Col className="client-layout__info-menu">
          <Menu
            mode="inline"
            selectedKeys={[selectedMenu]}
            onClick={handleMenuClick}
            items={[
              {
                key: "personal",
                icon: <UserOutlined />,
                label: "Thông tin cá nhân",
              },
              {
                key: "account",
                icon: <LockOutlined />,
                label: "Thông tin tài khoản",
              },
            ]}
            className="actions"
          />
        </Col>
        <Col className="client-layout__info-card">
          <Card
            className="profile-content"
            title={
              selectedMenu === "personal"
                ? "Thông tin cá nhân"
                : "Thông tin tài khoản"
            }
          >
            {selectedMenu === "personal" ? <PersonalInfo /> : <AccountInfo />}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DriverInfoPage;
