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
import { ruleRequired, rulePassword } from "../../common/rules";
import { CommonGenderValue, CommonStatusValue } from "../../common/values";
import type { DriverNotFormatType, DriverFormatType } from "../../common/types";
import CustomUpload from "../../components/upload";
import CustomTableActions from "../../components/table-actions";
import { useNotification } from "../../utils/showNotification";
import dayjs from "dayjs";
import useCallApi from "../../api/useCall";
// import axios from "axios";
import {
  getDrivers,
  createDriver,
  updateDriver,
  uploadDriverAvatar,
} from "../../services/driver-service";

import noImg from "../../assets/images/others/no-image.png";

// Driver Page
const DriverPage = () => {
  // Language
  const { t } = useTranslation();

  // Notification
  const { openNotification } = useNotification();

  const { execute, notify } = useCallApi();

  const [driverData, setDriverData] = useState<DriverFormatType[]>([]);

  const getDataDriver = async () => {
    try {
      console.log("Gọi API getDrivers");
      const response = await execute(getDrivers());
      console.log("Kết quả từ execute:", response);

      if (response.result) {
        console.log("Data: ", response.data);

        if (response.result) {
          if (Array.isArray(response.data)) {
            setDriverData(
              response.data.map((driver) => ({
                ...driver,
                status: driver.status === "ACTIVE" ? "Hoạt động" : "Tạm dừng",
                gender: driver.gender === "MALE" ? "Nam" : "Nữ",
                birth_date: driver.birth_date
                  ? new Date(driver.birth_date).toLocaleDateString("vi-VN")
                  : "",
              }))
            );
          }
        }
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  useEffect(() => {
    getDataDriver();
  }, []);

  // Cấu hình bảng dữ liệu
  // const demoData: DriverFormatType[] = [
  //   {
  //     id: 1,
  //     user: {
  //       id: 1,
  //       role: "driver",
  //       username: "taixe1",
  //       password: "taixe1",
  //     },
  //     fullname: "Họ tên tài xế 1",
  //     birthday: "2025-01-01",
  //     gender: "Nữ",
  //     phone: "1234567890",
  //     email: "taixe1@gmail.com",
  //     address: "Địa chỉ ở đâu không biết",
  //     status: "Hoạt động",
  //   },
  //   {
  //     id: 2,
  //     user: {
  //       id: 2,
  //       role: "Driver",
  //       username: "taixe2",
  //       password: "taixe2",
  //     },
  //     fullname: "Họ tên tài xế 2",
  //     birthday: "2025-02-02",
  //     gender: "Nam",
  //     phone: "2234567890",
  //     email: "taixe2@gmail.com",
  //     address: "Địa chỉ ở đâu không biết",
  //     status: "Tạm dừng",
  //   },
  // ];

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
      width: "5%",
      render: (avatar: string) => (
        <Image
          src={
            avatar!
              ? "/src/assets/images/drivers/" + avatar
              : "/src/assets/images/others/no-image.png"
          }
          alt=""
        />
      ),
    },
    {
      title: "Họ và tên",
      dataIndex: "full_name",
      key: "full_name",
      width: "30%",
      sorter: (a, b) => a?.fullname!.localeCompare(b?.fullname!),
    },
    {
      title: "Ngày sinh",
      dataIndex: "birth_date",
      key: "birth_date",
      width: "10%",
      sorter: (a, b) => a?.birthday!.localeCompare(b?.birthday!),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      width: "10%",
      sorter: (a, b) => a?.gender!.localeCompare(b?.gender!),
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
      key: "status",
      render: (_: any, record: DriverFormatType) => (
        <Tag
          color={record.status === CommonStatusValue.active ? "green" : "red"}
        >
          {record.status}
        </Tag>
      ),
      sorter: (a, b) => (a.status || "").localeCompare(b.status || ""),
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

  // Driver Actions
  const defaultLabels = {
    id: "Mã tài xế",
    username: "Tên tài khoản",
    password: "Mật khẩu",
    avatar: "Ảnh đại diện",
    fullname: "Họ và tên",
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
    fullname: "Nhập Họ và tên",
    birthday: "Chọn Ngày sinh",
    gender: "Chọn Giới tính",
    phone: "Nhập Số điện thoại",
    email: "Nhập Email",
    address: "Nhập Địa chỉ",
    status: "Chọn Trạng thái",
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
              username: driver.user?.username || undefined,
              password: "Mật khẩu đã được mã hoá !",
              avatar: driver.avatar || undefined,
              fullname: driver.full_name || undefined,
              birthday: driver.birth_date
                ? dayjs(driver.birth_date)
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
                    defaultSrc={driver.avatar! as string}
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
                <Form.Item name="fullname" label={defaultLabels.fullname}>
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
                <Row className="split-2">
                  <Col>
                    <Form.Item name="birthday" label={defaultLabels.birthday}>
                      <DatePicker disabled />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item name="gender" label={defaultLabels.gender}>
                      <Select disabled />
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
      const genderValue =
        form.getFieldValue("gender") === "Nam" ? "MALE" : "FEMALE";

      const statusValue =
        form.getFieldValue("status") === "Hoạt động"
          ? "ACTIVE"
          : form.getFieldValue("status") === "Tạm dừng"
          ? "INACTIVE"
          : "ACTIVE";

      const birthDateValue = form.getFieldValue("birth_date")
        ? new Date(form.getFieldValue("birth_date")).toISOString()
        : new Date("2000-01-01").toISOString();

      const avatarUrl = imageFile?.name ?? noImg;

      const createResponse = await execute(
        createDriver({
          avatar: avatarUrl,
          full_name: form.getFieldValue("full_name"),
          birth_date: birthDateValue,
          gender: genderValue,
          phone: form.getFieldValue("phone"),
          email: form.getFieldValue("email"),
          address: form.getFieldValue("address"),
          username: form.getFieldValue("username"),
          password: form.getFieldValue("password"),
          status: statusValue,
        })
      );

      notify(createResponse!, "Thêm driver thành công");

      if (createResponse?.result) {
        const driverID = createResponse.data.id;
        if (imageFile && driverID) {
          const formData = new FormData();
          formData.append("avatar", imageFile);
          const uploadResponse = await execute(
            uploadDriverAvatar(driverID, formData)
          );
          notify(uploadResponse!, "Tải ảnh đại diện driver thành công");
          if (uploadResponse?.result) {
            setCurrentAction("list");
            getDataDriver();
          }
        }
      }
    };

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
              fullname: undefined,
              birthday: undefined,
              gender: undefined,
              phone: undefined,
              email: undefined,
              address: undefined,
              status: undefined,
            }}
            onFinish={() => {
              handleSubmit();
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
                  // rules={[ruleRequired("Ảnh đại diện không được để trống !")]}
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
                  label={defaultLabels.fullname}
                  rules={[ruleRequired("Họ và tên không được để trống !")]}
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
                  rules={[rulePassword("Mật khẩu quá ngắn !")]}
                >
                  <Input placeholder={defaultInputs.password} />
                </Form.Item>
                <Row className="split-2">
                  <Col>
                    <Form.Item
                      name="birth_date"
                      htmlFor="create-birthday"
                      label={defaultLabels.birthday}
                      rules={[ruleRequired("Cần chọn Ngày sinh !")]}
                    >
                      <DatePicker
                        allowClear
                        mode="date"
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
                            value: CommonGenderValue.male,
                          },
                          {
                            label: CommonGenderValue.female,
                            value: CommonGenderValue.female,
                          },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>
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
  const DriverUpdate: React.FC<{ driver: DriverFormatType }> = ({ driver }) => {
    const [form] = Form.useForm<DriverNotFormatType>();
    const [imageFile, setImageFile] = useState<RcFile>();

    // useEffect(() => {
    //   form.setFieldValue("avatar", imageFile?.name);
    // }, [imageFile]);
    const genderValue =
      form.getFieldValue("gender") === "Nam" ? "MALE" : "FEMALE";

    const birthDateValue = form.getFieldValue("birth_date")
      ? new Date(form.getFieldValue("birth_date")).toISOString()
      : new Date("2000-01-01").toISOString();

    const avatarUrl = imageFile?.name ?? noImg;

    const handleSubmitUpdate = async () => {
      // console.log("hello4");
      const updateResponse = await execute(
        updateDriver(driver.id!, {
          avatar: avatarUrl,
          full_name: form.getFieldValue("full_name"),
          gender: genderValue,
          birth_date: birthDateValue,
          phone: form.getFieldValue("phone"),
          email: form.getFieldValue("email"),
          address: form.getFieldValue("address"),
        })
      );
      // console.log("hello5");
      notify(updateResponse!, "Cập nhật phụ huynh thành công");
      if (updateResponse?.result && driver.id) {
        if (imageFile) {
          const formData = new FormData();
          formData.append("avatar", imageFile);
          const uploadResponse = await execute(
            uploadDriverAvatar(driver.id!, formData)
          );
          notify(uploadResponse!, "Tải ảnh đại diện phụ huynh thành công");
        }
        setCurrentAction("list");
        getDataDriver();
      }
    };

    return (
      <>
        <div className="driver-content update">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              id: driver.id || undefined,
              username: driver.user?.username || undefined,
              password: "Mật khẩu đã được mã hoá !",
              avatar: driver.avatar || undefined,
              full_name: driver.full_name || undefined,
              birthday: driver.birth_date
                ? dayjs(driver.birth_date)
                : undefined,
              gender: driver.gender || undefined,
              phone: driver.phone || undefined,
              email: driver.email || undefined,
              address: driver.address || undefined,
              status: driver.status || undefined,
            }}
            // onFinish={() => {
            //   console.log("Form values:", form.getFieldsValue());
            // }}
            onFinish={handleSubmitUpdate}
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
                  label={defaultLabels.fullname}
                  rules={[ruleRequired("Họ và tên không được để trống !")]}
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
                            value: CommonGenderValue.male,
                          },
                          {
                            label: CommonGenderValue.female,
                            value: CommonGenderValue.female,
                          },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>
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
  const DriverLock: React.FC<{ driver: DriverFormatType }> = ({ driver }) => {
    const handleChangeStatus = async () => {
      const restResponse = await execute(
        updateDriver(driver.id!, {
          gender:
            driver.gender === "Nam"
              ? "MALE"
              : driver.gender === "Nữ"
              ? "FEMALE"
              : driver.gender,
          status:
            driver.status === CommonStatusValue.active ? "INACTIVE" : "ACTIVE",
        })
      );
      notify(
        restResponse!,
        `${
          driver.status === CommonStatusValue.active ? "Khoá" : "Mở khoá"
        } phụ huynh thành công`
      );
      if (restResponse?.result) {
        setCurrentAction("list");
        getDataDriver();
      }
    };
    return (
      <>
        <Alert
          message={
            "Học sinh: " +
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
              icon={
                driver?.status === CommonStatusValue.active
                  ? faLock
                  : faLockOpen
              }
            />
          }
          description={
            "Bạn có chắc chắc muốn" +
            (driver?.status === CommonStatusValue.active
              ? " khoá "
              : " mở khoá ") +
            "tài xế này ? Hành động không thể hoàn tác !"
          }
          type="error"
          action={
            <Button
              color="danger"
              variant="solid"
              onClick={() => {
                handleChangeStatus();
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
        updateDriver(driver.id!, passwordData)
      );
      notify(restResponse!, "Cập nhật mật khẩu phụ huynh thành công");
      if (restResponse?.result) {
        setCurrentAction("list");
        getDataDriver();
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
            onFinish={() => {
              handleSubmitUpdate();
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
                    {t("driver-create")}
                  </Button>
                </div>
              </div>
              <CustomTableActions<DriverFormatType>
                columns={columns}
                data={driverData || []}
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
