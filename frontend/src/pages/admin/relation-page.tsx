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
  faKey,
  faLock,
  faLockOpen,
  faPenToSquare,
  faTrashCan,
  faUserGraduate,
} from "@fortawesome/free-solid-svg-icons";
import type { RcFile } from "antd/es/upload";
import type {
  BreadcrumbItemType,
  BreadcrumbSeparatorType,
} from "antd/es/breadcrumb/Breadcrumb";
import { ruleRequired } from "../../common/rules";
import { CustomPaginationProps } from "../../common/prop";
import { CommonGenderValue, CommonStatusValue } from "../../common/values";
import type {
  RelationNotFormatType,
  RelationFormatType,
} from "../../common/types";
import CustomUpload from "../../components/upload";
import CustomTableActions from "../../components/table-actions";
import { useNotification } from "../../utils/showNotification";

// Relation Page
const RelationPage = () => {
  // Language
  const { t } = useTranslation();

  // Notification
  const { openNotification } = useNotification();

  // Cấu hình bảng dữ liệu
  const demoData: RelationFormatType[] = [
    {
      id: 1,
      user: {
        id: 1,
        role: "relation",
        username: "phuhuynh1",
        password: "phuhuynh1",
      },
      fullname: "Học sinh 1",
      phone: "1234567890",
      email: "phuhuynh1@gmail.com",
      address: "Địa chỉ ở đâu không biết",
      status: "Hoạt động",
      relationStudents: [
        {
          student: {
            id: "1",
            avatar: "test-1.png",
            fullname: "Học sinh 1",
            birthday: "01/01/2025",
            gender: "Nam",
            class: "10C2",
            address: "Địa chỉ ở đâu không biết",
            status: "Hoạt động",
          },
        },
        {
          student: {
            id: "2",
            avatar: "test-2.png",
            fullname: "Học sinh 2",
            birthday: "02/02/2025",
            gender: "Nam",
            class: "20C2",
            address: "Địa chỉ ở đâu không biết",
            status: "Tạm dừng",
          },
        },
      ],
    },
  ];
  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      sorter: true,
      width: "10%",
    },
    {
      title: "Họ và tên",
      dataIndex: "fullname",
      key: "fullname",
      sorter: true,
      width: "35%",
    },
    {
      title: "Tên tài khoản",
      dataIndex: "username",
      key: "username",
      sorter: true,
      width: "20%",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      sorter: true,
      width: "10%",
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
  const {
    currentItems,
    handleTableChange,
    paginationProps,
    sortField,
    sortOrder,
  } = CustomPaginationProps(
    demoData || [],
    10,
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  );

  // State giữ đối tượng được chọn hiện tại
  const [currentSelectedItem, setCurrentSelectedItem] =
    useState<RelationFormatType>();
  // State giữ hành động hiện tại
  const [currentAction, setCurrentAction] = useState<string>("list");
  // State giữ breadcrumb items hiện tại
  const [currentBreadcrumbItems, setCurrentBreadcrumbItems] =
    useState<Partial<BreadcrumbItemType & BreadcrumbSeparatorType>[]>();
  // State giữ card info hiện tại
  const [currentCardTitle, setCurrentCardTitle] = useState<string>(
    t("relation-list")
  );
  const [currentCardContent, setCurrentCardContent] = useState<string>("list");

  // Relation Actions
  const defaultLabels = {
    id: "Mã phụ huynh",
    username: "Tên tài khoản",
    password: "Mật khẩu",
    fullname: "Họ và tên",
    phone: "Số điện thoại",
    email: "Email",
    address: "Địa chỉ",
    status: "Trạng thái",
    relationStudents: "Danh sách học sinh"
  };
  const defaultInputs = {
    id: "Được xác định sau khi xác nhận thêm !",
    username: "Nhập Tên tài khoản",
    password: "Nhập Mật khẩu",
    fullname: "Nhập Họ và tên",
    phone: "Nhập Số điện thoại",
    email: "Nhập Email",
    address: "Nhập Địa chỉ",
    status: "Chọn Trạng thái",
    relationStudents: ""
  };
  const RelationDetail: React.FC<{ relation: RelationFormatType }> = ({
    relation,
  }) => {
    const [form] = Form.useForm<RelationNotFormatType>();

    return (
      <>
        <div className="relation-content detail">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              id: relation.id || undefined,
              username: relation.user?.username || undefined,
              password: "Mật khẩu đã được mã hoá !",
              fullname: relation.fullname || undefined,
              phone: relation.phone || undefined,
              email: relation.email || undefined,
              address: relation.address || undefined,
              status: relation.status || undefined,
            }}
          >
            <Row className="split-3">
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
              <Col>
                <Form.Item label={defaultLabels.relationStudents}>
                  <div className="relation-students">
                    <div className="relation-student">
                        <img src="/src/assets/images/others/no-image.png" alt="" />
                        <div>
                            <b>Tên học sinh 1</b>
                            <p>Lớp 10C2</p>
                        </div>
                        <Button color="red" variant="solid"><FontAwesomeIcon icon={faTrashCan}/></Button>
                    </div>
                    <div className="relation-student">
                        <img src="/src/assets/images/others/no-image.png" alt="" />
                        <div className="info">
                            <b>Tên học sinh 1</b>
                            <p>Lớp 10C2</p>
                        </div>
                    </div>
                    <div className="relation-student">
                        <img src="/src/assets/images/others/no-image.png" alt="" />
                        <div className="info">
                            <b>Tên học sinh 1</b>
                            <p>Lớp 10C2</p>
                        </div>
                    </div>
                  </div>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </>
    );
  };
  const RelationActions = {
    detail: (selectedRelation: RelationFormatType) => (
      <RelationDetail relation={selectedRelation} />
    ),
    //   create: () => <RelationCreate />,
    //   update: (selectedRelation: RelationType) => (
    //     <RelationUpdate relation={selectedRelation} />
    //   ),
    //   lock: (selectedRelation: RelationType) => (
    //     <RelationLock relation={selectedRelation} />
    //   ),
    //   changePassword: (selectedRelation: RelationType) => (
    //     <RelationChangePassword relation={selectedRelation} />
    //   ),
  };

  // Effect cập nhật Card Content
  useEffect(() => {
    if (currentAction === "list") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faUserGraduate} />
              &nbsp;{t("relation-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("relation-list")}
            </span>
          ),
        },
      ]);
      setCurrentCardTitle(t("relation-list"));
      setCurrentCardContent("list");
    } else if (currentAction === "detail") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faUserGraduate} />
              &nbsp;{t("relation-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("relation-list")}
            </span>
          ),
        },
        { title: <span>{t("relation-detail")}</span> },
      ]);
      setCurrentCardTitle(t("relation-detail"));
      setCurrentCardContent("detail");
    } else if (currentAction === "create") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faUserGraduate} />
              &nbsp;{t("relation-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("relation-list")}
            </span>
          ),
        },
        { title: <span>{t("relation-create")}</span> },
      ]);
      setCurrentCardTitle(t("relation-create"));
      setCurrentCardContent("create");
    } else if (currentAction === "update") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faUserGraduate} />
              &nbsp;{t("relation-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("relation-list")}
            </span>
          ),
        },
        { title: <span>{t("relation-update")}</span> },
      ]);
      setCurrentCardTitle(t("relation-update"));
      setCurrentCardContent("update");
    } else if (currentAction === "lock") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faUserGraduate} />
              &nbsp;{t("relation-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("relation-list")}
            </span>
          ),
        },
        { title: <span>{t("relation-lock")}</span> },
      ]);
      setCurrentCardTitle(t("relation-lock"));
      setCurrentCardContent("lock");
    } else if (currentAction === "unlock") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faUserGraduate} />
              &nbsp;{t("relation-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("relation-list")}
            </span>
          ),
        },
        { title: <span>{t("relation-unlock")}</span> },
      ]);
      setCurrentCardTitle(t("relation-unlock"));
      setCurrentCardContent("unlock");
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
            <div className="relation-data">
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
                    {t("relation-create")}
                  </Button>
                </div>
              </div>
              <CustomTableActions
                columns={columns}
                rowKey={(record) => record!.id as number}
                data={currentItems}
                pagination={paginationProps}
                className="admin-layout__main-table table-data relations"
                onChange={handleTableChange}
              />
            </div>
          )}
          {currentCardContent === "detail" &&
            RelationActions.detail(currentSelectedItem!)}
          {/* {currentCardContent === "create" && RelationActions.create()}
          {currentCardContent === "update" &&
            RelationActions.update(currentSelectedItem!)}
          {(currentCardContent === "lock" || currentCardContent === "unlock") &&
            RelationActions.lock(currentSelectedItem!)}
          {currentCardContent === "change-password" &&
            RelationActions.lock(currentSelectedItem!)} */}
        </Card>
      </div>
    </>
  );
};

export default RelationPage;
