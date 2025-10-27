import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Breadcrumb,
  Card,
  Image,
  Input,
  Button,
  Select,
  Tag,
  Form,
  Col,
  Row,
  Alert,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { RcFile } from "antd/es/upload";
import type { ColumnsType } from "antd/es/table";
import type {
  BreadcrumbItemType,
  BreadcrumbSeparatorType,
} from "antd/es/breadcrumb/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faKey,
  faLock,
  faLockOpen,
  faPenToSquare,
  faPeopleRoof,
} from "@fortawesome/free-solid-svg-icons";
import { ruleRequired } from "../../common/rules";
import { CommonStatusValue } from "../../common/values";
import type { ParentNotFormatType, ParentFormatType } from "../../common/types";
import CustomUpload from "../../components/upload";
import CustomTableActions from "../../components/table-actions";
import { useNotification } from "../../utils/showNotification";
import axios from "axios";
import { Spin } from "antd";
import { data } from "react-router-dom";
import Password from "antd/es/input/Password";


// Parent Page
const ParentPage = () => {
  // Language
  const { t } = useTranslation();

  // Notification
  const { openNotification } = useNotification();

  const [dataParents, setParents] = useState<ParentFormatType[]>([]);

useEffect(() => {
  fetch("http://localhost:5000/api/parents")
    .then((res) => res.json())
    .then((data) => {
      console.log("📦 API trả về:", data); // In toàn bộ dữ liệu API trả về
      console.log("📋 Danh sách phụ huynh:", data.result); // In phần result
      setParents(data.data); // ✅ Đúng biến: data chứ không phải d
    })
    .catch((err) => console.error("❌ Lỗi fetchd dữ liệu:", err));
}, []);


 
  const columns: ColumnsType<ParentFormatType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: "10%",
      sorter: (a, b) => a?.id! - b?.id!,
    },
  {
  title: "Hình ảnh",
  dataIndex: "avatar",
  key: "avatar",
  width: "5%",
  render: (avatar: string) => {
    const imageUrl = avatar
      ? `http://localhost:5000/uploads/parents/${avatar}`
      : "/src/assets/images/others/no-image.png";

    console.log("➡️ Đường dẫn ảnh:", imageUrl); // ✅ In ra console của trình duyệt

    return (
      <Image
        src={imageUrl}
        alt=""
        width={60}
        height={60}
        style={{ objectFit: "cover", borderRadius: "8px" }}
      />
    );
  },
},

    {
      title: "Họ và tên",
      dataIndex: "full_name",
      key: "full_name",
      width: "30%",
      sorter: (a, b) => a?.full_name!.localeCompare(b?.full_name!),
    },
      {
      title: "Tên tài khoản",
      key: "account",
      width: "20%",
      render: (record: ParentFormatType) => record.account?.username,
      sorter: (a, b) => a.account!.username!.localeCompare(b.account!.username!),
    },

    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: "10%",
      sorter: (a, b) => a?.phone!.localeCompare(b?.phone!),
    },
    {
      title: "Trạng thái",
      key: "accountStatus",
      render: (_: any, record: ParentFormatType) => (
        <Tag color={record.account?.status === "ACTIVE" ? "green" : "red"}>
          {record.account?.status}
        </Tag>
      ),
      sorter: (a, b) => (a.account?.status || "").localeCompare(b.account?.status || ""),
      width: "10%",
    },

    {
      title: "",
      render: (record: any) => (
        <div>
          <Button
            color="geekblue"
            variant="filled"
            onClick={() => {
              setCurrentAction("detail");
              setCurrentSelectedItem(record);
            }}
          >
            <FontAwesomeIcon icon={faInfoCircle} />
          </Button>
          <Button
            color="orange"
            variant="filled"
            onClick={() => {
              setCurrentAction("update");
              setCurrentSelectedItem(record);
            }}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </Button>
          <Button
            color="red"
            variant="filled"
            onClick={() => {
              setCurrentAction(
                record.account?.status === "ACTIVE"  ? "lock" : "unlock"
              );
              setCurrentSelectedItem(record);
            }}
          >
            <FontAwesomeIcon
              icon={
                record.account?.status === "ACTIVE"  ? faLock : faLockOpen
              }
            />
          </Button>
          <Button
            color="default"
            variant="filled"
            onClick={() => {
              setCurrentAction("change-password");
              setCurrentSelectedItem(record);
            }}
          >
            <FontAwesomeIcon icon={faKey} />
          </Button>
        </div>
      ),
      width: "15%",
      className: "actions",
    },
  ];



  // State giữ đối tượng được chọn hiện tại
  const [currentSelectedItem, setCurrentSelectedItem] =
    useState<ParentFormatType>();
  // State giữ hành động hiện tại
  const [currentAction, setCurrentAction] = useState<string>("list");
  // State giữ breadcrumb items hiện tại
  const [currentBreadcrumbItems, setCurrentBreadcrumbItems] =
    useState<Partial<BreadcrumbItemType & BreadcrumbSeparatorType>[]>();
  // State giữ card info hiện tại
  const [currentCardTitle, setCurrentCardTitle] = useState<string>(
    t("parent-list")
  );
  const [currentCardContent, setCurrentCardContent] = useState<string>("list");

  // parent Actions
  const defaultLabels = {
    id: "Mã phụ huynh",
    username: "Tên tài khoản",
    password: "Mật khẩu",
    avatar: "Ảnh đại diện",
    fullname: "Họ và tên",
    phone: "Số điện thoại",
    email: "Email",
    address: "Địa chỉ",
    status: "Trạng thái",
  };
  const defaultInputs = {
    id: "Được xác định sau khi xác nhận thêm !",
    username: "Nhập Tên tài khoản",
    password: "Nhập Mật khẩu",
    avatar: "Tải ảnh lên",
    fullname: "Nhập Họ và tên",
    phone: "Nhập Số điện thoại",
    email: "Nhập Email",
    address: "Nhập Địa chỉ",
    status: "Chọn Trạng thái",
  };

 const validateAndGetPassword = (form: any, openNotification: any) => {
  console.log(form)

  // Nếu không nhập mật khẩu mới thì bỏ qua
  if (!form.newPassword && !form.newPassword2) return null;

  // Kiểm tra độ dài
  if (form.newPassword.length < 6) {
    openNotification({
      type: "error",
      message: "Mật khẩu quá ngắn",
      description: "Mật khẩu phải có ít nhất 6 ký tự.",
    });
    return null;
  }

  // Kiểm tra khớp nhau
  if (form.newPassword !== form.newPassword2) {
    openNotification({
      type: "error",
      message: "Mật khẩu không khớp",
      description: "Vui lòng nhập lại mật khẩu xác nhận cho đúng.",
    });
    return null;
  }


  return { password: form.newPassword };
};

 const handleSubmitUpdate = async (values: ParentNotFormatType, imageFile?: RcFile) => {
  try {
    const formData = new FormData();

    // Gửi kèm các trường text
    if (values.fullname) formData.append("full_name", values.fullname);
    if (values.phone) formData.append("phone", values.phone);
    if (values.email) formData.append("email", values.email);
    if (values.address) formData.append("address", values.address);
    if (values.username) formData.append("username", values.username);
    if (values.password && values.password.trim() !== "")
      formData.append("password", values.password);
    if (values.status) formData.append("status", values.status);
    if (values.account_id) formData.append("account_id", values.account_id!.toString());

    // Gửi kèm file ảnh (nếu có)
    if (imageFile) {
      formData.append("avatar", imageFile);
    }

    console.log("🧾 Dữ liệu gửi lên (FormData):");
    for (const [key, value] of formData.entries()) {
      console.log(key, ":", value);
    }

    // Gửi request PUT — nhớ set headers
    const res = await axios.put(
      `http://localhost:5000/api/parents/${values.id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    if (res.status === 200 || res.status === 201) {
      // Cập nhật lại danh sách
      const response = await fetch("http://localhost:5000/api/parents");
      const result = await response.json();

      setParents(result.data);
      setCurrentAction("list");

      console.log("✅ Phụ huynh đã được cập nhật:", res.data);
      openNotification({
        type: "success",
        message: "Thành công",
        description: "Đã cập nhật phụ huynh thành công!",
        duration: 1.5,
      });
    } else {
      openNotification({
        type: "error",
        message: "Thất bại",
        description: "Không thể cập nhật phụ huynh. Vui lòng thử lại!",
      });
    }
  } catch (error: any) {
    console.error("❌ Lỗi khi cập nhật phụ huynh:", error);
    openNotification({
      type: "error",
      message: "Lỗi hệ thống",
      description: "Đã xảy ra lỗi khi gửi dữ liệu lên máy chủ.",
    });
  }
};

const handleSubmitCreate = async (values: ParentNotFormatType,imageFile?: RcFile) => {
  try {
    const formData = new FormData();

    if (imageFile) {
      formData.append("avatar", imageFile); 
    }

    if (values.fullname) formData.append("full_name", values.fullname);
    if (values.phone) formData.append("phone", values.phone);
    if (values.email) formData.append("email", values.email);
    if (values.address) formData.append("address", values.address);
    if (values.username) formData.append("username", values.username);
    if (values.password) formData.append("password", values.password);

    if (values.status) {
      if (values.status === "Hoạt động") formData.append("status", "ACTIVE");
      else if (values.status === "Không hoạt động")
        formData.append("status", "INACTIVE");
      else formData.append("status", values.status);
    }
    console.log("🧾 Dữ liệu gửi lên (FormData):");
    console.log(formData);
    const res = await axios.post("http://localhost:5000/api/parents", formData);

    if (res.status === 200 || res.status === 201) {
      const response = await fetch("http://localhost:5000/api/parents");
      const result = await response.json();

      setParents(result.data);
      setCurrentAction("list");

      console.log("✅ Phụ huynh đã được tạo:", res.data);

      openNotification({
        type: "success",
        message: "Thành công",
        description: "Tạo phụ huynh mới thành công!",
        duration: 1.5,
      });
    } else {
      openNotification({
        type: "error",
        message: "Thất bại",
        description: "Không thể tạo phụ huynh. Vui lòng thử lại!",
      });
    }
  } catch (error: any) {
    console.error("❌ Lỗi khi tạo phụ huynh:", error);
    openNotification({
      type: "error",
      message: "Lỗi hệ thống",
      description: "Đã xảy ra lỗi khi gửi dữ liệu lên máy chủ.",
    });
  }
};



  const ParentDetail: React.FC<{ parent: ParentFormatType }> = ({ parent }) => {
    console.log("Parent props:", parent);
    const [form] = Form.useForm<ParentNotFormatType>();

    return (
      <>
        <div className="parent-content detail">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              id: parent.id || undefined,
              username: parent.account?.username || undefined, 
              password: "Mật khẩu đã được mã hoá !",
              avatar: parent.avatar || undefined,
              fullname: parent.full_name || undefined, 
              phone: parent.phone || undefined,
              email: parent.email || undefined,
              address: parent.address || undefined,
              status: parent.account?.status || undefined,
            }}
          >
            <Row className="split-3">
              <Col>
                <Form.Item
                  name="avatar"
                  label={defaultLabels.avatar}
                  valuePropName="fileList"
                >
                  <CustomUpload
                    defaultSrc={parent.avatar! as string}
                    alt="image-preview"
                    imageClassName="image-preview"
                    imageCategoryName="parents"
                    uploadClassName="image-uploader"
                    labelButton={defaultInputs["avatar"]}
                    disabled={true}
                  />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item name="id" label={defaultLabels.id}>
                  <Input disabled />
                </Form.Item>
                <Form.Item name="username" label={defaultLabels.username}>
                  <Input disabled />
                </Form.Item>
                <Form.Item
                  name="fullname"
                  label={defaultLabels.fullname}
                  className="multiple-2"
                >
                  <Input disabled />
                </Form.Item>
                <Form.Item name="phone" label={defaultLabels.phone}>
                  <Input disabled />
                </Form.Item>
                <Form.Item
                  name="address"
                  label={defaultLabels.address}
                  className="multiple-2 margin-bottom-0"
                >
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item name="status" label={defaultLabels.status}>
                  <Select disabled />
                </Form.Item>
                <Form.Item name="password" label={defaultLabels.password}>
                  <Input disabled />
                </Form.Item>
                <Form.Item label="." className="hidden">
                  <Input />
                </Form.Item>
                <Form.Item name="email" label={defaultLabels.email}>
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </>
    );
  };
  const ParentCreate: React.FC = () => {
    const [form] = Form.useForm<ParentNotFormatType>();
    const [imageFile, setImageFile] = useState<RcFile>();

    return (
      <>
        <div className="parent-content create">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              id: undefined,
              username: undefined,
              password: undefined,
              avatar: undefined,
              fullname: undefined,
              phone: undefined,
              email: undefined,
              address: undefined,
              status: undefined,
            }}
            onFinish={() => {
              console.log("Form values:", form.getFieldsValue());
              handleSubmitCreate(form.getFieldsValue(),imageFile);
              
            }}
          >
            <Row className="split-3">
              <Col>
                <Form.Item
                  name="avatar"
                  htmlFor="create-avatar"
                  label={defaultLabels.avatar}
                  valuePropName="fileList"
                >
                  <CustomUpload
                    imageFile={imageFile}
                    setImageFile={setImageFile}
                    alt="image-preview"
                    htmlFor="create-avatar"
                    imageClassName="image-preview"
                    uploadClassName="image-uploader"
                    labelButton={defaultInputs.avatar}
                  />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  name="id"
                  label={defaultLabels.id}
                  className="text-center"
                >
                  <Input placeholder={defaultInputs.id} disabled />
                </Form.Item>
                <Form.Item
                  name="username"
                  label={defaultLabels.username}
                  rules={[ruleRequired("Tên tài khoản không được để trống !")]}
                >
                  <Input placeholder={defaultInputs.username} />
                </Form.Item>
                <Form.Item
                  name="fullname"
                  label={defaultLabels.fullname}
                  rules={[ruleRequired("Họ và tên không được để trống !")]}
                  className="multiple-2"
                >
                  <Input placeholder={defaultInputs.fullname} />
                </Form.Item>
                <Form.Item
                  name="phone"
                  label={defaultLabels.phone}
                  rules={[ruleRequired("Số điện thoại không được để trống !")]}
                >
                  <Input placeholder={defaultInputs.phone} />
                </Form.Item>
                <Form.Item
                  name="address"
                  label={defaultLabels.address}
                  className="multiple-2"
                >
                  <Input placeholder={defaultInputs.address} />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  name="status"
                  label={defaultLabels.status}
                  rules={[ruleRequired("Trạng thái không được để trống !")]}
                >
                  <Select
                    allowClear
                    options={[
                      {
                        label: CommonStatusValue.active,
                        value: CommonStatusValue.active,
                      },
                      {
                        label: CommonStatusValue.inactive,
                        value: CommonStatusValue.inactive,
                      },
                    ]}
                    placeholder={defaultInputs.status}
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  label={defaultLabels.password}
                  rules={[ruleRequired("Mật khẩu không được để trống !")]}
                >
                  <Input placeholder={defaultInputs.password} />
                </Form.Item>
                <Form.Item label="." className="hidden">
                  <Input />
                </Form.Item>
                <Form.Item name="email" label={defaultLabels.email}>
                  <Input placeholder={defaultInputs.email} />
                </Form.Item>
              </Col>
            </Row>
            <div className="buttons">
              <Button
                type="primary"
                htmlType="submit"
                className="submit-button"
              >
                Xác nhận
              </Button>
            </div>
          </Form>
        </div>
      </>
    );
  };
  const ParentUpdate: React.FC<{ parent: ParentFormatType }> = ({ parent }) => {
    const [form] = Form.useForm<ParentNotFormatType>();
    const [imageFile, setImageFile] = useState<RcFile>();

    return (
      <>
        <div className="parent-content update">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              id: parent.id || undefined,
              username: parent.account?.username || undefined, 
              password: "Mật khẩu đã được mã hoá !",
              avatar: parent.avatar || undefined,
              fullname: parent.full_name || undefined,
              phone: parent.phone || undefined,
              email: parent.email || undefined,
              address: parent.address || undefined,
              status: parent.account?.status || undefined,
            }}
            onFinish={() => {
              console.log("Form values:", form.getFieldsValue());
              handleSubmitUpdate(form.getFieldsValue(),imageFile);
            }}
          >
            <Row className="split-3">
              <Col>
                <Form.Item
                  name="avatar"
                  htmlFor="create-avatar"
                  label={defaultLabels.avatar}
                  valuePropName="fileList"
                >
                  <CustomUpload
                    defaultSrc={parent.avatar ? parent.avatar : ""}
                    imageFile={imageFile}
                    setImageFile={setImageFile}
                    alt="image-preview"
                    htmlFor="create-avatar"
                    imageClassName="image-preview"
                    uploadClassName="image-uploader"
                    labelButton={defaultInputs.avatar}
                  />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  name="id"
                  label={defaultLabels.id}
                  className="text-center"
                >
                  <Input disabled />
                </Form.Item>
                <Form.Item name="username" label={defaultLabels.username}>
                  <Input disabled />
                </Form.Item>
                <Form.Item
                  name="fullname"
                  label={defaultLabels.fullname}
                  rules={[ruleRequired("Họ và tên không được để trống !")]}
                  className="multiple-2"
                >
                  <Input placeholder={defaultInputs.fullname} />
                </Form.Item>
                <Form.Item
                  name="phone"
                  label={defaultLabels.phone}
                  rules={[ruleRequired("Số điện thoại không được để trống !")]}
                >
                  <Input placeholder={defaultInputs.phone} />
                </Form.Item>
                <Form.Item
                  name="address"
                  label={defaultLabels.address}
                  className="multiple-2"
                >
                  <Input placeholder={defaultInputs.address} />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item name="status" label={defaultLabels.status}>
                  <Select disabled />
                </Form.Item>
                <Form.Item name="password" label={defaultLabels.password}>
                  <Input disabled />
                </Form.Item>
                <Form.Item label="." className="hidden">
                  <Input />
                </Form.Item>
                <Form.Item name="email" label={defaultLabels.email}>
                  <Input placeholder={defaultInputs.email} />
                </Form.Item>
              </Col>
            </Row>
            <div className="buttons">
              <Button
                type="primary"
                htmlType="submit"
                className="submit-button"
              >
                Xác nhận
              </Button>
            </div>
          </Form>
        </div>
      </>
    );
  };
  const ParentLock: React.FC<{ parent: ParentFormatType }> = ({ parent }) => {
    return (
      <>
        <Alert
          message={
            "Học sinh: " +
            "#" +
            parent?.id +
            " - " +
            parent?.full_name +
            " - " +
            parent?.phone
          }
          showIcon
          icon={
            <FontAwesomeIcon
              icon={
                parent?.status === CommonStatusValue.active
                  ? faLock
                  : faLockOpen
              }
            />
          }
          description={
            "Bạn có chắc chắc muốn" +
            (parent.account?.status === "ACTIVE" 
              ? " khoá "
              : " mở khoá ") +
            "phụ huynh này ? Hành động không thể hoàn tác !"
          }
          type="error"
          action={
            <Button
              color="danger"
              variant="solid"
            onClick={() => {
              handleSubmitUpdate({
                id: parent.id,
                username: parent.account?.username,
                status:
                  parent.account?.status === "ACTIVE" ? "INACTIVE" : "ACTIVE", 
              });

              openNotification({
                type: "success",
                message: "Thành công",
                description: "Đã cập nhật trạng thái phụ huynh thành công!",
                duration: 1.5,
              });
            }}

            >
              Xác nhận
            </Button>
          }
        />
      </>
    );
  };
  const ParentChangePassword: React.FC<{ parent: ParentFormatType }> = ({
    parent,
  }) => {
    const [form] = Form.useForm<ParentNotFormatType>();

    return (
      <>
        <div className="parent-content change-password">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              newPassword: undefined,
              newPassword2: undefined,
                        }}
            onFinish={() => {
              const passwordData = validateAndGetPassword(form.getFieldsValue(), openNotification);

              if (passwordData === null) return;
              const formValues = form.getFieldsValue() as any;

              // 🧩 3. Gọi API update
              handleSubmitUpdate({
                ...formValues,
                ...passwordData,
                id: parent.id,
                account_id: parent.account?.id,
                username: parent.account?.username,
              });
            }}

          >
            <Row className="split-3">
              <Col></Col>
              <Col>
                <Form.Item
                  name="newPassword"
                  label="Mật khẩu mới"
                  rules={[ruleRequired("Mật khẩu mới không được để trống !")]}
                >
                  <Input placeholder="Nhập Mật khẩu mới" />
                </Form.Item>
                <Form.Item
                  name="newPassword2"
                  label="Mật khẩu mới lần 2"
                  rules={[
                    ruleRequired("Mật khẩu mới lần 2 không được để trống !"),
                  ]}
                >
                  <Input placeholder="Nhập Mật khẩu mới lần 2" />
                </Form.Item>
                <div className="buttons">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="submit-button"
                  >
                    Xác nhận
                  </Button>
                </div>
              </Col>
              <Col></Col>
            </Row>
          </Form>
        </div>
      </>
    );
  };
  const ParentActions = {
    detail: (selectedParent: ParentFormatType) => (
      <ParentDetail parent={selectedParent} />
    ),
    create: () => <ParentCreate />,
    update: (selectedParent: ParentFormatType) => (
      <ParentUpdate parent={selectedParent} />
    ),
    lock: (selectedParent: ParentFormatType) => (
      <ParentLock parent={selectedParent} />
    ),
    changePassword: (selectedParent: ParentFormatType) => (
      <ParentChangePassword parent={selectedParent} />
    ),
  };

  // Effect cập nhật Card Content
  useEffect(() => {
    if (currentAction === "list") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faPeopleRoof} />
              &nbsp;{t("parent-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("parent-list")}
            </span>
          ),
        },
      ]);
      setCurrentCardTitle(t("parent-list"));
      setCurrentCardContent("list");
    } else if (currentAction === "detail") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faPeopleRoof} />
              &nbsp;{t("parent-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("parent-list")}
            </span>
          ),
        },
        { title: <span>{t("parent-detail")}</span> },
      ]);
      setCurrentCardTitle(t("parent-detail"));
      setCurrentCardContent("detail");
    } else if (currentAction === "create") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faPeopleRoof} />
              &nbsp;{t("parent-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("parent-list")}
            </span>
          ),
        },
        { title: <span>{t("parent-create")}</span> },
      ]);
      setCurrentCardTitle(t("parent-create"));
      setCurrentCardContent("create");
    } else if (currentAction === "update") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faPeopleRoof} />
              &nbsp;{t("parent-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("parent-list")}
            </span>
          ),
        },
        { title: <span>{t("parent-update")}</span> },
      ]);
      setCurrentCardTitle(t("parent-update"));
      setCurrentCardContent("update");
    } else if (currentAction === "lock") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faPeopleRoof} />
              &nbsp;{t("parent-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("parent-list")}
            </span>
          ),
        },
        { title: <span>{t("parent-lock")}</span> },
      ]);
      setCurrentCardTitle(t("parent-lock"));
      setCurrentCardContent("lock");
    } else if (currentAction === "unlock") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faPeopleRoof} />
              &nbsp;{t("parent-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("parent-list")}
            </span>
          ),
        },
        { title: <span>{t("parent-unlock")}</span> },
      ]);
      setCurrentCardTitle(t("parent-unlock"));
      setCurrentCardContent("unlock");
    } else if (currentAction === "change-password") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faPeopleRoof} />
              &nbsp;{t("parent-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("parent-list")}
            </span>
          ),
        },
        { title: <span>{t("parent-change-password")}</span> },
      ]);
      setCurrentCardTitle(t("parent-change-password"));
      setCurrentCardContent("change-password");
    }
  }, [currentAction]);

  return (
    <>
      <div className="admin-layout__main-content">
        {/* Breadcrumb */}
        <Breadcrumb
          items={currentBreadcrumbItems}
          className="admin-layout__main-breadcrumb"
        />
        {/* Card */}
        <Card title={currentCardTitle} className="admin-layout__main-card">
          {currentCardContent === "list" && (
            <div className="parent-data">
              <div className="admin-layout__main-filter">
                <div className="left">
                  <Input
                    prefix={<SearchOutlined />}
                    placeholder="Tìm theo họ và tên phụ huynh"
                    //   value={searchText}
                    //   onChange={(e) => setSearchText(e.target.value)}
                    className="filter-find"
                  />
                  <Select
                    allowClear
                    placeholder="Chọn Trạng thái"
                    options={[
                      {
                        label: CommonStatusValue.active,
                        value: CommonStatusValue.active,
                      },
                      {
                        label: CommonStatusValue.inactive,
                        value: CommonStatusValue.inactive,
                      },
                    ]}
                    className="filter-select"
                  />
                  <Button
                    color="blue"
                    variant="filled"
                    icon={<ReloadOutlined />}
                    //   onClick={() => setSearchText("")}
                    className="filter-reset"
                  >
                    Làm mới
                  </Button>
                </div>
                <div className="right">
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setCurrentAction("create")}
                  >
                    {t("parent-create")}
                  </Button>
                </div>
              </div>
              <CustomTableActions<ParentFormatType>
                columns={columns}
                data={dataParents || []}
                rowKey={(record) => String(record?.id)}
                // loading={isLoading}
                defaultPageSize={10}
                className="admin-layout__main-table table-data parents"
              />
              <pre>{JSON.stringify(dataParents, null, 2)}</pre>
           
            </div>
          )}
          {currentCardContent === "detail" &&
            ParentActions.detail(currentSelectedItem!)}
          {currentCardContent === "create" && ParentActions.create()}
          {currentCardContent === "update" &&
            ParentActions.update(currentSelectedItem!)}
          {(currentCardContent === "lock" || currentCardContent === "unlock") &&
            ParentActions.lock(currentSelectedItem!)}
          {currentCardContent === "change-password" &&
            ParentActions.changePassword(currentSelectedItem!)}
        </Card>
      </div>
    </>
  );



};

export default ParentPage;
