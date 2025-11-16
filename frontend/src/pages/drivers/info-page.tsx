import { useEffect, useState } from "react";
import { Card, Form, Input, Button, Menu, Row, Col } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import CustomUpload from "../../components/upload";
import type { RcFile } from "antd/es/upload";
import { ruleRequired } from "../../common/rules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

// Info Page
const DriverInfoPage = () => {
  //
  const [selectedMenu, setSelectedMenu] = useState<"personal" | "account">(
    "personal"
  );
  const handleMenuClick = (e: any) => {
    setSelectedMenu(e.key);
  };
  //
  const PersonalInfo = () => {
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [imageFile, setImageFile] = useState<RcFile>();

    useEffect(() => {
      form.setFieldValue("avatar", imageFile?.name);
    }, [imageFile]);

    const handleUpdate = (values: any) => {
      console.log("Submitted values:", values);
      setIsEditing(false); // sau khi submit xong quay lại trạng thái disable
    };

    return (
      <div className="parent-content client">
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            fullname: "123",
          }}
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
                  imageFile={imageFile}
                  setImageFile={setImageFile}
                  alt="image-preview"
                  imageClassName="image-preview"
                  imageCategoryName="parents"
                  uploadClassName="image-uploader"
                  labelButton="Tải ảnh lên"
                  disabled={!isEditing} // khóa/mở khi chỉnh sửa
                />
              </Form.Item>
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
                    ? [ruleRequired("Số điện thoại không được để trống !")]
                    : []
                }
              >
                <Input placeholder="Nhập Số điện thoại" disabled={!isEditing} />
              </Form.Item>
              <Form.Item name="email" label="Email">
                <Input placeholder="Nhập Email" disabled={!isEditing} />
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
                    form.resetFields();
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

    const handleUpdate = (values: any) => {
      console.log("Submitted values:", values);
      setIsEditing(false);
    };

    return (
      <div className="parent-content client-account">
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            username: "123",
            password: "Mật khẩu đã được mã hoá !",
          }}
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
                    form.resetFields();
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
