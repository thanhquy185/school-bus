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
  DatePicker,
  Alert,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faLock,
  faLockOpen,
  faPenToSquare,
  faUserGraduate,
} from "@fortawesome/free-solid-svg-icons";
import type { RcFile } from "antd/es/upload";
import type { ColumnsType } from "antd/es/table";
import type {
  BreadcrumbItemType,
  BreadcrumbSeparatorType,
} from "antd/es/breadcrumb/Breadcrumb";
import { ruleRequired } from "../../common/rules";
import { CommonGenderValue, CommonStatusValue } from "../../common/values";
import type {
  StudentFormatType,
  StudentNotFormatType,
} from "../../common/types";
import CustomUpload from "../../components/upload";
import CustomTableActions from "../../components/table-actions";
import { useNotification } from "../../utils/showNotification";
import dayjs from "dayjs";

// Student Page
const StudentPage = () => {
  // Language
  const { t } = useTranslation();

  // Notification
  const { openNotification } = useNotification();

  // Cấu hình bảng dữ liệu (sau cập nhật lọc giới tính, phụ huynh, trạm và lớp)
  const demoData: StudentFormatType[] = [
    {
      id: "1",
      parent: {
        id: 1,
        fullname: "Phụ huynh 1",
      },
      pickup: {
        id: 1,
        name: "Trạm 1",
      },
      class: {
        id: 1,
        name: "Lớp 10A1",
      },
      avatar: "test-1.png",
      fullname: "Học sinh 1",
      birthday: "01/01/2025",
      gender: "Nam",
      address: "Địa chỉ ở đâu không biết",
      status: "Hoạt động",
    },
    {
      id: "2",
      parent: {
        id: 2,
        fullname: "Phụ huynh 2",
      },
      pickup: {
        id: 2,
        name: "Trạm 2",
      },
      class: {
        id: 2,
        name: "Lớp 10A2",
      },
      avatar: "test-2.png",
      fullname: "Học sinh 2",
      birthday: "02/02/2025",
      gender: "Nam",
      address: "Địa chỉ ở đâu không biết",
      status: "Tạm dừng",
    },
  ];
  const columns: ColumnsType<StudentFormatType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: "8%",
      sorter: (a, b) => a?.id!.localeCompare(b?.id!),
    },
    {
      title: "Hình ảnh",
      dataIndex: "avatar",
      key: "avatar",
      width: "8%",
      render: (avatar: string) => (
        <Image
          src={
            avatar!
              ? "/src/assets/images/students/" + avatar
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
      width: "20%",
      sorter: (a, b) => a?.fullname!.localeCompare(b?.fullname!),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      width: "8%",
      sorter: (a, b) => a?.gender!.localeCompare(b?.gender!),
    },
    {
      title: "Phụ huynh",
      key: "parent",
      width: "14%",
      render: (record: StudentFormatType) =>
        "#" + record.parent?.id + " - " + record.parent?.fullname,
    },
    {
      title: "Trạm",
      key: "pickup",
      width: "14%",
      render: (record: StudentFormatType) =>
        "#" + record.pickup?.id + " - " + record.pickup?.name,
    },
    {
      title: "Lớp",
      key: "class",
      width: "8%",
      render: (record: StudentFormatType) =>
        "#" + record.class?.id + " - " + record.class?.name,
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
        </div>
      ),
      width: "10%",
      className: "actions",
    },
  ];

  // State giữ đối tượng được chọn hiện tại
  const [currentSelectedItem, setCurrentSelectedItem] =
    useState<StudentFormatType>();
  // State giữ hành động hiện tại
  const [currentAction, setCurrentAction] = useState<string>("list");
  // State giữ breadcrumb items hiện tại
  const [currentBreadcrumbItems, setCurrentBreadcrumbItems] =
    useState<Partial<BreadcrumbItemType & BreadcrumbSeparatorType>[]>();
  // State giữ card info hiện tại
  const [currentCardTitle, setCurrentCardTitle] = useState<string>(
    t("student-list")
  );
  const [currentCardContent, setCurrentCardContent] = useState<string>("list");

  // Student Actions
  const defaultLabels = {
    id: "Mã học sinh",
    avatar: "Ảnh đại diện",
    parent: "Phụ huynh",
    pickup: "Trạm xe buýt",
    class: "Lớp",
    fullname: "Họ và tên",
    birthday: "Ngày sinh",
    gender: "Giới tính",
    address: "Địa chỉ",
    status: "Trạng thái",
  };
  const defaultInputs = {
    id: "Nhập Mã học sinh",
    parent: "Chọn Phụ huynh",
    pickup: "Chọn Trạm xe buýt",
    class: "Chọn Lớp",
    avatar: "Tải ảnh lên",
    fullname: "Nhập Họ và tên",
    birthday: "Chọn Ngày sinh",
    gender: "Chọn Giới tính",
    address: "Nhập Địa chỉ",
    status: "Chọn Trạng thái",
  };
  const StudentDetail: React.FC<{ student: StudentFormatType }> = ({
    student,
  }) => {
    const [form] = Form.useForm<StudentNotFormatType>();

    return (
      <>
        <div className="student-content detail">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              id: student.id || undefined,
              parent: student.parent?.id || undefined,
              pickup: student.pickup?.id || undefined,
              class: student.class?.id || undefined,
              avatar: student.avatar || undefined,
              fullname: student.fullname || undefined,
              birthday: student.birthday ? dayjs(student.birthday) : undefined,
              gender: student.gender || undefined,
              address: student.address || undefined,
              status: student.status || undefined,
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
                    defaultSrc={student.avatar! as string}
                    alt="image-preview"
                    imageClassName="image-preview"
                    imageCategoryName="students"
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
                <Form.Item name="parent" label={defaultLabels.parent}>
                  <Select
                    options={[
                      {
                        label:
                          student.parent?.id + " - " + student.parent?.fullname,
                        value: student.parent?.id,
                      },
                    ]}
                    disabled
                  />
                </Form.Item>
                <Form.Item
                  name="fullname"
                  label={defaultLabels.fullname}
                  className="multiple-2"
                >
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
                <Form.Item name="pickup" label={defaultLabels.pickup}>
                  <Select
                    options={[
                      {
                        label:
                          student.pickup?.id + " - " + student.pickup?.name,
                        value: student.pickup?.id,
                      },
                    ]}
                    disabled
                  />
                </Form.Item>
                <Form.Item label="." className="hidden">
                  <Input />
                </Form.Item>
                <Form.Item name="class" label={defaultLabels.class}>
                  <Select
                    options={[
                      {
                        label: student.class?.id + " - " + student.class?.name,
                        value: student.class?.id,
                      },
                    ]}
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </>
    );
  };
  const StudentCreate: React.FC = () => {
    const [form] = Form.useForm<StudentNotFormatType>();
    const [imageFile, setImageFile] = useState<RcFile>();

    useEffect(() => {
      form.setFieldValue("avatar", imageFile?.name);
    }, [imageFile]);

    return (
      <>
        <div className="student-content create">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              id: undefined,
              parent: undefined,
              pickup: undefined,
              class: undefined,
              avatar: undefined,
              fullname: undefined,
              birthday: undefined,
              gender: undefined,
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
                  htmlFor="create-id"
                  label={defaultLabels.id}
                  rules={[ruleRequired("Mã học sinh không được để trống !")]}
                >
                  <Input id="create-id" placeholder={defaultInputs.id} />
                </Form.Item>
                <Form.Item
                  name="parent"
                  htmlFor="create-parent"
                  label={defaultLabels.parent}
                  rules={[ruleRequired("Phụ huynh không được để trống !")]}
                >
                  <Select
                    showSearch
                    allowClear
                    id="create-parent"
                    placeholder={defaultInputs.parent}
                    options={[
                      {
                        label: "#1 - Họ tên phụ huynh 1 - SĐT 1",
                        value: 1,
                      },
                      {
                        label: "#2 - Họ tên phụ huynh 2 - SĐT 2",
                        value: 2,
                      },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  name="fullname"
                  htmlFor="create-fullname"
                  label={defaultLabels.fullname}
                  className="multiple-2"
                  rules={[ruleRequired("Họ và tên không được để trống !")]}
                >
                  <Input
                    id="create-fullname"
                    placeholder={defaultInputs.fullname}
                  />
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
                <Form.Item
                  name="address"
                  htmlFor="create-address"
                  label={defaultLabels.address}
                  className="multiple-2"
                  rules={[ruleRequired("Địa chỉ không được để trống !")]}
                >
                  <Input
                    id="create-address"
                    placeholder={defaultInputs.address}
                  />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  name="status"
                  htmlFor="create-status"
                  label={defaultLabels.status}
                  rules={[ruleRequired("Trạng thái không được để trống !")]}
                >
                  <Select
                    allowClear
                    id="create-status"
                    placeholder={defaultInputs.status}
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
                  />
                </Form.Item>
                <Form.Item
                  name="pickup"
                  htmlFor="create-pickup"
                  label={defaultLabels.pickup}
                  rules={[ruleRequired("Trạm xe buýt không được để trống !")]}
                >
                  <Select
                    showSearch
                    allowClear
                    id="create-pickup"
                    placeholder={defaultInputs.pickup}
                    options={[
                      {
                        label: "#1 - Trạm 1123",
                        value: 1,
                      },
                      {
                        label: "#2 - Trạm 12418",
                        value: 2,
                      },
                    ]}
                  />
                </Form.Item>
                <Form.Item label="." className="hidden">
                  <Input />
                </Form.Item>
                <Form.Item
                  name="class"
                  htmlFor="create-class"
                  label={defaultLabels.class}
                  rules={[ruleRequired("Lớp không được để trống !")]}
                >
                  <Select
                    showSearch
                    allowClear
                    id="create-class"
                    placeholder={defaultInputs.class}
                    options={[
                      {
                        label: "Lớp 10C1",
                        value: 1,
                      },
                      {
                        label: "Lớp 12A1",
                        value: 2,
                      },
                    ]}
                  />
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
  const StudentUpdate: React.FC<{ student: StudentFormatType }> = ({
    student,
  }) => {
    const [form] = Form.useForm<StudentNotFormatType>();
    const [imageFile, setImageFile] = useState<RcFile>();

    useEffect(() => {
      form.setFieldValue("avatar", imageFile?.name);
    }, [imageFile]);

    return (
      <>
        <div className="student-content update">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              id: student.id || undefined,
              parent: student.parent?.id || undefined,
              pickup: student.pickup?.id || undefined,
              class: student.class?.id || undefined,
              avatar: student.avatar || undefined,
              fullname: student.fullname || undefined,
              birthday: student.birthday ? dayjs(student.birthday) : undefined,
              gender: student.gender || undefined,
              address: student.address || undefined,
              status: student.status || undefined,
            }}
            onFinish={() => {
              console.log("Form values:", form.getFieldsValue());
            }}
          >
            <Row className="split-3">
              <Col>
                <Form.Item
                  name="avatar"
                  htmlFor="update-avatar"
                  label={defaultLabels.avatar}
                  valuePropName="fileList"
                  rules={[ruleRequired("Ảnh đại diện không được để trống !")]}
                >
                  <CustomUpload
                    defaultSrc={
                      student.avatar ? student.avatar : "no-image.png"
                    }
                    imageFile={imageFile}
                    setImageFile={setImageFile}
                    alt="image-preview"
                    htmlFor="update-avatar"
                    imageCategoryName="students"
                    imageClassName="image-preview"
                    uploadClassName="image-uploader"
                    labelButton={defaultInputs.avatar}
                  />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item name="id" label={defaultLabels.id}>
                  <Input disabled />
                </Form.Item>
                <Form.Item
                  name="parent"
                  htmlFor="update-parent"
                  label={defaultLabels.parent}
                  rules={[ruleRequired("Phụ huynh không được để trống !")]}
                >
                  <Select
                    showSearch
                    allowClear
                    id="update-parent"
                    placeholder={defaultInputs.parent}
                    options={[
                      {
                        label: "#1 - Họ tên phụ huynh 1 - SĐT 1",
                        value: 1,
                      },
                      {
                        label: "#2 - Họ tên phụ huynh 2 - SĐT 2",
                        value: 2,
                      },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  name="fullname"
                  htmlFor="update-fullname"
                  label={defaultLabels.fullname}
                  className="multiple-2"
                  rules={[ruleRequired("Họ và tên không được để trống !")]}
                >
                  <Input
                    id="update-fullname"
                    placeholder={defaultInputs.fullname}
                  />
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
                <Form.Item
                  name="address"
                  htmlFor="update-address"
                  label={defaultLabels.address}
                  className="multiple-2"
                  rules={[ruleRequired("Địa chỉ không được để trống !")]}
                >
                  <Input
                    id="update-address"
                    placeholder={defaultInputs.address}
                  />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item name="status" label={defaultLabels.status}>
                  <Select disabled />
                </Form.Item>
                <Form.Item
                  name="pickup"
                  htmlFor="update-pickup"
                  label={defaultLabels.pickup}
                  rules={[ruleRequired("Trạm xe buýt không được để trống !")]}
                >
                  <Select
                    showSearch
                    allowClear
                    id="update-pickup"
                    placeholder={defaultInputs.pickup}
                    options={[
                      {
                        label: "#1 - Trạm 1",
                        value: 1,
                      },
                      {
                        label: "#2 - Trạm 2",
                        value: 2,
                      },
                    ]}
                  />
                </Form.Item>
                <Form.Item label="." className="hidden">
                  <Input />
                </Form.Item>
                <Form.Item
                  name="class"
                  htmlFor="update-class"
                  label={defaultLabels.class}
                  rules={[ruleRequired("Lớp không được để trống !")]}
                >
                  <Select
                    showSearch
                    allowClear
                    id="update-class"
                    placeholder={defaultInputs.class}
                    options={[
                      {
                        label: "#1 - Lớp 1",
                        value: 1,
                      },
                      {
                        label: "#2 - Lớp 2",
                        value: 2,
                      },
                    ]}
                  />
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
  const StudentLock: React.FC<{ student: StudentFormatType }> = ({
    student,
  }) => {
    return (
      <>
        <Alert
          message={
            "Học sinh: " +
            "#" +
            student?.id +
            " - " +
            student?.fullname +
            " - " +
            student?.class?.name
          }
          showIcon
          icon={
            <FontAwesomeIcon
              icon={
                student?.status === CommonStatusValue.active
                  ? faLock
                  : faLockOpen
              }
            />
          }
          description={
            "Bạn có chắc chắc muốn" +
            (student?.status === CommonStatusValue.active
              ? " khoá "
              : " mở khoá ") +
            "học sinh này ? Hành động không thể hoàn tác !"
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
  const StudentActions = {
    detail: (selectedStudent: StudentFormatType) => (
      <StudentDetail student={selectedStudent} />
    ),
    create: () => <StudentCreate />,
    update: (selectedStudent: StudentFormatType) => (
      <StudentUpdate student={selectedStudent} />
    ),
    lock: (selectedStudent: StudentFormatType) => (
      <StudentLock student={selectedStudent} />
    ),
  };

  // Effect cập nhật Card Content
  useEffect(() => {
    if (currentAction === "list") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faUserGraduate} />
              &nbsp;{t("student-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("student-list")}
            </span>
          ),
        },
      ]);
      setCurrentCardTitle(t("student-list"));
      setCurrentCardContent("list");
    } else if (currentAction === "detail") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faUserGraduate} />
              &nbsp;{t("student-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("student-list")}
            </span>
          ),
        },
        { title: <span>{t("student-detail")}</span> },
      ]);
      setCurrentCardTitle(t("student-detail"));
      setCurrentCardContent("detail");
    } else if (currentAction === "create") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faUserGraduate} />
              &nbsp;{t("student-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("student-list")}
            </span>
          ),
        },
        { title: <span>{t("student-create")}</span> },
      ]);
      setCurrentCardTitle(t("student-create"));
      setCurrentCardContent("create");
    } else if (currentAction === "update") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faUserGraduate} />
              &nbsp;{t("student-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("student-list")}
            </span>
          ),
        },
        { title: <span>{t("student-update")}</span> },
      ]);
      setCurrentCardTitle(t("student-update"));
      setCurrentCardContent("update");
    } else if (currentAction === "lock") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faUserGraduate} />
              &nbsp;{t("student-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("student-list")}
            </span>
          ),
        },
        { title: <span>{t("student-lock")}</span> },
      ]);
      setCurrentCardTitle(t("student-lock"));
      setCurrentCardContent("lock");
    } else if (currentAction === "unlock") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faUserGraduate} />
              &nbsp;{t("student-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("student-list")}
            </span>
          ),
        },
        { title: <span>{t("student-unlock")}</span> },
      ]);
      setCurrentCardTitle(t("student-unlock"));
      setCurrentCardContent("unlock");
    }
  }, [currentAction]);

  return (
    <div className="admin-layout__main-content">
      {/* Breadcrumb */}
      <Breadcrumb
        items={currentBreadcrumbItems}
        className="admin-layout__main-breadcrumb"
      />
      {/* Card */}
      <Card title={currentCardTitle} className="admin-layout__main-card">
        {currentCardContent === "list" && (
          <div className="student-data">
            <div className="admin-layout__main-filter">
              <div className="left">
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="Tìm theo họ và tên học sinh"
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
                  {t("student-create")}
                </Button>
              </div>
            </div>
            <CustomTableActions<StudentFormatType>
              columns={columns}
              data={demoData || []}
              rowKey={(record) => String(record?.id)}
              // loading={isLoading}
              defaultPageSize={10}
              className="admin-layout__main-table table-data students"
            />
          </div>
        )}
        {currentCardContent === "detail" &&
          StudentActions.detail(currentSelectedItem!)}
        {currentCardContent === "create" && StudentActions.create()}
        {currentCardContent === "update" &&
          StudentActions.update(currentSelectedItem!)}
        {(currentCardContent === "lock" || currentCardContent === "unlock") &&
          StudentActions.lock(currentSelectedItem!)}
      </Card>
    </div>
  );
};

export default StudentPage;
