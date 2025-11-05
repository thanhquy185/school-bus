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
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faLock,
  faLockOpen,
  faPenToSquare,
  faPlus,
  faUserGraduate,
} from "@fortawesome/free-solid-svg-icons";
import type { RcFile } from "antd/es/upload";
import type { ColumnsType } from "antd/es/table";
import type {
  BreadcrumbItemType,
  BreadcrumbSeparatorType,
} from "antd/es/breadcrumb/Breadcrumb";
import { ruleRequired } from "../../common/rules";
import { CommonGenderValue, CommonStatusValue, StudentStatusValue } from "../../common/values";
import type {
  StudentFormatType,
  StudentNotFormatType,
} from "../../common/types";
import CustomUpload from "../../components/upload";
import CustomTableActions from "../../components/table-actions";
import { useNotification } from "../../utils/showNotification";
import dayjs from "dayjs";
import useCallApi from "../../api/useCall";
import { createStudent, getStudents, updateStudent, uploadStudentAvatar } from "../../services/student-service";
import { formatByString } from "../../utils/format-day";
import { getGenderText, getStudentStatusText } from "../../utils/vi-trans";
import { getParents } from "../../services/parent-service";
import { getPickups } from "../../services/pickup-service";
import { getClasses } from "../../services/class-service";

const StudentPage = () => {
  const { execute, notify } = useCallApi();
  const { t } = useTranslation();
  const { openNotification } = useNotification();

  const [students, setStudents] = useState<StudentFormatType[]>([]);
  const [parents, setParents] = useState<any[]>([]);
  const [pickups, setPickups] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);

  const handleGetData = async () => {
    const [studentRes, parentRes, pickupRes, classRes] = await Promise.all([
      execute(getStudents()),
      execute(getParents()),
      execute(getPickups()),
      execute(getClasses()),
    ]);

    if (studentRes?.result && Array.isArray(studentRes.data)) {
      console.log(studentRes.data);
      setStudents(studentRes.data as StudentFormatType[]);
    }

    if (parentRes?.result && Array.isArray(parentRes.data)) {
      setParents(parentRes.data);
    }

    if (pickupRes?.result && Array.isArray(pickupRes.data)) {
      setPickups(pickupRes.data);
    }

    if (classRes?.result && Array.isArray(classRes.data)) {
      setClasses(classRes.data);
    }
  }

  useEffect(() => {
    handleGetData();
  }, []);

  const columns: ColumnsType<StudentFormatType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: "8%",
      sorter: (a, b) => (a?.id?.toString() ?? "").localeCompare(b?.id?.toString() ?? ""),
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
              ? avatar
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
      width: "20%",
      sorter: (a, b) => a?.full_name!.localeCompare(b?.full_name!),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      width: "8%",
      render: (gender: string) => getGenderText(gender),
      sorter: (a, b) => a?.gender!.localeCompare(b?.gender!),
    },
    {
      title: "Phụ huynh",
      key: "parent",
      width: "14%",
      render: (record: StudentFormatType) =>
        "#" + record.parent?.id + " - " + record.parent?.full_name,
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
        <Tag color={status === "STUDYING" ? "green" : status === "DROPPED_OUT" ? "red" : "orange"}>
          {getStudentStatusText(status)}
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

  const [currentSelectedItem, setCurrentSelectedItem] =
    useState<StudentFormatType>();
  const [currentAction, setCurrentAction] = useState<string>("list");
  const [currentBreadcrumbItems, setCurrentBreadcrumbItems] =
    useState<Partial<BreadcrumbItemType & BreadcrumbSeparatorType>[]>();
  const [currentCardTitle, setCurrentCardTitle] = useState<string>(
    t("student-list")
  );
  const [currentCardContent, setCurrentCardContent] = useState<string>("list");

  const defaultLabels = {
    id: "Mã học sinh",
    avatar: "Ảnh đại diện",
    parent: "Phụ huynh",
    pickup: "Trạm xe buýt",
    class: "Lớp",
    full_name: "Họ và tên",
    birth_date: "Ngày sinh",
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
    full_name: "Nhập Họ và tên",
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
              parentId: student.parent?.id || undefined,
              pickup: student.pickup?.id || undefined,
              class: student.class?.id || undefined,
              avatar: student.avatar || undefined,
              full_name: student.full_name || undefined,
              birth_date: student.birth_date ? dayjs(student.birth_date) : undefined,
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
                <Form.Item name="parentId" label={defaultLabels.parent}>
                  <Select
                    options={[
                      {
                        label:
                          student.parent?.id + " - " + student.parent?.full_name,
                        value: student.parent?.id,
                      },
                    ]}
                    disabled
                  />
                </Form.Item>
                <Form.Item
                  name="full_name"
                  label={defaultLabels.full_name}
                  className="multiple-2"
                >
                  <Input disabled />
                </Form.Item>
                <Row className="split-2">
                  <Col>
                    <Form.Item name="birth_date" label={defaultLabels.birth_date}>
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
                  <Select disabled
                   options={[
                     {
                       label: StudentStatusValue.studying,
                       value: "STUDYING",
                     },
                     {
                       label: StudentStatusValue.dropped_out,
                       value: "DROPPED_OUT",
                     },
                     {
                       label: StudentStatusValue.unknown,
                       value: "UNKNOWN",
                     },
                   ]}
                  />
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

    const handleSubmit = async () => {
      const createResponse = await execute(createStudent({
        fullName: form.getFieldValue("full_name"),
        birthDate: formatByString(form.getFieldValue("birth_date")),
        gender: form.getFieldValue("gender"),
        address: form.getFieldValue("address"),
        status: form.getFieldValue("status"),
        parentId: form.getFieldValue("parentId"),
        classId: form.getFieldValue("classId"),
        pickupId: form.getFieldValue("pickupId"),
      }));
      notify(createResponse!, "Thêm học sinh thành công !");
      if (createResponse?.result) {
        const studentId = createResponse.data.id;
        if (imageFile && studentId) {
          const formData = new FormData();
          formData.append("avatar", imageFile);
          const uploadResponse = await execute(uploadStudentAvatar(studentId, formData));
          notify(uploadResponse!, "Tải ảnh đại diện thành công !");
          if (uploadResponse?.result) {
            setCurrentAction("list");
            handleGetData();
          }
        }
      }
    }

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
              parentId: undefined,
              pickupId: undefined,
              classId: undefined,
              avatar: undefined,
              fullname: undefined,
              birthday: undefined,
              gender: undefined,
              address: undefined,
              status: undefined,
            }}
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
                  htmlFor="create-id"
                  label={defaultLabels.id}
                >
                  <Input id="create-id" placeholder={defaultInputs.id} disabled value={"Mã học sinh sẽ được tự tạo"} />
                </Form.Item>
                <Form.Item
                  name="parentId"
                  htmlFor="create-parent"
                  label={defaultLabels.parent}
                  rules={[ruleRequired("Phụ huynh không được để trống !")]}
                >
                  <Select
                    showSearch
                    allowClear
                    id="create-parent"
                    placeholder={defaultInputs.parent}
                    options={parents.map(parent => ({
                      label: `# ${parent.id} - ${parent.full_name}`,
                      value: parent.id,
                    }))}
                  />
                </Form.Item>
                <Form.Item
                  name="fullname"
                  htmlFor="create-fullname"
                  label={defaultLabels.full_name}
                  className="multiple-2"
                  rules={[ruleRequired("Họ và tên không được để trống !")]}
                >
                  <Input
                    id="create-fullname"
                    placeholder={defaultInputs.full_name}
                  />
                </Form.Item>
                <Row className="split-2">
                  <Col>
                    <Form.Item
                      name="birth_date"
                      htmlFor="create-birth_date"
                      label={defaultLabels.birth_date}
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
                        label: StudentStatusValue.studying,
                        value: "STUDYING",
                      },
                      {
                        label: StudentStatusValue.dropped_out,
                        value: "DROPPED_OUT",
                      },
                      {
                        label: StudentStatusValue.unknown,
                        value: "UNKNOWN",
                      },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  name="pickupId"
                  htmlFor="create-pickup"
                  label={defaultLabels.pickup}
                  rules={[ruleRequired("Trạm xe buýt không được để trống !")]}
                >
                  <Select
                    showSearch
                    allowClear
                    id="create-pickup"
                    placeholder={defaultInputs.pickup}
                    options={pickups.map(pickup => ({
                      label: `# ${pickup.id} - ${pickup.name}`,
                      value: pickup.id,
                    }))}
                  />
                </Form.Item>
                <Form.Item label="." className="hidden">
                  <Input />
                </Form.Item>
                <Form.Item
                  name="classId"
                  htmlFor="create-class"
                  label={defaultLabels.class}
                  rules={[ruleRequired("Lớp không được để trống !")]}
                >
                  <Select
                    showSearch
                    allowClear
                    id="create-class"
                    placeholder={defaultInputs.class}
                    options={classes.map(classItem => ({
                      label: `# ${classItem.id} - ${classItem.name}`,
                      value: classItem.id,
                    }))}
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

    const handleSubmitUpdate = async () => {
      const updateResponse = await execute(updateStudent(student.id!, {
        fullName: form.getFieldValue("full_name"),
        birthDate: formatByString(form.getFieldValue("birth_date")),
        gender: form.getFieldValue("gender"),
        address: form.getFieldValue("address"),

        pickupId: form.getFieldValue("pickupId"),
        classId: form.getFieldValue("classId"),
        parentId: form.getFieldValue("parentId"),
      }));
      notify(updateResponse!, "Cập nhật học sinh thành công !");
      if (updateResponse?.result) {
        if (imageFile && student.id) {
          const formData = new FormData();
          formData.append("avatar", imageFile);
           const uploadResponse = await execute(uploadStudentAvatar(student.id, formData));
          notify(uploadResponse!, "Tải ảnh đại diện thành công !");
        }
        setCurrentAction("list");
        handleGetData();
      }
    }

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
              parentId: student.parent?.id || undefined,
              pickup: student.pickup?.id || undefined,
              class: student.class?.id || undefined,
              avatar: student.avatar || undefined,
              full_name: student.full_name || undefined,
              birth_date: student.birth_date ? dayjs(student.birth_date) : undefined,
              gender: student.gender || undefined,
              address: student.address || undefined,
              status: student.status || undefined,
            }}
            onFinish={handleSubmitUpdate}
          >
            <Row className="split-3">
              <Col>
                <Form.Item
                  name="avatar"
                  htmlFor="update-avatar"
                  label={defaultLabels.avatar}
                  valuePropName="fileList"
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
                  name="parentId"
                  htmlFor="update-parent"
                  label={defaultLabels.parent}
                  rules={[ruleRequired("Phụ huynh không được để trống !")]}
                >
                  <Select
                    showSearch
                    allowClear
                    id="update-parent"
                    placeholder={defaultInputs.parent}
                    options={parents.map(parent => ({
                      label: `# ${parent.id} - ${parent.full_name}`,
                      value: parent.id,
                    }))}
                  />
                </Form.Item>
                <Form.Item
                  name="full_name"
                  htmlFor="update-fullname"
                  label={defaultLabels.full_name}
                  className="multiple-2"
                  rules={[ruleRequired("Họ và tên không được để trống !")]}
                >
                  <Input
                    id="update-fullname"
                    placeholder={defaultInputs.full_name}
                  />
                </Form.Item>
                <Row className="split-2">
                  <Col>
                    <Form.Item
                      name="birth_date"
                      htmlFor="update-birthday"
                      label={defaultLabels.birth_date}
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
                  <Select disabled
                    options={[
                      {
                        label: StudentStatusValue.studying,
                        value: "STUDYING",
                      },
                      {
                        label: StudentStatusValue.dropped_out,
                        value: "DROPPED_OUT",
                      },
                      {
                        label: StudentStatusValue.unknown,
                        value: "UNKNOWN",
                      }
                    ]}
                  />
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
                    options={pickups.map(pickup => ({
                      label: `# ${pickup.id} - ${pickup.name}`,
                      value: pickup.id,
                    }))}
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
                    options={classes.map(classItem => ({
                      label: `# ${classItem.id} - ${classItem.name}`,
                      value: classItem.id,
                    }))}
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
            student?.full_name +
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
                  icon={<FontAwesomeIcon icon={faPlus} />}
                  onClick={() => setCurrentAction("create")}
                >
                  {t("student-create")}
                </Button>
              </div>
            </div>
            <CustomTableActions<StudentFormatType>
              columns={columns}
              data={students || []}
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
