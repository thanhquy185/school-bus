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
import axios from "axios";
import { createSchema, updateSchema } from "../../../../server/src/schemas/bus.schema";
import { z } from "zod";


// Bus Page
const BusPage = () => {
  // Language
  const { t } = useTranslation();

  // Notification
  const { openNotification } = useNotification();

  const [busList, setBusList] = useState<BusType[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Thêm state để lưu filter
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

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
        <Tag color={getStatusLabel(status) === CommonStatusValue.active ? "green" : "red"}>
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
                getStatusLabel(record.status) ===  CommonStatusValue.active ? "lock" : "unlock"
              );
              setCurrentSelectedItem(record);
            }}
          >
            <FontAwesomeIcon
              icon={
                getStatusLabel(record.status) === CommonStatusValue.active ? faLock : faLockOpen
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
              status: getStatusLabel(bus.status ?? "") || undefined,
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
              licensePlate: undefined,
              capacity: undefined,
              status: undefined,
            }}
            onFinish={(values) => {handleSubmitCreateForm(values)}}
          >
            <Row className="split-3">
              <Col></Col>
              <Col>
                <Form.Item
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
                        value: "ACTIVE",
                      },
                      {
                        label: CommonStatusValue.inactive,
                        value: "INACTIVE",
                      },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  name="licensePlate"
                  htmlFor="create-licensePlate"
                  label={defaultLabels.licensePlate}
                  rules={[
                    // ruleRequired("Số đăng ký xe không được để trống !"),
                    zodFieldRule(createSchema, "licensePlate"),
                  ]}
                >
                  <Input
                    id="create-licensePlate"
                    placeholder="VD: 52N-89341"
                  />
                </Form.Item>
                <Form.Item
                  name="capacity"
                  htmlFor="create-capacity"
                  label={defaultLabels.capacity}
                  rules={[
                    // ruleRequired("Số chỗ ngồi không được để trống !"),
                    zodFieldRule(createSchema, "capacity"),
                  ]}
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
            onFinish={(values) => {handleSubmitUpdateForm(values)}}
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
                  <Select disabled options={statusOptions}/>
                </Form.Item>
                <Form.Item
                  name="licensePlate"
                  htmlFor="create-licensePlate"
                  label={defaultLabels.licensePlate}
                  rules={[
                    zodFieldRule(updateSchema, "licensePlate"),
                  ]}
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
                  rules={[
                    // ruleRequired("Số chỗ ngồi không được để trống !"),
                    zodFieldRule(updateSchema, "capacity"),
                  ]}
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
                getStatusLabel(bus?.status ?? "") === CommonStatusValue.active ? faLock : faLockOpen
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
              onClick={() => {
                handleConfirmLockUnlock(bus)
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

  // Gom 2 cái effect lại
  useEffect(() => {
    // 🧭 Cập nhật Breadcrumb + Tiêu đề + Nội dung
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
          <span onClick={() => setCurrentAction("list")}>
            {t("bus-list")}
          </span>
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
        setCurrentBreadcrumbItems([...baseBreadcrumb, { title: <span>{t("bus-detail")}</span> }]);
        setCurrentCardTitle(t("bus-detail"));
        setCurrentCardContent("detail");
        break;
      case "create":
        setCurrentBreadcrumbItems([...baseBreadcrumb, { title: <span>{t("bus-create")}</span> }]);
        setCurrentCardTitle(t("bus-create"));
        setCurrentCardContent("create");
        break;
      case "update":
        setCurrentBreadcrumbItems([...baseBreadcrumb, { title: <span>{t("bus-update")}</span> }]);
        setCurrentCardTitle(t("bus-update"));
        setCurrentCardContent("update");
        break;
      case "lock":
        setCurrentBreadcrumbItems([...baseBreadcrumb, { title: <span>{t("bus-lock")}</span> }]);
        setCurrentCardTitle(t("bus-lock"));
        setCurrentCardContent("lock");
        break;
      case "unlock":
        setCurrentBreadcrumbItems([...baseBreadcrumb, { title: <span>{t("bus-unlock")}</span> }]);
        setCurrentCardTitle(t("bus-unlock"));
        setCurrentCardContent("unlock");
        break;
    }

    // 📦 Nếu đang ở chế độ "list" thì gọi API
    if (currentAction === "list") {
      const fetchBuses = async () => {
        setLoading(true);
        try {
          const res = await axios.get("http://localhost:5000/api/buses");
          setBusList(res.data.data);
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu bus:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchBuses();
    }
  }, [currentAction]);

  // Hàm chuyển zod -> rule của Ant Design
  const zodFieldRule = (schema: any, fieldName: keyof z.infer<typeof schema>) => ({
    validator: async (_: any, value: any) => {
      try {
        schema.pick({ [fieldName]: true }).parse({ [fieldName]: value });
        return Promise.resolve();
      } catch (err: any) {
        if (err instanceof z.ZodError) {
          const firstError = err.issues
            .find((e: any) => e.path[0] === fieldName)?.message || "Giá trị không hợp lệ";

          return Promise.reject(new Error(firstError));
        }

        return Promise.reject(new Error("Giá trị không hợp lệ"));
      }
    },
  });

  // Nút xác nhận form Create
  const handleSubmitCreateForm = async (values: any) => {
    try {
      console.log("Giá trị form:", values);
      const formattedValues = {
        licensePlate: values.licensePlate.trim(),
        capacity: Number(values.capacity),
        status: values.status,
      };

      // Kiểm tra bằng zod
      createSchema.parse(formattedValues);

      // Gọi API để lấy danh sách xe buýt hiện có
      const existingRes = await axios.get("http://localhost:5000/api/buses");
      const existingBuses = existingRes.data.data;

      // Kiểm tra xem licensePlate đã tồn tại chưa
      const isDuplicate = existingBuses.some(
        (bus: any) =>
          bus.licensePlate.trim().toLowerCase() ===
          formattedValues.licensePlate.toLowerCase()
      );

      if (isDuplicate) {
        openNotification({
          type: "error",
          message: "Lỗi",
          description: "Biển số xe này đã tồn tại. Vui lòng nhập biển số khác.",
          duration: 2,
        });
        return;
      }

      // Nếu không trùng thì gọi API tạo mới
      const res = await axios.post("http://localhost:5000/api/buses", formattedValues);

      if (res.status === 201 || res.status === 200) {
        console.log("✅ Tạo xe buýt thành công:", res.data);
        setCurrentAction("list");
      } else {
        console.log("❌ Không thể thêm xe buýt. Vui lòng thử lại.");
      }
    } catch (error: any) {
      console.log("🚨 Lỗi khi tạo xe buýt:", error);
    }
  };

  // Nút xác nhận form Update
  const handleSubmitUpdateForm = async (values: any) => {
    try {
      console.log("Giá trị form:", values);
      const formattedValues = {
        id: Number(values.id),
        licensePlate: values.licensePlate?.trim(),
        capacity: Number(values.capacity),
        status: values.status,
      };

      // Kiểm tra bằng zod
      updateSchema.parse(formattedValues);

      // Lấy danh sách xe buýt hiện có để kiểm tra trùng
      const existingRes = await axios.get("http://localhost:5000/api/buses");
      const existingBuses = existingRes.data.data;

      // Kiểm tra xem biển số này đã tồn tại ở xe khác chưa
      const isDuplicate = existingBuses.some(
        (bus: any) =>
          bus.licensePlate.trim().toLowerCase() ===
            formattedValues.licensePlate.toLowerCase() &&
          bus.id !== formattedValues.id // loại bỏ xe đang cập nhật
      );

      if (isDuplicate) {
        openNotification({
          type: "error",
          message: "Lỗi",
          description: "Biển số xe này đã tồn tại ở xe khác. Vui lòng nhập biển số khác",
          duration: 2,
        });
        return;
      }

      // Nếu không trùng, tiến hành cập nhật
      const res = await axios.put(
        `http://localhost:5000/api/buses/${formattedValues.id}`,
        {
          licensePlate: formattedValues.licensePlate,
          capacity: formattedValues.capacity,
          status: formattedValues.status,
        }
      );

      if (res.status === 200 || res.status === 201) {
        console.log("✅ Cập nhật xe buýt thành công:", res.data);
        setCurrentAction("list");
      } else {
        console.log("❌ Không thể cập nhật xe buýt. Vui lòng thử lại.");
      }
    } catch (error: any) {
      if (error.response?.status === 409) {
        alert("❌ Biển số xe đã tồn tại trong hệ thống!");
      } else {
        console.log("🚨 Lỗi khi cập nhật xe buýt:", error);
      }
    }
  };

  // Nút xác nhận Lock/Unlock
  const handleConfirmLockUnlock = async (bus: BusType) => {
    const newStatus = bus.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    try {
      setLoading(true); // nếu muốn hiển thị spinner
      const res = await axios.put(`http://localhost:5000/api/buses/${bus.id}`, {
        ...bus,
        status: newStatus,
      });

      if (res.status === 200 || res.status === 201) {
        openNotification({
          type: "success",
          message: "Thành công",
          description: `Xe buýt #${bus.id} đã được ${
            newStatus === "ACTIVE" ? "mở khóa" : "khóa"
          }`,
          duration: 2,
        });
        setCurrentAction("list"); // quay về danh sách
      } else {
        openNotification({
          type: "error",
          message: "Lỗi",
          description: "Không thể thay đổi trạng thái. Vui lòng thử lại!",
        });
      }
    } catch (error) {
      console.error("Lỗi khi lock/unlock:", error);
      openNotification({
        type: "error",
        message: "Lỗi",
        description: "Đã xảy ra lỗi khi gửi yêu cầu!",
      });
    } finally {
      setLoading(false);
    }
  };

  // Hàm lọc busList
  const filteredBusList = busList.filter((bus) => {
    const matchesLicensePlate = bus.licensePlate
      ?.toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesStatus = statusFilter
      ? bus.status === statusFilter
      : true;
    return matchesLicensePlate && matchesStatus;
  });

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
                  placeholder="Tìm theo số đăng ký xe buýt"
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
                    { label: CommonStatusValue.active, value: "ACTIVE" },
                    { label: CommonStatusValue.inactive, value: "INACTIVE" },
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
