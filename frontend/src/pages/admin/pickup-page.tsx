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
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import type { ColumnsType } from "antd/es/table";
import type {
  BreadcrumbItemType,
  BreadcrumbSeparatorType,
} from "antd/es/breadcrumb/Breadcrumb";
import { ruleRequired } from "../../common/rules";
import { CommonStatusValue, PointTypeValue } from "../../common/values";
import type { PickupType } from "../../common/types";
import LeafletMap, {
  type HandleSelectedPickupProps,
} from "../../components/leaflet-map";
import CustomTableActions from "../../components/table-actions";
import { useNotification } from "../../utils/showNotification";
import useCallApi from "../../api/useCall";
import { createPickup, getPickups, updatePickup as updatePickupService } from "../../services/pickup-service";
import type { PickupResponse } from "../../responses/pickup.response";
import { getCommonStatusText, getPickupCategoryName } from "../../utils/vi-trans";

const { Option } = Select;

// Pickup Page
const PickupPage = () => {

  const { t } = useTranslation();

  const { openNotification } = useNotification();

  const { execute } = useCallApi();

  const [pickupData, setPickupData] = useState<PickupResponse[]>([]);

  const handleGetData = async () => {
    const restResponse = await execute(getPickups());
    if (restResponse?.result) {
      setPickupData(restResponse.data);
    }
  };
  useEffect(() => {
    handleGetData();
  }, []);

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const filteredPickupList = pickupData.filter((pickup) => {
    const matchesName = pickup.name
      ?.toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesStatus = statusFilter ? pickup.status === statusFilter : true;
    return matchesName && matchesStatus;
  });

  const columns: ColumnsType<PickupType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: "10%",
      sorter: (a, b) => a?.id! - b?.id!,
    },
    {
      title: "Tên trạm",
      dataIndex: "name",
      key: "name",
      width: "27%",
      sorter: (a, b) => a?.name!.localeCompare(b?.name!),
    },
    {
      title: "Loại trạm",
      dataIndex: "category",
      key: "category",
      width: "18%",
      sorter: (a, b) => a?.category!.localeCompare(b?.category!),
      render: (category: string) => getPickupCategoryName(category)
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
        <Tag color={status === "ACTIVE" ? "green" : "red"}>
          {getCommonStatusText(status)}
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
                record.status === "ACTIVE" ? "lock" : "unlock"
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
              category: getPickupCategoryName(pickup.category || ""),
              lat: pickup.lat || undefined,
              lng: pickup.lng || undefined,
              status: getCommonStatusText(pickup.status || ""),
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
    const [latValue, setLatValue] = useState<number | undefined>(undefined);
    const [lngValue, setLngValue] = useState<number | undefined>(undefined);
    const [categoryValue, setCategoryValue] = useState<string | undefined>(
      undefined
    );

    const addPickup = async (form: PickupType) => {
      try {
        const formatData = {
          ...form,
          category: form.category == "Trường học" ? "SCHOOL" : "PICKUP",
          status: form.status == "Hoạt động" ? "ACTIVE" : "INACTIVE",
        };

        const response = await execute(createPickup(formatData), true);
        //console.log(response)
        if (response!.statusCode == 201) {
          openNotification({
            type: "success",
            message: "Thành công",
            description: "Thêm trạm xe buýt thành công!",
            duration: 2,
          });
          setCurrentAction("list");
          handleGetData();
        }
      } catch (error) {
        console.error(error);
        openNotification({
          type: "error",
          message: "Lỗi",
          description: "thêm trạm xe buýt thất bại!",
          duration: 2,
        });
      }
    };

    const handleSelectedPickup = ({
      lat,
      lng,
      info,
    }: HandleSelectedPickupProps) => {
      setLatValue(lat!);
      setLngValue(lng!);
      form.setFieldValue("lat", lat);
      form.setFieldValue("lng", lng);
      console.log(info);
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
            autoComplete="off"
            onFinish={() => {
              addPickup(form.getFieldsValue());
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
                    lat={latValue}
                    lng={lngValue}
                    pointType={categoryValue}
                    type="select"
                    handleSelectedPickup={handleSelectedPickup}
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

    const handleSelectedPickup = ({
      lat,
      lng,
      info,
    }: HandleSelectedPickupProps) => {
      setLatValue(lat!);
      setLngValue(lng!);
      form.setFieldValue("lat", lat);
      form.setFieldValue("lng", lng);
    };

    const updatePickup = async (form: PickupType) => {
      try {
        const formatData = {
          ...form,
          category: form.category == "Trường học" ? "SCHOOL" : "PICKUP",
          status: form.status == "Hoạt động" ? "ACTIVE" : "INACTIVE",
        };

        const response = await execute(updatePickupService(formatData));
        if (response.statusCode == 200) {
          openNotification({
            type: "success",
            message: "Thành công",
            description: "Cập nhật trạm xe buýt thành công!",
            duration: 2,
          });
          setCurrentAction("list");
          handleGetData();
        }
      } catch (error) {
        console.error(error);
        openNotification({
          type: "error",
          message: "Lỗi",
          description: "Cập nhật trạm xe buýt thất bại!",
          duration: 2,
        });
      }
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
            autoComplete="off"
            onFinish={() => {
              updatePickup(form.getFieldsValue());
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
                    handleSelectedPickup={handleSelectedPickup}
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
    const updateStatus = async (form: PickupType) => {
      try {
        const response = await execute(updatePickupService(form), true);
        if (response!.statusCode == 200) {
          openNotification({
            type: "success",
            message: "Thành công",
            description:
              form.status == "INACTIVE"
                ? "Khóa trạm xe buýt thành công!"
                : "Mở khóa trạm xe buýt thành công!",
            duration: 1.5,
          });
          setCurrentAction("list");
          handleGetData();
        }
      } catch (error) {
        console.error(error);
        openNotification({
          type: "error",
          message: "Lỗi",
          description:
            form.status == "INACTIVE"
              ? "Khóa trạm xe buýt thất bại!"
              : "Mở khóa trạm xe buýt thất bại!",
          duration: 1.5,
        });
      }
    };

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
                const newPickup = {
                  ...pickup,
                  status: pickup.status == "Hoạt động" ? "INACTIVE" : "ACTIVE",
                  category:
                    pickup.category == "Trường học" ? "SCHOOL" : "PICKUP",
                };

                updateStatus(newPickup);
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
              <FontAwesomeIcon icon={faLocationDot} />
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
              <FontAwesomeIcon icon={faLocationDot} />
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
              <FontAwesomeIcon icon={faLocationDot} />
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
              <FontAwesomeIcon icon={faLocationDot} />
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
              <FontAwesomeIcon icon={faLocationDot} />
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
              <FontAwesomeIcon icon={faLocationDot} />
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

  useEffect(() => {
    console.log(filteredPickupList);
  }, [filteredPickupList]);

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
                  className="filter-find"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
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
                  {t("pickup-create")}
                </Button>
              </div>
            </div>
            <CustomTableActions<PickupType>
              columns={columns}
              data={filteredPickupList || []}
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
