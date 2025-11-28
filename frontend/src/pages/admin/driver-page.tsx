import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Breadcrumb,
  Card,
  Input,
  Image,
  Button,
  Select,
  Tag,
  Form,
  Col,
  Row,
  Alert,
  DatePicker,
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
  faChalkboardUser,
} from "@fortawesome/free-solid-svg-icons";
import { ruleEmail, rulePhone, ruleRequired } from "../../common/rules";
import { CommonGenderValue, CommonStatusValue } from "../../common/values";
import type { DriverNotFormatType, DriverFormatType } from "../../common/types";
import CustomUpload from "../../components/upload";
import CustomTableActions from "../../components/table-actions";
import { useNotification } from "../../utils/showNotification";
import useCallApi from "../../api/useCall";
import {
  createDriver,
  getDrivers,
  updateDriver,
  uploadDriverAvatar,
} from "../../services/driver-service";
import { getAccountStatusText, getGenderText } from "../../utils/vi-trans";
import dayjs from "dayjs";
import { formatByDate } from "../../utils/format-day";

const statusMap: Record<string, string> = {
  "Hoạt động": "ACTIVE",
  "Tạm dừng": "INACTIVE",
};

// Driver Page
const DriverPage = () => {
  const { execute, notify } = useCallApi();
  const { t } = useTranslation();
  const { openNotification } = useNotification();

  const [drivers, setDrivers] = useState<DriverFormatType[]>([]);

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const filteredDriverList = drivers.filter((driver) => {
    const matchesfull_name = driver.full_name
      ?.toLowerCase()
      .includes(searchText.toLowerCase());

    const matchesStatus = statusFilter
      ? driver.status === statusMap[statusFilter]
      : true;

    return matchesfull_name && matchesStatus;
  });

  const handleGetData = async () => {
    const restResponse = await execute(getDrivers(), false);
    if (restResponse?.result && Array.isArray(restResponse.data)) {
      setDrivers(restResponse.data);
    }
  };

  useEffect(() => {
    handleGetData();
  }, []);
  const columns: ColumnsType<DriverFormatType> = [
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
      width: "36%",
      sorter: (a, b) => a?.full_name!.localeCompare(b?.full_name!),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: "15%",
      // sorter: (a, b) => a?.phone!.localeCompare(b?.phone!),
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_: any, record: DriverFormatType) => (
        <Tag color={record.status === "ACTIVE" ? "green" : "red"}>
          {getAccountStatusText(record.status || "")}
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
              setCurrentAction(record.status === "ACTIVE" ? "lock" : "unlock");
              setCurrentSelectedItem(record);
            }}
          >
            <FontAwesomeIcon
              icon={record.status === "ACTIVE" ? faLock : faLockOpen}
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

  // State giữ đối tượng được chọn hiện tại
  const [currentSelectedItem, setCurrentSelectedItem] =
    useState<DriverFormatType>();
  // State giữ hành động hiện tại
  const [currentAction, setCurrentAction] = useState<string>("list");
  // State giữ breadcrumb items hiện tại
  const [currentBreadcrumbItems, setCurrentBreadcrumbItems] =
    useState<Partial<BreadcrumbItemType & BreadcrumbSeparatorType>[]>();
  // State giữ card info hiện tại
  const [currentCardTitle, setCurrentCardTitle] = useState<string>(
    t("driver-list")
  );
  const [currentCardContent, setCurrentCardContent] = useState<string>("list");

  // Driver Actions
  const defaultLabels = {
    id: "Mã tài xế",
    username: "Tên tài khoản",
    password: "Mật khẩu",
    avatar: "Ảnh đại diện",
    full_name: "Họ và tên",
    birthday: "Ngày sinh",
    gender: "Giới tính",
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
    birthday: "Chọn Ngày sinh",
    gender: "Chọn Giới tính",
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

  const DriverDetail: React.FC<{ driver: DriverFormatType }> = ({ driver }) => {
    const [form] = Form.useForm<DriverNotFormatType>();

    return (
      <>
        <div className="driver-content detail">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              id: driver.id || undefined,
              username: driver.username || undefined,
              password: "Mật khẩu đã được mã hoá !",
              avatar: driver.avatar || undefined,
              full_name: driver.full_name || undefined,
              birthday: driver.birth_date
                ? dayjs(driver.birth_date, "DD/MM/YYYY")
                : undefined,
              gender: driver.gender || undefined,
              phone: driver.phone || undefined,
              email: driver.email || undefined,
              address: driver.address || undefined,
              status: driver.status || undefined,
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
                      driver.avatar
                        ? driver.avatar
                        : "/src/assets/images/others/no-image.png"
                    }
                    alt="image-preview"
                    imageClassName="image-preview"
                    imageCategoryName="drivers"
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
                <Form.Item name="full_name" label={defaultLabels.full_name}>
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
                  <Select
                    disabled
                    options={[
                      { label: "Hoạt động", value: "ACTIVE" },
                      { label: "Tạm dừng", value: "INACTIVE" },
                    ]}
                  />
                </Form.Item>
                <Form.Item name="password" label={defaultLabels.password}>
                  <Input disabled />
                </Form.Item>
                <Row className="split-2">
                  <Col>
                    <Form.Item name="birthday" label={defaultLabels.birthday}>
                      <DatePicker mode="date" format="DD/MM/YYYY" disabled />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item name="gender" label={defaultLabels.gender}>
                      <Select
                        disabled
                        options={[
                          { label: "Nam", value: "MALE" },
                          { label: "Nữ", value: "FEMALE" },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>
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
  const DriverCreate: React.FC = () => {
    const [form] = Form.useForm<DriverNotFormatType>();
    const [imageFile, setImageFile] = useState<RcFile>();

    const handleSubmit = async () => {
      const createResponse = await execute(
        createDriver({
          full_name: form.getFieldValue("full_name"),
          birth_date: formatByDate(form.getFieldValue("birthday")),
          gender: form.getFieldValue("gender"),
          phone: form.getFieldValue("phone"),
          email: form.getFieldValue("email"),
          address: form.getFieldValue("address"),
          status: form.getFieldValue("status"),
          username: form.getFieldValue("username"),
          password: form.getFieldValue("password"),
        }),
        true
      );
      notify(createResponse!, "Thêm tài xế thành công");
      if (createResponse?.result) {
        const driver_Id = createResponse.data.id;
        if (imageFile && driver_Id) {
          const formData = new FormData();
          formData.append("avatar", imageFile);
          const uploadResponse = await execute(
            uploadDriverAvatar(driver_Id, formData),
            false
          );
          notify(uploadResponse!, "Tải ảnh đại diện thành công");
        }
        handleGetData();
        setCurrentAction("list");
      }
    };

    useEffect(() => {
      form.setFieldValue("avatar", imageFile?.name);
    }, [imageFile]);

    return (
      <>
        <div className="driver-content create">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              id: undefined,
              username: undefined,
              password: undefined,
              avatar: undefined,
              full_name: undefined,
              birthday: undefined,
              gender: undefined,
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
                  rules={[ruleRequired("Ảnh đại diện không được để trống !")]}
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
                >
                  <Input placeholder={defaultInputs.full_name} />
                </Form.Item>
                <Form.Item
                  name="phone"
                  label={defaultLabels.phone}
                  rules={[
                    ruleRequired("Số điện thoại không được để trống !"),
                    rulePhone(),
                  ]}
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
                <Row className="split-2">
                  <Col>
                    <Form.Item
                      name="birthday"
                      htmlFor="create-birthday"
                      label={defaultLabels.birthday}
                      rules={[ruleRequired("Cần chọn Ngày sinh !")]}
                    >
                      <DatePicker
                        allowClear
                        mode="date"
                        format="DD/MM/YYYY"
                        id="create-birthday"
                        placeholder={defaultInputs.birthday}
                      />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      name="gender"
                      htmlFor="create-gender"
                      label={defaultLabels.gender}
                      rules={[ruleRequired("Cần chọn Giới tính !")]}
                    >
                      <Select
                        allowClear
                        id="create-gender"
                        placeholder={defaultInputs.gender}
                        options={[
                          {
                            label: CommonGenderValue.male,
                            value: "MALE",
                          },
                          {
                            label: CommonGenderValue.female,
                            value: "FEMALE",
                          },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  name="email"
                  label={defaultLabels.email}
                  rules={[ruleEmail()]}
                >
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
  const DriverUpdate: React.FC<{ driver: DriverFormatType }> = ({ driver }) => {
    const [form] = Form.useForm<DriverNotFormatType>();
    const [imageFile, setImageFile] = useState<RcFile>();

    const handleSubmit = async () => {
      const updateResponse = await execute(
        updateDriver(driver.id!, {
          full_name: form.getFieldValue("full_name"),
          birth_date: formatByDate(form.getFieldValue("birthday")),
          gender: form.getFieldValue("gender"),
          address: form.getFieldValue("address"),
          phone: form.getFieldValue("phone"),
          email: form.getFieldValue("email"),
        }),
        true
      );

      notify(updateResponse!, "Cập nhật tài xế thành công");
      if (updateResponse?.result && driver.id) {
        if (imageFile) {
          const formData = new FormData();
          formData.append("avatar", imageFile);
          const uploadResponse = await execute(
            uploadDriverAvatar(driver.id, formData),
            false
          );
          notify(uploadResponse!, "Cập nhật avatar tài xế thành công");
        }
        setCurrentAction("list");
        handleGetData();
      }
    };

    useEffect(() => {
      form.setFieldValue("avatar", imageFile?.name);
    }, [imageFile]);

    return (
      <>
        <div className="driver-content update">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              id: driver.id || undefined,
              avatar: driver.avatar || undefined,
              username: driver.username || undefined,
              password: "Mật khẩu đã được mã hoá !",
              full_name: driver.full_name || undefined,
              birthday: driver.birth_date
                ? dayjs(driver.birth_date, "DD/MM/YYYY")
                : undefined,
              gender: driver.gender || undefined,
              phone: driver.phone || undefined,
              email: driver.email || undefined,
              address: driver.address || undefined,
              status: driver.status || undefined,
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
                  // rules={[ruleRequired("Ảnh đại diện không được để trống !")]}
                >
                  <CustomUpload
                    defaultSrc={driver.avatar ? driver.avatar : ""}
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
                >
                  <Input placeholder={defaultInputs.full_name} />
                </Form.Item>
                <Form.Item
                  name="phone"
                  label={defaultLabels.phone}
                  rules={[
                    ruleRequired("Số điện thoại không được để trống !"),
                    rulePhone(),
                  ]}
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
                  <Select
                    disabled
                    options={[
                      { label: CommonStatusValue.active, value: "ACTIVE" },
                      { label: CommonStatusValue.inactive, value: "INACTIVE" },
                    ]}
                  />
                </Form.Item>
                <Form.Item name="password" label={defaultLabels.password}>
                  <Input disabled />
                </Form.Item>
                <Row className="split-2">
                  <Col>
                    <Form.Item
                      name="birthday"
                      htmlFor="update-birthday"
                      label={defaultLabels.birthday}
                      rules={[ruleRequired("Cần chọn Ngày sinh !")]}
                    >
                      <DatePicker
                        allowClear
                        mode="date"
                        format="DD/MM/YYYY"
                        id="update-birthday"
                        placeholder={defaultInputs.birthday}
                      />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      name="gender"
                      htmlFor="update-gender"
                      label={defaultLabels.gender}
                      rules={[ruleRequired("Cần chọn Giới tính !")]}
                    >
                      <Select
                        allowClear
                        id="update-gender"
                        placeholder={defaultInputs.gender}
                        options={[
                          {
                            label: CommonGenderValue.male,
                            value: "MALE",
                          },
                          {
                            label: CommonGenderValue.female,
                            value: "FEMALE",
                          },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  name="email"
                  label={defaultLabels.email}
                  rules={[ruleEmail()]}
                >
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
  const DriverLock: React.FC<{ driver: DriverFormatType }> = ({ driver }) => {
    const handleChangeStatus = async () => {
      const restResponse = await execute(
        updateDriver(driver.id!, {
          status: driver.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
        }),
        true
      );
      notify(
        restResponse!,
        `${driver.status === "ACTIVE" ? "Khoá" : "Mở khoá"} tài xế thành công`
      );
      if (restResponse?.result) {
        setCurrentAction("list");
        handleGetData();
      }
    };

    return (
      <>
        <Alert
          message={
            "Tài xế: " +
            "#" +
            driver?.id +
            " - " +
            driver?.full_name +
            " - " +
            driver?.phone
          }
          showIcon
          icon={
            <FontAwesomeIcon
              icon={driver?.status === "ACTIVE" ? faLock : faLockOpen}
            />
          }
          description={
            "Bạn có chắc chắc muốn" +
            (driver?.status === "ACTIVE" ? " khoá " : " mở khoá ") +
            "tài xế này ? Hành động không thể hoàn tác !"
          }
          type="error"
          action={
            <Button color="danger" variant="solid" onClick={handleChangeStatus}>
              Xác nhận
            </Button>
          }
        />
      </>
    );
  };
  const DriverChangePassword: React.FC<{ driver: DriverFormatType }> = ({
    driver,
  }) => {
    const [form] = Form.useForm<DriverNotFormatType>();

    const handleSubmitUpdate = async () => {
      const passwordData = validateAndGetPassword(
        form.getFieldsValue(),
        openNotification
      );
      if (!passwordData) return;

      const restResponse = await execute(
        updateDriver(driver.id!, passwordData),
        true
      );
      notify(restResponse!, "Cập nhật mật khẩu tài xế thành công");
      if (restResponse?.result) {
        setCurrentAction("list");
        handleGetData();
      }
    };

    return (
      <>
        <div className="driver-content change-password">
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
  const DriverActions = {
    detail: (selectedDriver: DriverFormatType) => (
      <DriverDetail driver={selectedDriver} />
    ),
    create: () => <DriverCreate />,
    update: (selectedDriver: DriverFormatType) => (
      <DriverUpdate driver={selectedDriver} />
    ),
    lock: (selectedDriver: DriverFormatType) => (
      <DriverLock driver={selectedDriver} />
    ),
    changePassword: (selectedDriver: DriverFormatType) => (
      <DriverChangePassword driver={selectedDriver} />
    ),
  };

  // Effect cập nhật Card Content
  useEffect(() => {
    if (currentAction === "list") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faChalkboardUser} />
              &nbsp;{t("driver-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("driver-list")}
            </span>
          ),
        },
      ]);
      setCurrentCardTitle(t("driver-list"));
      setCurrentCardContent("list");
    } else if (currentAction === "detail") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faChalkboardUser} />
              &nbsp;{t("driver-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("driver-list")}
            </span>
          ),
        },
        { title: <span>{t("driver-detail")}</span> },
      ]);
      setCurrentCardTitle(t("driver-detail"));
      setCurrentCardContent("detail");
    } else if (currentAction === "create") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faChalkboardUser} />
              &nbsp;{t("driver-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("driver-list")}
            </span>
          ),
        },
        { title: <span>{t("driver-create")}</span> },
      ]);
      setCurrentCardTitle(t("driver-create"));
      setCurrentCardContent("create");
    } else if (currentAction === "update") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faChalkboardUser} />
              &nbsp;{t("driver-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("driver-list")}
            </span>
          ),
        },
        { title: <span>{t("driver-update")}</span> },
      ]);
      setCurrentCardTitle(t("driver-update"));
      setCurrentCardContent("update");
    } else if (currentAction === "lock") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faChalkboardUser} />
              &nbsp;{t("driver-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("driver-list")}
            </span>
          ),
        },
        { title: <span>{t("driver-lock")}</span> },
      ]);
      setCurrentCardTitle(t("driver-lock"));
      setCurrentCardContent("lock");
    } else if (currentAction === "unlock") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faChalkboardUser} />
              &nbsp;{t("driver-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("driver-list")}
            </span>
          ),
        },
        { title: <span>{t("driver-unlock")}</span> },
      ]);
      setCurrentCardTitle(t("driver-unlock"));
      setCurrentCardContent("unlock");
    } else if (currentAction === "change-password") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faChalkboardUser} />
              &nbsp;{t("driver-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("driver-list")}
            </span>
          ),
        },
        { title: <span>{t("driver-change-password")}</span> },
      ]);
      setCurrentCardTitle(t("driver-change-password"));
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
            <div className="driver-data">
              <div className="admin-layout__main-filter">
                <div className="left">
                  <Input
                    prefix={<SearchOutlined />}
                    placeholder="Tìm theo họ và tên tài xế"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
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
                    value={statusFilter}
                    onChange={(value) => setStatusFilter(value)}
                  />
                  <Button
                    color="blue"
                    variant="filled"
                    icon={<ReloadOutlined />}
                    className="filter-reset"
                    onClick={() => {
                      setSearchText("");
                      setStatusFilter(undefined);
                    }}
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
                    {t("driver-create")}
                  </Button>
                </div>
              </div>
              <CustomTableActions<DriverFormatType>
                columns={columns}
                data={filteredDriverList || []}
                rowKey={(record) => String(record?.id)}
                // loading={isLoading}
                defaultPageSize={10}
                className="admin-layout__main-table table-data drivers"
              />
            </div>
          )}
          {currentCardContent === "detail" &&
            DriverActions.detail(currentSelectedItem!)}
          {currentCardContent === "create" && DriverActions.create()}
          {currentCardContent === "update" &&
            DriverActions.update(currentSelectedItem!)}
          {(currentCardContent === "lock" || currentCardContent === "unlock") &&
            DriverActions.lock(currentSelectedItem!)}
          {currentCardContent === "change-password" &&
            DriverActions.changePassword(currentSelectedItem!)}
        </Card>
      </div>
    </>
  );
};

export default DriverPage;
