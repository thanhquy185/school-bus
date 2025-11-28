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
import useCallApi from "../../api/useCall";
import { createParent, getParents, updateParent, uploadParentAvatar } from "../../services/parent-service";
import { getAccountStatusText } from "../../utils/vi-trans";

// Parent Page
const ParentPage = () => {
  const { execute, notify } = useCallApi();
  const { t } = useTranslation();
  const { openNotification } = useNotification();

  const [parents, setParents] = useState<ParentFormatType[]>([]);

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  const handleGetData = async () => {
    const restResponse = await execute(getParents(), false);
    if (restResponse?.result && Array.isArray(restResponse.data)) {
      setParents(restResponse.data.map(parent => ({
        ...parent,
        status: getAccountStatusText(parent.status)
      })));
    }
  }

  useEffect(() => {
    handleGetData();
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
      width: "10%",
      render: (avatar: string) => {
        const imageUrl = avatar
          ? avatar
          : "/src/assets/images/others/no-image.png";

        return (
          <Image
            src={imageUrl}
            alt=""
            width={80}
            height={100}
            style={{ objectFit: "cover", borderRadius: "6px" }}
          />
        );
      },
    },

    {
      title: "Họ và tên",
      dataIndex: "full_name",
      key: "full_name",
      width: "28%",
      sorter: (a, b) => a?.full_name!.localeCompare(b?.full_name!),
    },
    {
      title: "Tên tài khoản",
      key: "username",
      width: "18%",
      render: (record: ParentFormatType) => record.username,
      sorter: (a, b) => a.username!.localeCompare(b.username!),
    },

    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: "10%",
      // sorter: (a, b) => a?.phone!.localeCompare(b?.phone!),
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_: any, record: ParentFormatType) => (
        <Tag color={record.status === CommonStatusValue.active ? "green" : "red"}>
          {record.status}
        </Tag>
      ),
      // sorter: (a, b) => (a.status || "").localeCompare(b.status || ""),
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
                record.status === CommonStatusValue.active ? "lock" : "unlock"
              );
              setCurrentSelectedItem(record);
            }}
          >
            <FontAwesomeIcon
              icon={
                record.status === CommonStatusValue.active ? faLock : faLockOpen
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
      width: "14%",
      className: "actions",
    },
  ];

  const [currentSelectedItem, setCurrentSelectedItem] = useState<ParentFormatType>();
  const [currentAction, setCurrentAction] = useState<string>("list");
  const [currentBreadcrumbItems, setCurrentBreadcrumbItems] = useState<Partial<BreadcrumbItemType & BreadcrumbSeparatorType>[]>();
  const [currentCardTitle, setCurrentCardTitle] = useState<string>(t("parent-list"));
  const [currentCardContent, setCurrentCardContent] = useState<string>("list");

  const defaultLabels = {
    id: "Mã phụ huynh",
    username: "Tên tài khoản",
    password: "Mật khẩu",
    avatar: "Ảnh đại diện",
    full_name: "Họ và tên",
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
    full_name: "Nhập Họ và tên",
    phone: "Nhập Số điện thoại",
    email: "Nhập Email",
    address: "Nhập Địa chỉ",
    status: "Chọn Trạng thái",
  };

  const validateAndGetPassword = (form: any, openNotification: any) => {
    if (!form.newPassword && !form.newPassword2) return null;
    if (form.newPassword.length < 6) {
      openNotification({
        type: "error",
        message: "Mật khẩu quá ngắn",
        description: "Mật khẩu phải có ít nhất 6 ký tự.",
      });
      return null;
    }

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

  const statusMap: Record<string, string> = {
    "Hoạt động": "ACTIVE",
    "Tạm dừng": "INACTIVE",
  };

  const filteredParentList = parents.filter((parent) => {
    const matchesFull_name = parent.full_name
      ?.toLowerCase()
      .includes(searchText.toLowerCase());

    const matchesStatus = statusFilter
      ? parent.status === statusMap[statusFilter]
      : true;

    return matchesFull_name && matchesStatus;
  });

  const ParentDetail: React.FC<{ parent: ParentFormatType }> = ({ parent }) => {
    const [form] = Form.useForm<ParentNotFormatType>();

    return (
      <>
        <div className="parent-content detail">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              id: parent.id || undefined,
              username: parent.username || undefined,
              password: "Mật khẩu đã được mã hoá !",
              avatar: parent.avatar || undefined,
              full_name: parent.full_name || undefined,
              phone: parent.phone || undefined,
              email: parent.email || undefined,
              address: parent.address || undefined,
              status: parent.status || undefined,
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
                    defaultSrc={
                      parent.avatar
                        ? parent.avatar
                        : "/src/assets/images/others/no-image.png"
                    }
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
                  name="full_name"
                  label={defaultLabels.full_name}
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

    const handleSubmit = async () => {
      const createResponse = await execute(createParent({
        full_name: form.getFieldValue("full_name"),
        phone: form.getFieldValue("phone"),
        email: form.getFieldValue("email"),
        address: form.getFieldValue("address"),
        username: form.getFieldValue("username"),
        password: form.getFieldValue("password"),
        status: form.getFieldValue("status")
      }), true);
      notify(createResponse!, "Thêm phụ huynh thành công");
      if (createResponse?.result) {
        const parent_id = createResponse.data.id;
        if (imageFile && parent_id) {
          const formData = new FormData();
          formData.append("avatar", imageFile);
          const uploadResponse = await execute(uploadParentAvatar(parent_id, formData), true);
          notify(uploadResponse!, "Tải ảnh đại diện phụ huynh thành công");
        }
        setCurrentAction("list");
        handleGetData();
      }
    };

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
              full_name: undefined,
              phone: undefined,
              email: undefined,
              address: undefined,
              status: undefined,
            }}
            autoComplete="off"
            onFinish={handleSubmit}
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
                  name="full_name"
                  label={defaultLabels.full_name}
                  rules={[ruleRequired("Họ và tên không được để trống !")]}
                  className="multiple-2"
                >
                  <Input placeholder={defaultInputs.full_name} />
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
                        value: "ACTIVE",
                      },
                      {
                        label: CommonStatusValue.inactive,
                        value: "INACTIVE",
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

    const handleSubmitUpdate = async () => {
      const updateResponse = await execute(updateParent(parent.id!, {
        full_name: form.getFieldValue("full_name"),
        phone: form.getFieldValue("phone"),
        email: form.getFieldValue("email"),
        address: form.getFieldValue("address"),
      }), true);
      notify(updateResponse!, "Cập nhật phụ huynh thành công");
      if (updateResponse?.result && parent.id) {
        if (imageFile) {
          const formData = new FormData();
          formData.append("avatar", imageFile);
          const uploadResponse = await execute(uploadParentAvatar(parent.id!, formData), true);
          notify(uploadResponse!, "Tải ảnh đại diện phụ huynh thành công");
        }
        setCurrentAction("list");
        handleGetData();
      }
    };

    return (
      <>
        <div className="parent-content update">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              id: parent.id || undefined,
              username: parent.username || undefined,
              password: "Mật khẩu đã được mã hoá !",
              avatar: parent.avatar || undefined,
              full_name: parent.full_name || undefined,
              phone: parent.phone || undefined,
              email: parent.email || undefined,
              address: parent.address || undefined,
              status: parent.status || undefined,
            }}
            autoComplete="off"
            onFinish={handleSubmitUpdate}
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
                    defaultSrc={
                      parent.avatar
                        ? parent.avatar
                        : "/src/assets/images/others/no-image.png"
                    }
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
                  name="full_name"
                  label={defaultLabels.full_name}
                  rules={[ruleRequired("Họ và tên không được để trống !")]}
                  className="multiple-2"
                >
                  <Input placeholder={defaultInputs.full_name} />
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

    const handleChangeStatus = async () => {
      const restResponse = await execute(updateParent(parent.id!, {
        status: parent.status === CommonStatusValue.active ? "INACTIVE" : "ACTIVE",
      }), true);
      notify(restResponse!, `${parent.status === CommonStatusValue.active ? "Khoá" : "Mở khoá"} phụ huynh thành công`);
      if (restResponse?.result) {
        setCurrentAction("list");
        handleGetData();
      }
    }

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
                parent.status === CommonStatusValue.active
                  ? faLock
                  : faLockOpen
              }
            />
          }
          description={
            "Bạn có chắc chắc muốn" +
            (parent.status === "ACTIVE"
              ? " khoá "
              : " mở khoá ") +
            "phụ huynh này ? Hành động không thể hoàn tác !"
          }
          type="error"
          action={
            <Button
              color="danger"
              variant="solid"
              onClick={handleChangeStatus}

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

    const handleSubmitUpdate = async () => {
      const passwordData = validateAndGetPassword(form.getFieldsValue(), openNotification);
      if (!passwordData) return;

      const restResponse = await execute(updateParent(parent.id!, passwordData), true);
      notify(restResponse!, "Cập nhật mật khẩu phụ huynh thành công");
      if (restResponse?.result) {
        setCurrentAction("list");
        handleGetData();
      }
    }

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
            onFinish={handleSubmitUpdate}

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
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="filter-find"
                  />
                  <Select
                    allowClear
                    placeholder="Chọn Trạng thái"
                    value={statusFilter}
                    onChange={(value) => setStatusFilter(value)}
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
                    onClick={() => {
                      setSearchText("");
                      setStatusFilter(undefined);
                    }}

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
                data={filteredParentList || []}
                rowKey={(record) => String(record?.id)}
                // loading={isLoading}
                defaultPageSize={10}
                className="admin-layout__main-table table-data parents"
              />


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
