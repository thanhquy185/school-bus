import { useEffect, useState } from "react";
import { Card, Form, Input, Button, Menu, Row, Col, DatePicker, Select } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import CustomUpload from "../../components/upload";
import type { RcFile } from "antd/es/upload";
import { ruleRequired } from "../../common/rules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../contexts/authContext";
import { getParentByAccount, updateParent, uploadParentAvatar } from "../../services/parent-service";
import { useNotification } from "../../utils/showNotification";
import { updatePassword } from "../../services/account-service";
import useCallApi from "../../api/useCall";
import { getByAccount, updateDriver, uploadDriverAvatar } from "../../services/driver-service";
import dayjs from "dayjs";

// Info Page
const DriverInfoPage = () => {
  const { execute, notify } = useCallApi();
  //
  const [selectedMenu, setSelectedMenu] = useState<"personal" | "account">(
    "personal"
  );
  const handleMenuClick = (e: any) => {
    setSelectedMenu(e.key);
  };

  const PersonalInfo = () => {
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [imageFile, setImageFile] = useState<RcFile>();
    const [driverInfo, setDriverInfo] = useState<any>(null);

    const { openNotification } = useNotification();
    const auth = useAuth();

    useEffect(() => {
      form.setFieldsValue({ avatar: imageFile?.name });
    }, [imageFile]);

    const handleUpdate = async (values: any) => {
      console.log("Submitted values:", values);
      if (!driverInfo.id) return;

      const updateData = {
        fullName: values.fullname,
        phone: values.phone,
        email: values.email,
        address: values.address,
        birthDate: values.birthDate,
        gender: values.gender
      };

      try {
        const response = await updateDriver(driverInfo.id, updateData);
        if (response.statusCode === 200) {
          openNotification({
            type: "success",
            message: "Thành công",
            description: "Cập nhật thông tin tài xế thành công!",
            duration: 2,
          });
        }
      } catch (error) {
        console.log("Lỗi cập nhật thông tin tài xế:", error);
      }

      setIsEditing(false);
      if (!imageFile) return;
      const formData = new FormData();
      formData.append("avatar", imageFile);
      const upalodResponse = await execute(uploadDriverAvatar(driverInfo.id, formData));
      notify(upalodResponse, "Cập nhật ảnh đại diện thành công!");

      
    };

    const fetchDriverInfo = async () => {

      const response = await execute(getByAccount());
      const data = response.data;
      console.log(data)
      setDriverInfo(data);

      form.setFieldsValue({
        avatar: data?.avatar ?? undefined,
        fullname: data?.full_name ?? undefined,
        phone: data?.phone ?? undefined,
        email: data?.email ?? undefined,
        address: data?.address ?? undefined,
        birthDate: data.birth_date ? dayjs(data.birth_date) : undefined,
        gender: data?.gender ?? undefined
      });
    };

    useEffect(() => {
      fetchDriverInfo();
    }, []);

    //console.log(form.getFieldValue("avatar"))

    return (
      <div className="parent-content client">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
        >
          <Row className="split-3">
            <Col>
              <Form.Item
                name="avatar"
                label="Ảnh đại diện"
                valuePropName="fileList"
              >
                <CustomUpload
                  defaultSrc={driverInfo?.avatar ? driverInfo.avatar : undefined}
                  imageFile={imageFile}
                  setImageFile={setImageFile}
                  alt="image-preview"
                  imageClassName="image-preview"
                  imageCategoryName="drivers"
                  uploadClassName="image-uploader"
                  labelButton="Tải ảnh lên"
                  disabled={!isEditing} // khóa/mở khi chỉnh sửa
                />
              </Form.Item>
              <Form.Item></Form.Item>
              <Form.Item></Form.Item>
            </Col>
            <Col>
              <Form.Item
                name="fullname"
                label="Họ và tên"
                rules={
                  isEditing
                    ? [ruleRequired("Họ và tên không được để trống !")]
                    : []
                }
              >
                <Input placeholder="Nhập Họ và tên" disabled={!isEditing} />
              </Form.Item>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={
                  isEditing
                    ?
                    [
                      ruleRequired("Số điện thoại không được để trống !"),
                      {
                        min: 10,
                        message: "Số điện thoại phải có ít nhất 10 ký tự!",
                      },
                      {
                        max: 11,
                        message: "Số điện thoại không được vượt quá 11 ký tự!",
                      },
                      {
                        pattern: /^[0-9]+$/,
                        message: "Số điện thoại không hợp lệ!"
                      }
                    ]
                    : []
                }
              >
                <Input placeholder="Nhập Số điện thoại" disabled={!isEditing} />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={
                  isEditing
                    ?
                    [
                      ruleRequired("Email không được để trống !"),
                      {
                        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Email không hợp lệ!",
                      }
                    ]
                    : []
                }
              >
                <Input placeholder="Nhập Email" disabled={!isEditing} />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="birthDate" label="Ngày sinh" rules={isEditing ? [ruleRequired("Ngày sinh không được để trống!")] : []}>
                <DatePicker
                  allowClear
                  mode="date"
                  id="create-birthday"
                  placeholder="Chọn ngày sinh"
                  disabled={!isEditing}
                />
              </Form.Item>
              <Form.Item name="gender" label="Giới tính" rules={isEditing ? [ruleRequired("Giới tính không được để trống!")] : []}>
                <Select
                  allowClear
                  id="create-gender"
                  placeholder="Chọn giới tính"
                  options={[
                    {
                      label: "Nam",
                      value: "MALE",
                    },
                    {
                      label: "Nữ",
                      value: "FEMALE",
                    },
                  ]}
                  disabled={!isEditing}
                />
              </Form.Item>
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
    const [driverInfo, setDriverInfo] = useState<any>(null);
    const auth = useAuth();
    const { openNotification } = useNotification();

    

    useEffect(() => {
      const fetchDriverInfo = async () => {
        const response = await execute(getByAccount());
        const data = response.data;
        console.log(data)
        setDriverInfo(data);

        form.setFieldsValue({
          username: data.username || "",
          password: "Mật khẩu đã được mã hoá !",
        });
      };
      fetchDriverInfo();
    }, []);

    const handleUpdate = async (values: any) => {
      console.log("Submitted values:", values);

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
        const response = await updatePassword(driverInfo.account_id, values.newPassword);
        if (response.statusCode === 400) {
          openNotification({
            type: "error",
            message: "Lỗi",
            description: response.errorMessage || "Cập nhật mật khẩu thất bại!",
            duration: 2,
          });
        } else if (response.statusCode === 200) {
          openNotification({
            type: "success",
            message: "Thành công",
            description: "Cập nhật mật khẩu thành công!",
            duration: 2,
          });
        }
        form.resetFields();
        form.setFieldsValue({
          username: driverInfo.username || "",
          password: "Mật khẩu đã được mã hoá !",
        });
      } catch (error) {
        console.log("Lỗi cập nhật mật khẩu:", error);
      }

      setIsEditing(false);
    };

    return (
      <div className="parent-content client-account">
        <Form
          form={form}
          layout="vertical"
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
    <div className="client-layout__main parent">
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
