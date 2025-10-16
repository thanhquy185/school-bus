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

// Parent Page
const ParentPage = () => {
  // Language
  const { t } = useTranslation();

  // Notification
  const { openNotification } = useNotification();

  // Cấu hình bảng dữ liệu
  const demoData: ParentFormatType[] = [
    {
      id: 1,
      user: {
        id: 1,
        role: "parent",
        username: "phuhuynh1",
        password: "phuhuynh1",
      },
      fullname: "Họ tên phụ huynh 1",
      phone: "1234567890",
      email: "phuhuynh1@gmail.com",
      address: "Địa chỉ ở đâu không biết",
      status: "Hoạt động",
    },
    {
      id: 2,
      user: {
        id: 2,
        role: "parent",
        username: "phuhuynh2",
        password: "phuhuynh2",
      },
      fullname: "Họ tên phụ huynh 2",
      phone: "2234567890",
      email: "phuhuynh2@gmail.com",
      address: "Địa chỉ ở đâu không biết",
      status: "Tạm dừng",
    },
  ];
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
      render: (avatar: string) => (
        <Image
          src={
            avatar!
              ? "/src/assets/images/parents/" + avatar
              : "/src/assets/images/others/no-image.png"
          }
          alt=""
        />
      ),
    },
    {
      title: "Họ và tên",
      dataIndex: "fullname",
      key: "fullname",
      width: "30%",
      sorter: (a, b) => a?.fullname!.localeCompare(b?.fullname!),
    },
    {
      title: "Tên tài khoản",
      key: "username",
      width: "20%",
      render: (record: ParentFormatType) => record.user?.username,
      sorter: (a, b) => a?.user!.username!.localeCompare(b?.user!.username!),
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
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === CommonStatusValue.active ? "green" : "red"}>
          {status}
        </Tag>
      ),
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
              username: parent.user?.username || undefined,
              password: "Mật khẩu đã được mã hoá !",
              avatar: parent.avatar || undefined,
              fullname: parent.fullname || undefined,
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
              username: parent.user?.username || undefined,
              password: "Mật khẩu đã được mã hoá !",
              avatar: parent.avatar || undefined,
              fullname: parent.fullname || undefined,
              phone: parent.phone || undefined,
              email: parent.email || undefined,
              address: parent.address || undefined,
              status: parent.status || undefined,
            }}
            onFinish={() => {
              console.log("Form values:", form.getFieldsValue());
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
            parent?.fullname +
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
            (parent?.status === CommonStatusValue.active
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
                openNotification({
                  type: "success",
                  message: "Thành công",
                  description: "123 !",
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
              console.log("Form values:", form.getFieldsValue());
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
                data={demoData || []}
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
