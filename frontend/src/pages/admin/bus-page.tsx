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
import { ruleLicensePlate, ruleRequired } from "../../common/rules";
import { BusStatusValue, CommonStatusValue } from "../../common/values";
import type { BusType } from "../../common/types";
import CustomTableActions from "../../components/table-actions";
import useCallApi from "../../api/useCall";
import { createBus, getBuses, updateBus } from "../../services/bus-service";

// Bus Page
const BusPage = () => {
  const { execute, notify, loading } = useCallApi();
  const { t } = useTranslation();

  const [buses, setBuses] = useState<BusType[]>([]);
  const handleGetData = async () => {
    const restResponse = await execute(getBuses(), false);
    if (restResponse?.result) {
      setBuses(restResponse.data);
    }
  };
  useEffect(() => {
    handleGetData();
  }, []);
  
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const filteredBusList = buses.filter((bus) => {
    const matchesLicense_plate = bus.license_plate
      ?.toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesStatus = statusFilter ? bus.status === statusFilter : true;
    return matchesLicense_plate && matchesStatus;
  });

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Hoạt động";
      case "INACTIVE":
        return "Tạm dừng";
      default:
        return "Không xác định";
    }
  };
  const statusOptions = [
    { value: "ACTIVE", label: getStatusLabel("ACTIVE") },
    { value: "INACTIVE", label: getStatusLabel("INACTIVE") },
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
      dataIndex: "license_plate",
      key: "license_plate",
      width: "35%",
      sorter: (a, b) => a?.license_plate!.localeCompare(b?.license_plate!),
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
        <Tag
          color={
            getStatusLabel(status) === CommonStatusValue.active
              ? "green"
              : "red"
          }
        >
          {getStatusLabel(status)}
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
                getStatusLabel(record.status) === CommonStatusValue.active
                  ? "lock"
                  : "unlock"
              );
              setCurrentSelectedItem(record);
            }}
          >
            <FontAwesomeIcon
              icon={
                getStatusLabel(record.status) === CommonStatusValue.active
                  ? faLock
                  : faLockOpen
              }
            />
          </Button>
        </div>
      ),
      width: "15%",
      className: "actions",
    },
  ];

  const [currentSelectedItem, setCurrentSelectedItem] = useState<BusType>();
  const [currentAction, setCurrentAction] = useState<string>("list");
  const [currentBreadcrumbItems, setCurrentBreadcrumbItems] =
    useState<Partial<BreadcrumbItemType & BreadcrumbSeparatorType>[]>();
  const [currentCardTitle, setCurrentCardTitle] = useState<string>(
    t("bus-list")
  );
  const [currentCardContent, setCurrentCardContent] = useState<string>("list");

  const defaultLabels = {
    id: "Mã xe buýt",
    license_plate: "Số đăng ký xe",
    capacity: "Số chỗ ngồi",
    status: "Trạng thái",
  };
  const defaultInputs = {
    id: "Được xác định sau khi xác nhận thêm !",
    license_plate: "Nhập Số đăng ký xe",
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
              license_plate: bus.license_plate || undefined,
              capacity: bus.capacity || undefined,
              status: getStatusLabel(bus.status ?? "") || undefined,
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
                  name="license_plate"
                  label={defaultLabels.license_plate}
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

    const handleSubmitCreateForm = async () => {
      const restResponse = await execute(
        createBus({
          license_plate: form.getFieldValue("license_plate")?.trim(),
          capacity: Number(form.getFieldValue("capacity")),
          status: form.getFieldValue("status"),
        }),
        true
      );
      notify(restResponse!, "Thêm xe buýt thành công");
      if (restResponse?.result) {
        handleGetData();
        setCurrentAction("list");
      }
    };

    return (
      <>
        <div className="bus-content create">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              license_plate: undefined,
              capacity: undefined,
              status: undefined,
            }}
            autoComplete="off"
            onFinish={handleSubmitCreateForm}
          >
            <Row className="split-3">
              <Col></Col>
              <Col>
                <Form.Item label={defaultLabels.id} className="text-center">
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
                      { label: BusStatusValue.active, value: "ACTIVE" },
                      { label: BusStatusValue.inactive, value: "INACTIVE" },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  name="license_plate"
                  htmlFor="create-license_plate"
                  label={defaultLabels.license_plate}
                  rules={[
                    ruleRequired("Số đăng ký xe không được để trống !"),
                    ruleLicensePlate(),
                  ]}
                >
                  <Input
                    id="create-license_plate"
                    placeholder={defaultInputs.license_plate}
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
                    placeholder="Nhập số chỗ ngồi"
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

    const handleSubmitUpdateForm = async () => {
      const restResponse = await execute(
        updateBus(bus.id!, {
          license_plate: form.getFieldValue("license_plate")?.trim(),
          capacity: Number(form.getFieldValue("capacity")),
          status: form.getFieldValue("status"),
        }),
        true
      );
      notify(restResponse!, "Cập nhật xe buýt thành công");
      if (restResponse?.result) {
        handleGetData();
        setCurrentAction("list");
      }
    };

    return (
      <>
        <div className="bus-content update">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              id: bus.id || undefined,
              license_plate: bus.license_plate || undefined,
              capacity: bus.capacity || undefined,
              status: bus.status || undefined,
            }}
            autoComplete="off"
            onFinish={() => {
              handleSubmitUpdateForm();
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
                  <Select disabled options={statusOptions} />
                </Form.Item>
                <Form.Item
                  name="license_plate"
                  htmlFor="create-license_plate"
                  label={defaultLabels.license_plate}
                  rules={[
                    ruleRequired("Số đăng ký xe không được để trống !"),
                    ruleLicensePlate(),
                  ]}
                >
                  <Input
                    id="create-license_plate"
                    placeholder={defaultInputs.license_plate}
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
    const handleConfirmLockUnlock = async () => {
      const restResponse = await execute(
        updateBus(bus.id!, {
          status:
            getStatusLabel(bus.status ?? "") === CommonStatusValue.active
              ? "INACTIVE"
              : "ACTIVE",
        }),
        true
      );
      notify(
        restResponse!,
        getStatusLabel(bus.status ?? "") === CommonStatusValue.active
          ? "Khoá xe buýt thành công"
          : "Mở khoá xe buýt thành công"
      );
      if (restResponse?.result) {
        handleGetData();
        setCurrentAction("list");
      }
    };

    return (
      <>
        <Alert
          message={
            "Xe buýt: " +
            "#" +
            bus?.id +
            " - " +
            bus?.license_plate +
            " - số chỗ: " +
            bus?.capacity
          }
          showIcon
          icon={
            <FontAwesomeIcon
              icon={
                getStatusLabel(bus?.status ?? "") === BusStatusValue.active
                  ? faLock
                  : faLockOpen
              }
            />
          }
          description={
            "Bạn có chắc chắc muốn" +
            (getStatusLabel(bus?.status ?? "") === CommonStatusValue.active
              ? " khoá "
              : " mở khoá ") +
            "xe buýt này ? Hành động không thể hoàn tác !"
          }
          type="error"
          action={
            <Button
              color="danger"
              variant="solid"
              loading={loading}
              onClick={handleConfirmLockUnlock}
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

  useEffect(() => {
    const baseBreadcrumb = [
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
          <span onClick={() => setCurrentAction("list")}>{t("bus-list")}</span>
        ),
      },
    ];

    switch (currentAction) {
      case "list":
        setCurrentBreadcrumbItems(baseBreadcrumb);
        setCurrentCardTitle(t("bus-list"));
        setCurrentCardContent("list");
        break;
      case "detail":
        setCurrentBreadcrumbItems([
          ...baseBreadcrumb,
          { title: <span>{t("bus-detail")}</span> },
        ]);
        setCurrentCardTitle(t("bus-detail"));
        setCurrentCardContent("detail");
        break;
      case "create":
        setCurrentBreadcrumbItems([
          ...baseBreadcrumb,
          { title: <span>{t("bus-create")}</span> },
        ]);
        setCurrentCardTitle(t("bus-create"));
        setCurrentCardContent("create");
        break;
      case "update":
        setCurrentBreadcrumbItems([
          ...baseBreadcrumb,
          { title: <span>{t("bus-update")}</span> },
        ]);
        setCurrentCardTitle(t("bus-update"));
        setCurrentCardContent("update");
        break;
      case "lock":
        setCurrentBreadcrumbItems([
          ...baseBreadcrumb,
          { title: <span>{t("bus-lock")}</span> },
        ]);
        setCurrentCardTitle(t("bus-lock"));
        setCurrentCardContent("lock");
        break;
      case "unlock":
        setCurrentBreadcrumbItems([
          ...baseBreadcrumb,
          { title: <span>{t("bus-unlock")}</span> },
        ]);
        setCurrentCardTitle(t("bus-unlock"));
        setCurrentCardContent("unlock");
        break;
    }
  }, [currentAction]);

  return (
    <div className="admin-layout__main-content">
      <Breadcrumb
        items={currentBreadcrumbItems}
        className="admin-layout__main-breadcrumb"
      />
      <Card title={currentCardTitle} className="admin-layout__main-card">
        {currentCardContent === "list" && (
          <div className="bus-data">
            <div className="admin-layout__main-filter">
              <div className="left">
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="Tìm theo số đăng ký xe buýt"
                  className="filter-find"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <Select
                  allowClear
                  placeholder="Chọn Trạng thái"
                  options={[
                    { label: CommonStatusValue.active, value: "ACTIVE" },
                    { label: CommonStatusValue.inactive, value: "INACTIVE" },
                  ]}
                  className="filter-select"
                  value={statusFilter}
                  onChange={(value) => setStatusFilter(value)}
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
                  {t("bus-create")}
                </Button>
              </div>
            </div>
            <CustomTableActions<BusType>
              columns={columns}
              data={filteredBusList || []}
              rowKey={(record) => String(record?.id)}
              loading={loading}
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
