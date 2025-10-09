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
  faUserGraduate,
} from "@fortawesome/free-solid-svg-icons";
import type { ColumnsType } from "antd/es/table";
import type {
  BreadcrumbItemType,
  BreadcrumbSeparatorType,
} from "antd/es/breadcrumb/Breadcrumb";
import { ruleRequired } from "../../common/rules";
import { CommonStatusValue, PointTypeValue } from "../../common/values";
import type { PickupType } from "../../common/types";
import LeafletMap from "../../components/leaflet-map";
import CustomTableActions from "../../components/table-actions";
import { useNotification } from "../../utils/showNotification";

// Pickup Page
const PickupPage = () => {
  // Language
  const { t } = useTranslation();

  // Notification
  const { openNotification } = useNotification();

  // Cấu hình bảng dữ liệu (sau cập nhật lọc giới tính, phụ huynh, trạm và lớp)
  const demoData: PickupType[] = [
    {
      id: 1,
      name: "Trường Đại học Sài Gòn",
      category: "Trường học",
      lat: 10.75960314081626,
      lng: 106.68201506137848,
      status: "Hoạt động",
    },
    {
      id: 2,
      name: "Trạm Công viên Lê Thị Riêng",
      category: "Điểm đưa đón",
      lat: 10.786197005344277,
      lng: 106.66577696800232,
      status: "Tạm dừng",
    },
  ];
  const columns: ColumnsType<PickupType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: "10%",
      sorter: (a, b) => a?.id! - b?.id!,
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      width: "27%",
      sorter: (a, b) => a?.name!.localeCompare(b?.name!),
    },
    {
      title: "Loại",
      dataIndex: "category",
      key: "category",
      width: "18%",
      sorter: (a, b) => a?.category!.localeCompare(b?.category!),
    },
    {
      title: "Toạ độ x",
      dataIndex: "lat",
      key: "lat",
      width: "12%",
      sorter: (a, b) => a?.lat! - b?.lat!,
    },
    {
      title: "Toạ độ y",
      dataIndex: "lng",
      key: "lng",
      width: "12%",
      sorter: (a, b) => a?.lng! - b?.lng!,
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
  const [currentSelectedItem, setCurrentSelectedItem] = useState<PickupType>();
  // State giữ hành động hiện tại
  const [currentAction, setCurrentAction] = useState<string>("list");
  // State giữ breadcrumb items hiện tại
  const [currentBreadcrumbItems, setCurrentBreadcrumbItems] =
    useState<Partial<BreadcrumbItemType & BreadcrumbSeparatorType>[]>();
  // State giữ card info hiện tại
  const [currentCardTitle, setCurrentCardTitle] = useState<string>(
    t("pickup-list")
  );
  const [currentCardContent, setCurrentCardContent] = useState<string>("list");

  // Pickup Actions
  const defaultLabels = {
    id: "Mã trạm xe buýt",
    name: "Tên trạm xe buýt",
    category: "Loại trạm xe buýt",
    lat: "Toạ độ x",
    lng: "Toạ độ y",
    status: "Trạng thái",
    map: "Bản đồ",
  };
  const defaultInputs = {
    id: "Chưa xác định !",
    name: "Nhập Tên trạm xe buýt",
    category: "Chọn Loại trạm xe buýt",
    lat: "Nhập Toạ độ x",
    lng: "Nhập Toạ độ y",
    status: "Chọn Trạng thái",
    map: "",
  };
  const PickupDetail: React.FC<{ pickup: PickupType }> = ({ pickup }) => {
    const [form] = Form.useForm<PickupType>();

    return (
      <>
        <div className="pickup-content detail">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              id: pickup.id || undefined,
              name: pickup.name || undefined,
              category: pickup.category || undefined,
              lat: pickup.lat || undefined,
              lng: pickup.lng || undefined,
              status: pickup.status || undefined,
            }}
          >
            <Row className="split-3">
              <Col>
                <Row className="split-2">
                  <Col>
                    <Form.Item
                      name="id"
                      label={defaultLabels.id}
                      className="text-center"
                    >
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item name="status" label={defaultLabels.status}>
                      <Select disabled />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item name="name" label={defaultLabels.name}>
                  <Input disabled />
                </Form.Item>
                <Form.Item name="category" label={defaultLabels.category}>
                  <Select disabled />
                </Form.Item>
                <Form.Item name="lat" label={defaultLabels.lat}>
                  <InputNumber disabled />
                </Form.Item>
                <Form.Item
                  name="lng"
                  label={defaultLabels.lng}
                  className="margin-bottom-0"
                >
                  <InputNumber disabled />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  label={defaultLabels.map}
                  className="has-map multiple-2 margin-bottom-0"
                >
                  <LeafletMap
                    lat={pickup.lat}
                    lng={pickup.lng}
                    pointType={pickup.category}
                    type="detail"
                  />
                </Form.Item>
              </Col>
              <Col></Col>
            </Row>
          </Form>
        </div>
      </>
    );
  };
  const PickupCreate: React.FC = () => {
    const [form] = Form.useForm<PickupType>();
    // Dữ liệu giúp đồng nhất với bản đồ
    const [categoryValue, setCategoryValue] = useState<string>("");
    const [latValue, setLatValue] = useState<number>(0);
    const [lngValue, setLngValue] = useState<number>(0);

    const handlePickupSelected = (lat: number, lng: number, info: any) => {
      setLatValue(lat);
      setLngValue(lng);
      form.setFieldValue("lat", lat);
      form.setFieldValue("lng", lng);
    };

    return (
      <>
        <div className="pickup-content create">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              id: undefined,
              name: undefined,
              category: undefined,
              lat: undefined,
              lng: undefined,
              status: undefined,
            }}
            onFinish={() => {
              console.log("Form values:", form.getFieldsValue());
            }}
          >
            <Row className="split-3">
              <Col>
                <Row className="split-2">
                  <Col>
                    <Form.Item
                      name="id"
                      label={defaultLabels.id}
                      className="text-center"
                    >
                      <Input placeholder={defaultInputs.id} disabled />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      name="status"
                      htmlFor="create-status"
                      label={defaultLabels.status}
                      rules={[ruleRequired("Cần chọn Trạng thái !")]}
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
                  </Col>
                </Row>
                <Form.Item
                  name="name"
                  htmlFor="create-name"
                  label={defaultLabels.name}
                  rules={[
                    ruleRequired("Tên trạm xe buýt không được để trống !"),
                  ]}
                >
                  <Input id="create-name" placeholder={defaultInputs.name} />
                </Form.Item>
                <Form.Item
                  name="category"
                  htmlFor="create-category"
                  label={defaultLabels.category}
                  rules={[
                    ruleRequired("Loại trạm xe buýt không được để trống !"),
                  ]}
                >
                  <Select
                    allowClear
                    id="create-category"
                    placeholder={defaultInputs.category}
                    options={[
                      {
                        label: PointTypeValue.school,
                        value: PointTypeValue.school,
                      },
                      {
                        label: PointTypeValue.pickup,
                        value: PointTypeValue.pickup,
                      },
                    ]}
                    onChange={(val: any) => setCategoryValue(val)}
                  />
                </Form.Item>
                <Form.Item
                  name="lat"
                  htmlFor="create-lat"
                  label={defaultLabels.lat}
                  rules={[ruleRequired("Toạ độ x không được để trống !")]}
                >
                  <InputNumber
                    min={0}
                    id="create-lat"
                    placeholder={defaultInputs.lat}
                    onChange={(val: any) => setLatValue(val)}
                  />
                </Form.Item>
                <Form.Item
                  name="lng"
                  htmlFor="create-lng"
                  label={defaultLabels.lng}
                  rules={[ruleRequired("Toạ độ y không được để trống !")]}
                >
                  <InputNumber
                    min={0}
                    id="create-lng"
                    placeholder={defaultInputs.lng}
                    onChange={(val: any) => setLngValue(val)}
                  />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  label={defaultLabels.map}
                  className="has-map multiple-2"
                >
                  <LeafletMap
                    pointType={categoryValue}
                    lat={latValue}
                    lng={lngValue}
                    type="select"
                    handlePickupSelected={handlePickupSelected}
                  />
                </Form.Item>
              </Col>
              <Col></Col>
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
  const PickupUpdate: React.FC<{ pickup: PickupType }> = ({ pickup }) => {
    const [form] = Form.useForm<PickupType>();
    // Dữ liệu giúp đồng nhất với bản đồ
    const [categoryValue, setCategoryValue] = useState<string>(
      pickup.category || ""
    );
    const [latValue, setLatValue] = useState<number>(pickup.lat || 0);
    const [lngValue, setLngValue] = useState<number>(pickup.lng || 0);

    const handlePickupSelected = (lat: number, lng: number, info: any) => {
      setLatValue(lat);
      setLngValue(lng);
      form.setFieldValue("lat", lat);
      form.setFieldValue("lng", lng);
    };

    return (
      <>
        <div className="pickup-content update">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              id: pickup.id || undefined,
              name: pickup.name || undefined,
              category: pickup.category || undefined,
              lat: pickup.lat || undefined,
              lng: pickup.lng || undefined,
              status: pickup.status || undefined,
            }}
            onFinish={() => {
              console.log("Form values:", form.getFieldsValue());
            }}
          >
            <Row className="split-3">
              <Col>
                <Row className="split-2">
                  <Col>
                    <Form.Item
                      name="id"
                      label={defaultLabels.id}
                      className="text-center"
                    >
                      <Input placeholder={defaultInputs.id} disabled />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item name="status" label={defaultLabels.status}>
                      <Select disabled />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  name="name"
                  htmlFor="update-name"
                  label={defaultLabels.name}
                  rules={[
                    ruleRequired("Tên trạm xe buýt không được để trống !"),
                  ]}
                >
                  <Input id="update-name" placeholder={defaultInputs.name} />
                </Form.Item>
                <Form.Item
                  name="category"
                  htmlFor="update-category"
                  label={defaultLabels.category}
                  rules={[
                    ruleRequired("Loại trạm xe buýt không được để trống !"),
                  ]}
                >
                  <Select
                    allowClear
                    id="update-category"
                    placeholder={defaultInputs.category}
                    options={[
                      {
                        label: PointTypeValue.school,
                        value: PointTypeValue.school,
                      },
                      {
                        label: PointTypeValue.pickup,
                        value: PointTypeValue.pickup,
                      },
                    ]}
                    onChange={(val: any) => setCategoryValue(val)}
                  />
                </Form.Item>
                <Form.Item
                  name="lat"
                  htmlFor="update-lat"
                  label={defaultLabels.lat}
                  rules={[ruleRequired("Toạ độ x không được để trống !")]}
                >
                  <InputNumber
                    min={0}
                    id="update-lat"
                    placeholder={defaultInputs.lat}
                    onChange={(val: any) => setLatValue(val)}
                  />
                </Form.Item>
                <Form.Item
                  name="lng"
                  htmlFor="update-lng"
                  label={defaultLabels.lng}
                  rules={[ruleRequired("Toạ độ y không được để trống !")]}
                >
                  <InputNumber
                    min={0}
                    id="update-lng"
                    placeholder={defaultInputs.lng}
                    onChange={(val: any) => setLngValue(val)}
                  />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  label={defaultLabels.map}
                  className="has-map multiple-2"
                >
                  <LeafletMap
                    pointType={categoryValue}
                    lat={latValue}
                    lng={lngValue}
                    type="select"
                    handlePickupSelected={handlePickupSelected}
                  />
                </Form.Item>
              </Col>
              <Col></Col>
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
  const PickupLock: React.FC<{ pickup: PickupType }> = ({ pickup }) => {
    return (
      <>
        <Alert
          message={
            "Trạm Xe buýt: " +
            "#" +
            pickup?.id +
            " - " +
            pickup?.name +
            " - " +
            pickup?.category
          }
          showIcon
          icon={
            <FontAwesomeIcon
              icon={
                pickup?.status === CommonStatusValue.active
                  ? faLock
                  : faLockOpen
              }
            />
          }
          description={
            "Bạn có chắc chắc muốn" +
            (pickup?.status === CommonStatusValue.active
              ? " khoá "
              : " mở khoá ") +
            "trạm xe buýt này ? Hành động không thể hoàn tác !"
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
  const PickupActions = {
    detail: (selectedPickup: PickupType) => (
      <PickupDetail pickup={selectedPickup} />
    ),
    create: () => <PickupCreate />,
    update: (selectedPickup: PickupType) => (
      <PickupUpdate pickup={selectedPickup} />
    ),
    lock: (selectedPickup: PickupType) => (
      <PickupLock pickup={selectedPickup} />
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
              &nbsp;{t("pickup-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("pickup-list")}
            </span>
          ),
        },
      ]);
      setCurrentCardTitle(t("pickup-list"));
      setCurrentCardContent("list");
    } else if (currentAction === "detail") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faUserGraduate} />
              &nbsp;{t("pickup-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("pickup-list")}
            </span>
          ),
        },
        { title: <span>{t("pickup-detail")}</span> },
      ]);
      setCurrentCardTitle(t("pickup-detail"));
      setCurrentCardContent("detail");
    } else if (currentAction === "create") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faUserGraduate} />
              &nbsp;{t("pickup-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("pickup-list")}
            </span>
          ),
        },
        { title: <span>{t("pickup-create")}</span> },
      ]);
      setCurrentCardTitle(t("pickup-create"));
      setCurrentCardContent("create");
    } else if (currentAction === "update") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faUserGraduate} />
              &nbsp;{t("pickup-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("pickup-list")}
            </span>
          ),
        },
        { title: <span>{t("pickup-update")}</span> },
      ]);
      setCurrentCardTitle(t("pickup-update"));
      setCurrentCardContent("update");
    } else if (currentAction === "lock") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faUserGraduate} />
              &nbsp;{t("pickup-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("pickup-list")}
            </span>
          ),
        },
        { title: <span>{t("pickup-lock")}</span> },
      ]);
      setCurrentCardTitle(t("pickup-lock"));
      setCurrentCardContent("lock");
    } else if (currentAction === "unlock") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faUserGraduate} />
              &nbsp;{t("pickup-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("pickup-list")}
            </span>
          ),
        },
        { title: <span>{t("pickup-unlock")}</span> },
      ]);
      setCurrentCardTitle(t("pickup-unlock"));
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
          <div className="pickup-data">
            <div className="admin-layout__main-filter">
              <div className="left">
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="Tìm theo họ và tên trạm xe buýt"
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
                  {t("pickup-create")}
                </Button>
              </div>
            </div>
            <CustomTableActions<PickupType>
              columns={columns}
              data={demoData || []}
              rowKey={(record) => String(record?.id)}
              // loading={isLoading}
              defaultPageSize={10}
              className="admin-layout__main-table table-data pickups"
            />
          </div>
        )}
        {currentCardContent === "detail" &&
          PickupActions.detail(currentSelectedItem!)}
        {currentCardContent === "create" && PickupActions.create()}
        {currentCardContent === "update" &&
          PickupActions.update(currentSelectedItem!)}
        {(currentCardContent === "lock" || currentCardContent === "unlock") &&
          PickupActions.lock(currentSelectedItem!)}
      </Card>
    </div>
  );
};

export default PickupPage;
