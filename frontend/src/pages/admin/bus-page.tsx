import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Breadcrumb,
  Card,
  Input,
  Button,
  Select,
  Tag,
  Form,
  Col,
  Row,
  Alert,
  InputNumber,
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
  faBus,
} from "@fortawesome/free-solid-svg-icons";
import type { ColumnsType } from "antd/es/table";
import type {
  BreadcrumbItemType,
  BreadcrumbSeparatorType,
} from "antd/es/breadcrumb/Breadcrumb";
import { ruleRequired } from "../../common/rules";
import { CommonStatusValue } from "../../common/values";
import type { BusType } from "../../common/types";
import CustomTableActions from "../../components/table-actions";
import { useNotification } from "../../utils/showNotification";

// Bus Page
const BusPage = () => {
  // Language
  const { t } = useTranslation();

  // Notification
  const { openNotification } = useNotification();

  // Cấu hình bảng dữ liệu (sau cập nhật lọc giới tính, phụ huynh, trạm và lớp)
  const demoData: BusType[] = [
    {
      id: 1,
      licensePlate: "AA00-0000",
      capacity: 20,
      status: "Hoạt động",
    },
    {
      id: 2,
      licensePlate: "AA99-9999",
      capacity: 30,
      status: "Tạm dừng",
    },
  ];
  const columns: ColumnsType<BusType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: "15%",
      sorter: (a, b) => a?.id! - b?.id!,
    },
    {
      title: "Số đăng ký xe",
      dataIndex: "licensePlate",
      key: "licensePlate",
      width: "35%",
      sorter: (a, b) => a?.licensePlate!.localeCompare(b?.licensePlate!),
    },
    {
      title: "Số chỗ ngồi",
      dataIndex: "capacity",
      key: "capacity",
      width: "20%",
      sorter: (a, b) => a?.capacity! - b?.capacity!,
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
      width: "15%",
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
      width: "15%",
      className: "actions",
    },
  ];

  // State giữ đối tượng được chọn hiện tại
  const [currentSelectedItem, setCurrentSelectedItem] = useState<BusType>();
  // State giữ hành động hiện tại
  const [currentAction, setCurrentAction] = useState<string>("list");
  // State giữ breadcrumb items hiện tại
  const [currentBreadcrumbItems, setCurrentBreadcrumbItems] =
    useState<Partial<BreadcrumbItemType & BreadcrumbSeparatorType>[]>();
  // State giữ card info hiện tại
  const [currentCardTitle, setCurrentCardTitle] = useState<string>(
    t("bus-list")
  );
  const [currentCardContent, setCurrentCardContent] = useState<string>("list");

  // Bus Actions
  const defaultLabels = {
    id: "Mã xe buýt",
    licensePlate: "Số đăng ký xe",
    capacity: "Số chỗ ngồi",
    status: "Trạng thái",
  };
  const defaultInputs = {
    id: "Được xác định sau khi xác nhận thêm !",
    licensePlate: "Nhập Số đăng ký xe",
    capacity: "Nhập Số chỗ ngồi",
    status: "Chọn Trạng thái",
  };
  const BusDetail: React.FC<{ bus: BusType }> = ({ bus }) => {
    const [form] = Form.useForm<BusType>();

    return (
      <>
        <div className="bus-content detail">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              id: bus.id || undefined,
              licensePlate: bus.licensePlate || undefined,
              capacity: bus.capacity || undefined,
              status: bus.status || undefined,
            }}
          >
            <Row className="split-3">
              <Col></Col>
              <Col>
                <Form.Item name="id" label={defaultLabels.id} className="text-center">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="status" label={defaultLabels.status}>
                  <Select disabled />
                </Form.Item>
                <Form.Item
                  name="licensePlate"
                  label={defaultLabels.licensePlate}
                >
                  <Input disabled />
                </Form.Item>
                <Form.Item
                  name="capacity"
                  label={defaultLabels.capacity}
                  className="margin-bottom-0"
                >
                  <InputNumber disabled />
                </Form.Item>
              </Col>
              <Col></Col>
            </Row>
          </Form>
        </div>
      </>
    );
  };
  const BusCreate: React.FC = () => {
    const [form] = Form.useForm<BusType>();
    return (
      <>
        <div className="bus-content create">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              id: undefined,
              licensePlate: undefined,
              capacity: undefined,
              status: undefined,
            }}
            onFinish={() => {
              console.log("Form values:", form.getFieldsValue());
            }}
          >
            <Row className="split-3">
              <Col></Col>
              <Col>
                <Form.Item
                  name="id"
                  label={defaultLabels.id}
                  className="text-center"
                >
                  <Input placeholder={defaultInputs.id} disabled />
                </Form.Item>
                <Form.Item
                  name="status"
                  htmlFor="create-status"
                  label={defaultLabels.status}
                  rules={[ruleRequired("Trạng thái không được để trống !")]}
                >
                  <Select
                    allowClear
                    id="create-bus"
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
                  name="licensePlate"
                  htmlFor="create-licensePlate"
                  label={defaultLabels.licensePlate}
                  rules={[ruleRequired("Số đăng ký xe không được để trống !")]}
                >
                  <Input
                    id="create-licensePlate"
                    placeholder={defaultInputs.licensePlate}
                  />
                </Form.Item>
                <Form.Item
                  name="capacity"
                  htmlFor="create-capacity"
                  label={defaultLabels.capacity}
                  rules={[ruleRequired("Số chỗ ngồi không được để trống !")]}
                >
                  <InputNumber
                    min={0}
                    id="create-capacity"
                    placeholder={defaultInputs.capacity}
                  />
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
  const BusUpdate: React.FC<{ bus: BusType }> = ({ bus }) => {
    const [form] = Form.useForm<BusType>();

    return (
      <>
        <div className="bus-content update">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              id: bus.id || undefined,
              licensePlate: bus.licensePlate || undefined,
              capacity: bus.capacity || undefined,
              status: bus.status || undefined,
            }}
            onFinish={() => {
              console.log("Form values:", form.getFieldsValue());
            }}
          >
            <Row className="split-3">
              <Col></Col>
              <Col>
                <Form.Item
                  name="id"
                  label={defaultLabels.id}
                  className="text-center"
                >
                  <Input disabled />
                </Form.Item>
                <Form.Item name="status" label={defaultLabels.status}>
                  <Select disabled />
                </Form.Item>
                <Form.Item
                  name="licensePlate"
                  htmlFor="create-licensePlate"
                  label={defaultLabels.licensePlate}
                  rules={[ruleRequired("Số đăng ký xe không được để trống !")]}
                >
                  <Input
                    id="create-licensePlate"
                    placeholder={defaultInputs.licensePlate}
                  />
                </Form.Item>
                <Form.Item
                  name="capacity"
                  htmlFor="create-capacity"
                  label={defaultLabels.capacity}
                  rules={[ruleRequired("Số chỗ ngồi không được để trống !")]}
                >
                  <InputNumber
                    min={0}
                    id="create-capacity"
                    placeholder={defaultInputs.capacity}
                  />
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
  const BusLock: React.FC<{ bus: BusType }> = ({ bus }) => {
    return (
      <>
        <Alert
          message={
            "Xe buýt: " +
            "#" +
            bus?.id +
            " - " +
            bus?.licensePlate +
            " - số chỗ: " +
            bus?.capacity
          }
          showIcon
          icon={
            <FontAwesomeIcon
              icon={
                bus?.status === CommonStatusValue.active ? faLock : faLockOpen
              }
            />
          }
          description={
            "Bạn có chắc chắc muốn" +
            (bus?.status === CommonStatusValue.active
              ? " khoá "
              : " mở khoá ") +
            "xe buýt này ? Hành động không thể hoàn tác !"
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
  const BusActions = {
    detail: (selectedBus: BusType) => <BusDetail bus={selectedBus} />,
    create: () => <BusCreate />,
    update: (selectedBus: BusType) => <BusUpdate bus={selectedBus} />,
    lock: (selectedBus: BusType) => <BusLock bus={selectedBus} />,
  };

  // Effect cập nhật Card Content
  useEffect(() => {
    if (currentAction === "list") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faBus} />
              &nbsp;{t("bus-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("bus-list")}
            </span>
          ),
        },
      ]);
      setCurrentCardTitle(t("bus-list"));
      setCurrentCardContent("list");
    } else if (currentAction === "detail") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faBus} />
              &nbsp;{t("bus-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("bus-list")}
            </span>
          ),
        },
        { title: <span>{t("bus-detail")}</span> },
      ]);
      setCurrentCardTitle(t("bus-detail"));
      setCurrentCardContent("detail");
    } else if (currentAction === "create") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faBus} />
              &nbsp;{t("bus-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("bus-list")}
            </span>
          ),
        },
        { title: <span>{t("bus-create")}</span> },
      ]);
      setCurrentCardTitle(t("bus-create"));
      setCurrentCardContent("create");
    } else if (currentAction === "update") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faBus} />
              &nbsp;{t("bus-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("bus-list")}
            </span>
          ),
        },
        { title: <span>{t("bus-update")}</span> },
      ]);
      setCurrentCardTitle(t("bus-update"));
      setCurrentCardContent("update");
    } else if (currentAction === "lock") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faBus} />
              &nbsp;{t("bus-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("bus-list")}
            </span>
          ),
        },
        { title: <span>{t("bus-lock")}</span> },
      ]);
      setCurrentCardTitle(t("bus-lock"));
      setCurrentCardContent("lock");
    } else if (currentAction === "unlock") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faBus} />
              &nbsp;{t("bus-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("bus-list")}
            </span>
          ),
        },
        { title: <span>{t("bus-unlock")}</span> },
      ]);
      setCurrentCardTitle(t("bus-unlock"));
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
          <div className="bus-data">
            <div className="admin-layout__main-filter">
              <div className="left">
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="Tìm theo họ và tên xe buýt"
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
                  {t("bus-create")}
                </Button>
              </div>
            </div>
            <CustomTableActions<BusType>
              columns={columns}
              data={demoData || []}
              rowKey={(record) => String(record?.id)}
              // loading={isLoading}
              defaultPageSize={10}
              className="admin-layout__main-table table-data Buss"
            />
          </div>
        )}
        {currentCardContent === "detail" &&
          BusActions.detail(currentSelectedItem!)}
        {currentCardContent === "create" && BusActions.create()}
        {currentCardContent === "update" &&
          BusActions.update(currentSelectedItem!)}
        {(currentCardContent === "lock" || currentCardContent === "unlock") &&
          BusActions.lock(currentSelectedItem!)}
      </Card>
    </div>
  );
};

export default BusPage;
