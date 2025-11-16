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
  List,
  Avatar,
} from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faList,
  faLock,
  faLockOpen,
  faMap,
  faPenToSquare,
  faPlus,
  faUserGraduate,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import type { ColumnsType } from "antd/es/table";
import type {
  BreadcrumbItemType,
  BreadcrumbSeparatorType,
} from "antd/es/breadcrumb/Breadcrumb";
import { ruleRequired } from "../../common/rules";
import { CommonStatusValue, PointTypeValue } from "../../common/values";
import type {
  RouteNotFormatType,
  RouteFormatType,
  RouteDetailsFormatType,
  PickupType,
} from "../../common/types";
import LeafletMap, {
  type HandleGetRouteInfoProps,
} from "../../components/leaflet-map";
import CustomTableActions from "../../components/table-actions";
import { useNotification } from "../../utils/showNotification";
import { getItemById } from "../../utils/getItemEvents";
import { getPickups } from "../../services/pickup-service";
import useCallApi from "../../api/useCall";
import {
  createRoute,
  getRoutes,
  updateRoute,
} from "../../services/route-service";

// Route Page
const RoutePage = () => {
  // Language
  const { t } = useTranslation();

  // Notification
  const { openNotification } = useNotification();

  // Execute
  const { execute, notify, loading } = useCallApi();

  // Cấu hình bảng dữ liệu (sau cập nhật lọc giới tính, phụ huynh, trạm và lớp)
  const [pickups, setPickups] = useState<PickupType[]>([]);
  const [routes, setRoutes] = useState<RouteFormatType[]>([]);
  const columns: ColumnsType<RouteFormatType> = [
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
      width: "22%",
      sorter: (a, b) => a?.name!.localeCompare(b?.name!),
    },
    {
      title: "Trạm BĐ",
      dataIndex: "startPickup",
      key: "startPickup",
      width: "16%",
      sorter: (a, b) => a?.startPickup!.localeCompare(b?.startPickup!),
    },
    {
      title: "Trạm KT",
      dataIndex: "endPickup",
      key: "endPickup",
      width: "16%",
      sorter: (a, b) => a?.endPickup!.localeCompare(b?.endPickup!),
    },
    {
      title: "Tổng m",
      dataIndex: "totalDistance",
      key: "totalDistance",
      width: "8%",
      sorter: (a, b) => a?.totalDistance! - b?.totalDistance!,
    },
    {
      title: "Tổng s",
      dataIndex: "totalTime",
      key: "totalTime",
      width: "8%",
      sorter: (a, b) => a?.totalTime! - b?.totalTime!,
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

  // Truy vấn dữ liệu
  const getPickupData = async () => {
    try {
      const response = await execute(getPickups(), false);

      if (response && response.result) {
        if (Array.isArray(response.data)) {
          setPickups(
            response.data.map((pickup) => ({
              ...pickup,
              category:
                pickup.category == "SCHOOL" ? "Trường học" : "Điểm đưa đón",
              status: pickup.status == "ACTIVE" ? "Hoạt động" : "Tạm dừng",
            }))
          );
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getRouteData = async () => {
    try {
      const response = await execute(getRoutes(), false);

      if (response && response.result) {
        if (Array.isArray(response.data)) {
          setRoutes(
            response.data.map((route) => ({
              ...route,
              status: route.status == "ACTIVE" ? "Hoạt động" : "Tạm dừng",
              routeDetails: route?.pickups?.map(
                (pickupNotFormat: { pickup: PickupType; order: number }) => ({
                  pickup: {
                    ...pickupNotFormat.pickup,
                    category:
                      pickupNotFormat.pickup.category == "SCHOOL"
                        ? "Trường học"
                        : "Điểm đưa đón",
                    status:
                      pickupNotFormat.pickup.status == "ACTIVE"
                        ? "Hoạt động"
                        : "Tạm dừng",
                  },
                  order: pickupNotFormat.order,
                })
              ),
            }))
          );

          console.log(routes);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getPickupData();
    getRouteData();
  }, []);

  // Lọc dữ liệu
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const filteredRouteList = routes.filter((route) => {
    const matchesName = route.name
      ?.toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesStatus = statusFilter ? route.status === statusFilter : true;
    return matchesName && matchesStatus;
  });

  // State giữ đối tượng được chọn hiện tại
  const [currentSelectedItem, setCurrentSelectedItem] =
    useState<RouteFormatType>();
  // State giữ hành động hiện tại
  const [currentAction, setCurrentAction] = useState<string>("list");
  // State giữ breadcrumb items hiện tại
  const [currentBreadcrumbItems, setCurrentBreadcrumbItems] =
    useState<Partial<BreadcrumbItemType & BreadcrumbSeparatorType>[]>();
  // State giữ card info hiện tại
  const [currentCardTitle, setCurrentCardTitle] = useState<string>(
    t("route-list")
  );
  const [currentCardContent, setCurrentCardContent] = useState<string>("list");

  // Route Actions
  const defaultLabels = {
    id: "Mã tuyến đường",
    name: "Tên tuyến đường",
    startPickup: "Trạm bắt đầu",
    endPickup: "Trạm kết thúc",
    totalDistance: "Tổng quãng đường (m)",
    totalTime: "Tổng thời gian (s)",
    status: "Trạng thái",
    map: "Bản đồ",
    list: "Danh sách",
  };
  const defaultInputs = {
    id: "Chưa xác định !",
    name: "Nhập Tên tuyến đường",
    startPickup: "Nhập Trạm bắt đầu",
    endPickup: "Nhập Trạm kết thúc",
    totalDistance: "Nhập Tổng quãng đường (m)",
    totalTime: "Nhập Tổng thời gian (s)",
    status: "Chọn Trạng thái",
    map: "",
    list: "",
  };
  const RouteDetail: React.FC<{ route: RouteFormatType }> = ({ route }) => {
    const [form] = Form.useForm<RouteFormatType>();
    const [showMap, setShowMap] = useState<boolean>(true);

    return (
      <>
        <div className="route-content detail">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              id: route.id || undefined,
              name: route.name || undefined,
              startPickup: route.startPickup || undefined,
              endPickup: route.endPickup || undefined,
              totalDistance: route.totalDistance || undefined,
              totalTime: route.totalTime || undefined,
              status: route.status || undefined,
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
                <Form.Item name="startPickup" label={defaultLabels.startPickup}>
                  <Input disabled />
                </Form.Item>
                <Form.Item name="endPickup" label={defaultLabels.endPickup}>
                  <Input disabled />
                </Form.Item>
                <Row className="split-2">
                  <Col>
                    <Form.Item
                      name="totalDistance"
                      label={defaultLabels.totalDistance}
                      className="margin-bottom-0"
                    >
                      <InputNumber disabled />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      name="totalTime"
                      label={defaultLabels.totalTime}
                      className="margin-bottom-0"
                    >
                      <InputNumber disabled />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col>
                <Form.Item
                  label={showMap ? defaultLabels.map : defaultLabels.list}
                  className="has-map multiple-2 margin-bottom-0"
                >
                  <div className="buttons">
                    <Button
                      variant="solid"
                      color="blue"
                      onClick={() => setShowMap(!showMap)}
                    >
                      <FontAwesomeIcon icon={!showMap ? faMap : faList} />
                      <span>Xem {!showMap ? "bản đồ" : "danh sách"}</span>
                    </Button>
                  </div>
                  <LeafletMap
                    type="detail"
                    routeDetails={route.routeDetails}
                    hidden={!showMap}
                  />
                  {!showMap && (
                    <>
                      <List
                        itemLayout="horizontal"
                        dataSource={route.routeDetails}
                        pagination={{ pageSize: 4 }}
                        renderItem={(routeDetail) => (
                          <List.Item key={routeDetail.pickup?.id}>
                            <List.Item.Meta
                              avatar={
                                <Avatar
                                  src={
                                    routeDetail.pickup?.category ===
                                    PointTypeValue.school
                                      ? "https://cdn-icons-png.flaticon.com/512/167/167707.png"
                                      : routeDetail.pickup?.category ===
                                        PointTypeValue.pickup
                                      ? "https://cdn-icons-png.flaticon.com/512/6395/6395324.png"
                                      : "https://cdn-icons-png.flaticon.com/512/1068/1068580.png"
                                  }
                                  size={50}
                                />
                              }
                              title={
                                <strong>
                                  {routeDetail.order} -{" "}
                                  {routeDetail.pickup?.name}
                                </strong>
                              }
                              description={
                                <>
                                  <div>
                                    Loại: {routeDetail.pickup?.category}
                                  </div>
                                  <div>
                                    Toạ độ: {routeDetail.pickup?.lat} -{" "}
                                    {routeDetail.pickup?.lng}
                                  </div>
                                </>
                              }
                            />
                          </List.Item>
                        )}
                      />
                    </>
                  )}
                </Form.Item>
              </Col>
              <Col></Col>
            </Row>
          </Form>
        </div>
      </>
    );
  };
  const RouteCreate: React.FC = () => {
    const [form] = Form.useForm<RouteFormatType>();
    const [routeDetailsValue, setRouteDetailsValue] = useState<
      RouteDetailsFormatType[]
    >([]);

    const [showMap, setShowMap] = useState<boolean>(true);
    const [showAddPickup, setShowAddPickup] = useState<boolean>(false);
    const [showRemovePickup, setShowRemovePickup] = useState<boolean>(false);
    const [pickupSelectedAdd, setPickupSelectedAdd] =
      useState<PickupType | null>(null);
    const [pickupSelectedRemove, setPickupSelectedRemove] = useState<
      number | null
    >(null);

    const handleGetBusInfo = ({
      distance,
      duration,
    }: HandleGetRouteInfoProps) => {
      form.setFieldValue("totalDistance", distance),
        form.setFieldValue("totalTime", duration);
    };
    useEffect(() => {
      if (routeDetailsValue.length >= 2) {
        form.setFieldValue(
          "name",
          `Tuyến ${routeDetailsValue[0].pickup?.name} → ${
            routeDetailsValue[routeDetailsValue.length - 1].pickup?.name
          }`
        );
        form.setFieldValue("startPickup", routeDetailsValue[0].pickup?.name);
        form.setFieldValue(
          "endPickup",
          routeDetailsValue[routeDetailsValue.length - 1].pickup?.name
        );
        form.setFieldValue("routeDetails", routeDetailsValue);
      } else {
        form.setFieldValue("routeDetails", undefined);
      }
    }, [routeDetailsValue]);

    const handleCreateRoute = async () => {
      const restResponse = await execute(
        createRoute({
          name: form.getFieldValue("name") || undefined,
          startPickup: form.getFieldValue("startPickup") || undefined,
          endPickup: form.getFieldValue("endPickup") || undefined,
          totalDistance: Number(
            form.getFieldValue("totalDistance") || undefined
          ),
          totalTime: Number(form.getFieldValue("totalTime") || undefined),
          status: form.getFieldValue("status") || undefined,
          pickups: routeDetailsValue?.map((routeDetail) => ({
            pickupId: routeDetail?.pickup?.id!,
            order: routeDetail?.order!,
          })),
        }),
        true
      );
      notify(restResponse!, "Thêm tuyến đường thành công");
      if (restResponse?.result) {
        getRouteData();
        setCurrentAction("list");
      }
    };

    return (
      <>
        <div className="route-content create">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              id: undefined,
              name: undefined,
              startPickup: undefined,
              endPickup: undefined,
              totalDistance: undefined,
              totalTime: undefined,
              status: undefined,
            }}
            autoComplete="off"
            onFinish={handleCreateRoute}
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
                        id="create-status"
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
                  </Col>
                </Row>
                <Form.Item
                  name="name"
                  htmlFor="create-name"
                  label={defaultLabels.name}
                  rules={[
                    ruleRequired("Tên tuyến đường không được để trống !"),
                  ]}
                >
                  <Input id="create-name" placeholder={defaultInputs.name} />
                </Form.Item>
                <Form.Item
                  name="startPickup"
                  htmlFor="create-startPickup"
                  label={defaultLabels.startPickup}
                  rules={[ruleRequired("Trạm bắt đầu không được để trống !")]}
                >
                  <Input
                    id="create-startPickup"
                    placeholder={defaultInputs.startPickup}
                  />
                </Form.Item>
                <Form.Item
                  name="endPickup"
                  htmlFor="create-endPickup"
                  label={defaultLabels.endPickup}
                  rules={[ruleRequired("Trạm kết thúc không được để trống !")]}
                >
                  <Input
                    id="create-endPickup"
                    placeholder={defaultInputs.endPickup}
                  />
                </Form.Item>
                <Row className="split-2">
                  <Col>
                    <Form.Item
                      name="totalDistance"
                      htmlFor="create-totalDistance"
                      label={defaultLabels.totalDistance}
                      rules={[ruleRequired("Cần nhập Quãng đường (m) !")]}
                    >
                      <InputNumber
                        min={0}
                        id="create-totalDistance"
                        placeholder={defaultInputs.totalDistance}
                      />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      name="totalTime"
                      htmlFor="create-totalTime"
                      label={defaultLabels.totalTime}
                      rules={[ruleRequired("Cần nhập Thời gian (s) !")]}
                    >
                      <InputNumber
                        min={0}
                        id="create-totalTime"
                        placeholder={defaultInputs.totalTime}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col>
                <Form.Item
                  name="routeDetails"
                  label={showMap ? defaultLabels.map : defaultLabels.list}
                  className={
                    "has-map multiple-2 " +
                    (showAddPickup || showRemovePickup ? "has-select" : "")
                  }
                  rules={[ruleRequired("Tuyến đường cần có ít nhất 2 trạm !")]}
                >
                  <div className="buttons">
                    <Button
                      variant="solid"
                      color="green"
                      onClick={() => {
                        setShowAddPickup(true);
                        setShowRemovePickup(false);
                        setPickupSelectedAdd(null);
                        setPickupSelectedRemove(null);
                      }}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                      <span>Thêm trạm</span>
                    </Button>
                    <Button
                      variant="solid"
                      color="red"
                      onClick={() => {
                        setShowAddPickup(false);
                        setShowRemovePickup(true);
                        setPickupSelectedAdd(null);
                        setPickupSelectedRemove(null);
                      }}
                    >
                      <FontAwesomeIcon icon={faXmark} />
                      <span>Xoá trạm</span>
                    </Button>
                    <Button
                      variant="solid"
                      color="blue"
                      onClick={() => setShowMap(!showMap)}
                    >
                      <FontAwesomeIcon icon={!showMap ? faMap : faList} />
                      <span>Xem {!showMap ? "bản đồ" : "danh sách"}</span>
                    </Button>
                  </div>
                  {/* Làm vậy để tránh tải lại bản đồ nhiều lần */}
                  <Row
                    className="select-pickup"
                    style={{ display: showAddPickup ? "flex" : "none" }}
                  >
                    <Select
                      allowClear
                      showSearch
                      placeholder="Chọn Trạm xe buýt để thêm"
                      options={pickups?.map((pickup) => ({
                        label:
                          "#" +
                          pickup?.id +
                          " - " +
                          pickup?.name +
                          " - " +
                          pickup?.category,
                        value: pickup?.id,
                      }))}
                      value={pickupSelectedAdd?.id}
                      onChange={(val: number) =>
                        setPickupSelectedAdd(getItemById(pickups, val))
                      }
                    />
                    <Button
                      htmlType="button"
                      type="primary"
                      onClick={(e) => {
                        e.preventDefault();

                        if (
                          routeDetailsValue?.some(
                            (routeDetail) =>
                              routeDetail.pickup?.id === pickupSelectedAdd?.id
                          )
                        ) {
                          openNotification({
                            type: "warning",
                            message: "Cảnh báo",
                            description:
                              "Trạm được chọn hiện tại đã có trên tuyến đường !",
                            duration: 1.5,
                          });

                          return;
                        }

                        let newRouteDetailsValue = routeDetailsValue?.map(
                          (routeDetail) => routeDetail
                        );
                        newRouteDetailsValue.push({
                          pickup: pickupSelectedAdd!,
                          order: routeDetailsValue.length + 1,
                        });
                        setRouteDetailsValue(newRouteDetailsValue);
                        setShowAddPickup(false);
                        setPickupSelectedAdd(null);
                        setPickupSelectedRemove(null);
                      }}
                    >
                      Xác nhận
                    </Button>
                  </Row>
                  <Row
                    className="select-pickup"
                    style={{ display: showRemovePickup ? "flex" : "none" }}
                  >
                    <Select
                      allowClear
                      showSearch
                      placeholder="Chọn Trạm xe buýt để xoá"
                      options={routeDetailsValue?.map((routeDetail) => ({
                        label:
                          "#" +
                          routeDetail.pickup?.id +
                          " - " +
                          routeDetail.pickup?.name +
                          " - " +
                          routeDetail.pickup?.category,
                        value: routeDetail.pickup?.id,
                      }))}
                      value={pickupSelectedRemove}
                      onChange={(val: number) => setPickupSelectedRemove(val)}
                    />
                    <Button
                      htmlType="button"
                      type="primary"
                      onClick={(e) => {
                        e.preventDefault();

                        // if (routeDetailsValue.length == 2) {
                        //   openNotification({
                        //     type: "warning",
                        //     message: "Cảnh báo",
                        //     description:
                        //       "Tuyến đường cần ít nhất 2 trạm đưa đón !",
                        //     duration: 1.5,
                        //   });

                        //   return;
                        // }

                        let newRouteDetailsValue = routeDetailsValue
                          ?.filter(
                            (routeDetail) =>
                              routeDetail.pickup?.id !== pickupSelectedRemove
                          )
                          ?.map((newRouteDetail, index) => ({
                            pickup: newRouteDetail.pickup,
                            order: index + 1,
                          }));
                        setRouteDetailsValue(newRouteDetailsValue);
                        setShowRemovePickup(false);
                        setPickupSelectedAdd(null);
                        setPickupSelectedRemove(null);
                      }}
                    >
                      Xác nhận
                    </Button>
                  </Row>
                  <LeafletMap
                    type="detail"
                    routeDetails={routeDetailsValue}
                    handleGetRouteInfo={handleGetBusInfo}
                    hidden={!showMap}
                  />
                  {!showMap && (
                    <>
                      <List
                        itemLayout="horizontal"
                        dataSource={routeDetailsValue}
                        pagination={{ pageSize: 4 }}
                        renderItem={(routeDetail) => (
                          <List.Item key={routeDetail.pickup?.id}>
                            <List.Item.Meta
                              avatar={
                                <Avatar
                                  src={
                                    routeDetail.pickup?.category ===
                                    PointTypeValue.school
                                      ? "https://cdn-icons-png.flaticon.com/512/167/167707.png"
                                      : routeDetail.pickup?.category ===
                                        PointTypeValue.pickup
                                      ? "https://cdn-icons-png.flaticon.com/512/6395/6395324.png"
                                      : "https://cdn-icons-png.flaticon.com/512/1068/1068580.png"
                                  }
                                  size={50}
                                />
                              }
                              title={
                                <strong>
                                  {routeDetail.order} -{" "}
                                  {routeDetail.pickup?.name}
                                </strong>
                              }
                              description={
                                <>
                                  <div>
                                    Loại: {routeDetail.pickup?.category}
                                  </div>
                                  <div>
                                    Toạ độ: {routeDetail.pickup?.lat} -{" "}
                                    {routeDetail.pickup?.lng}
                                  </div>
                                </>
                              }
                            />
                          </List.Item>
                        )}
                      />
                    </>
                  )}
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
  const RouteUpdate: React.FC<{ route: RouteFormatType }> = ({ route }) => {
    const [form] = Form.useForm<RouteFormatType>();
    const [routeDetailsValue, setRouteDetailsValue] = useState<
      RouteDetailsFormatType[]
    >(route.routeDetails || []);

    const [showMap, setShowMap] = useState<boolean>(true);
    const [showAddPickup, setShowAddPickup] = useState<boolean>(false);
    const [showRemovePickup, setShowRemovePickup] = useState<boolean>(false);
    const [pickupSelectedAdd, setPickupSelectedAdd] =
      useState<PickupType | null>(null);
    const [pickupSelectedRemove, setPickupSelectedRemove] = useState<
      number | null
    >(null);

    const handleGetBusInfo = ({
      distance,
      duration,
    }: HandleGetRouteInfoProps) => {
      form.setFieldValue("totalDistance", distance),
        form.setFieldValue("totalTime", duration);
    };
    useEffect(() => {
      if (routeDetailsValue.length >= 2) {
        form.setFieldValue(
          "name",
          `Tuyến ${routeDetailsValue[0].pickup?.name} → ${
            routeDetailsValue[routeDetailsValue.length - 1].pickup?.name
          }`
        );
        form.setFieldValue("startPickup", routeDetailsValue[0].pickup?.name);
        form.setFieldValue(
          "endPickup",
          routeDetailsValue[routeDetailsValue.length - 1].pickup?.name
        );
        form.setFieldValue("routeDetails", routeDetailsValue);
      } else {
        form.setFieldValue("routeDetails", undefined);
      }
    }, [routeDetailsValue]);

    const handleUpdateRoute = async () => {
      const restResponse = await execute(
        updateRoute(route.id!, {
          name: form.getFieldValue("name") || undefined,
          startPickup: form.getFieldValue("startPickup") || undefined,
          endPickup: form.getFieldValue("endPickup") || undefined,
          totalDistance: Number(
            form.getFieldValue("totalDistance") || undefined
          ),
          totalTime: Number(form.getFieldValue("totalTime") || undefined),
          pickups: routeDetailsValue?.map((routeDetail) => ({
            pickupId: routeDetail?.pickup?.id!,
            order: routeDetail?.order!,
          })),
        }),
        true
      );
      notify(restResponse!, "Thêm tuyến đường thành công");
      if (restResponse?.result) {
        getRouteData();
        setCurrentAction("list");
      }
    };

    return (
      <>
        <div className="route-content create">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              id: route.id || undefined,
              name: route.name || undefined,
              startPickup: route.startPickup || undefined,
              endPickup: route.endPickup || undefined,
              totalDistance: route.totalDistance || undefined,
              totalTime: route.totalTime || undefined,
              status: route.status || undefined,
            }}
            autoComplete="off"
            onFinish={handleUpdateRoute}
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
                    ruleRequired("Tên tuyến đường không được để trống !"),
                  ]}
                >
                  <Input id="update-name" placeholder={defaultInputs.name} />
                </Form.Item>
                <Form.Item
                  name="startPickup"
                  htmlFor="update-startPickup"
                  label={defaultLabels.startPickup}
                  rules={[ruleRequired("Trạm bắt đầu không được để trống !")]}
                >
                  <Input
                    id="update-startPickup"
                    placeholder={defaultInputs.startPickup}
                  />
                </Form.Item>
                <Form.Item
                  name="endPickup"
                  htmlFor="update-endPickup"
                  label={defaultLabels.endPickup}
                  rules={[ruleRequired("Trạm kết thúc không được để trống !")]}
                >
                  <Input
                    id="update-endPickup"
                    placeholder={defaultInputs.endPickup}
                  />
                </Form.Item>
                <Row className="split-2">
                  <Col>
                    <Form.Item
                      name="totalDistance"
                      htmlFor="update-totalDistance"
                      label={defaultLabels.totalDistance}
                      rules={[ruleRequired("Cần nhập Tổng quãng đường (m) !")]}
                    >
                      <InputNumber
                        min={0}
                        id="update-totalDistance"
                        placeholder={defaultInputs.totalDistance}
                      />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      name="totalTime"
                      htmlFor="update-totalTime"
                      label={defaultLabels.totalTime}
                      rules={[ruleRequired("Cần nhập Tổng thời gian (s) !")]}
                    >
                      <InputNumber
                        min={0}
                        id="update-totalTime"
                        placeholder={defaultInputs.totalTime}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col>
                <Form.Item
                  name="routeDetails"
                  label={showMap ? defaultLabels.map : defaultLabels.list}
                  className={
                    "has-map multiple-2 " +
                    (showAddPickup || showRemovePickup ? "has-select" : "")
                  }
                  rules={[ruleRequired("Tuyến đường cần có ít nhất 2 trạm !")]}
                >
                  <div className="buttons">
                    <Button
                      variant="solid"
                      color="green"
                      onClick={() => {
                        setShowAddPickup(!showAddPickup);
                        setShowRemovePickup(false);
                        setPickupSelectedAdd(null);
                        setPickupSelectedRemove(null);
                      }}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                      <span>Thêm trạm</span>
                    </Button>
                    <Button
                      variant="solid"
                      color="red"
                      onClick={() => {
                        setShowAddPickup(false);
                        setShowRemovePickup(!showRemovePickup);
                        setPickupSelectedAdd(null);
                        setPickupSelectedRemove(null);
                      }}
                    >
                      <FontAwesomeIcon icon={faXmark} />
                      <span>Xoá trạm</span>
                    </Button>
                    <Button
                      variant="solid"
                      color="blue"
                      onClick={() => setShowMap(!showMap)}
                    >
                      <FontAwesomeIcon icon={!showMap ? faMap : faList} />
                      <span>Xem {!showMap ? "bản đồ" : "danh sách"}</span>
                    </Button>
                  </div>
                  {/* Làm vậy để tránh tải lại bản đồ nhiều lần */}
                  <Row
                    className="select-pickup"
                    style={{ display: showAddPickup ? "flex" : "none" }}
                  >
                    <Select
                      allowClear
                      showSearch
                      placeholder="Chọn Trạm xe buýt để thêm"
                      options={pickups?.map((pickup) => ({
                        label:
                          "#" +
                          pickup?.id +
                          " - " +
                          pickup?.name +
                          " - " +
                          pickup?.category,
                        value: pickup?.id,
                      }))}
                      value={pickupSelectedAdd?.id}
                      onChange={(val: number) =>
                        setPickupSelectedAdd(getItemById(pickups, val))
                      }
                    />
                    <Button
                      htmlType="button"
                      type="primary"
                      onClick={(e) => {
                        e.preventDefault();

                        if (
                          routeDetailsValue?.some(
                            (routeDetail) =>
                              routeDetail.pickup?.id === pickupSelectedAdd?.id
                          )
                        ) {
                          openNotification({
                            type: "warning",
                            message: "Cảnh báo",
                            description:
                              "Trạm được chọn hiện tại đã có trên tuyến đường !",
                            duration: 1.5,
                          });

                          return;
                        }

                        let newRouteDetailsValue = routeDetailsValue?.map(
                          (routeDetail) => routeDetail
                        );
                        newRouteDetailsValue.push({
                          pickup: pickupSelectedAdd!,
                          order: routeDetailsValue.length + 1,
                        });
                        setRouteDetailsValue(newRouteDetailsValue);
                        setShowAddPickup(false);
                        setPickupSelectedAdd(null);
                        setPickupSelectedRemove(null);
                      }}
                    >
                      Xác nhận
                    </Button>
                  </Row>
                  <Row
                    className="select-pickup"
                    style={{ display: showRemovePickup ? "flex" : "none" }}
                  >
                    <Select
                      allowClear
                      showSearch
                      placeholder="Chọn Trạm xe buýt để xoá"
                      options={routeDetailsValue?.map((routeDetail) => ({
                        label:
                          "#" +
                          routeDetail.pickup?.id +
                          " - " +
                          routeDetail.pickup?.name +
                          " - " +
                          routeDetail.pickup?.category,
                        value: routeDetail.pickup?.id,
                      }))}
                      value={pickupSelectedRemove}
                      onChange={(val: number) => setPickupSelectedRemove(val)}
                    />
                    <Button
                      htmlType="button"
                      type="primary"
                      onClick={(e) => {
                        e.preventDefault();

                        // if (routeDetailsValue.length == 2) {
                        //   openNotification({
                        //     type: "warning",
                        //     message: "Cảnh báo",
                        //     description:
                        //       "Tuyến đường cần ít nhất 2 trạm đưa đón !",
                        //     duration: 1.5,
                        //   });

                        //   return;
                        // }

                        let newRouteDetailsValue = routeDetailsValue
                          ?.filter(
                            (routeDetail) =>
                              routeDetail.pickup?.id !== pickupSelectedRemove
                          )
                          ?.map((newRouteDetail, index) => ({
                            pickup: newRouteDetail.pickup,
                            order: index + 1,
                          }));
                        setRouteDetailsValue(newRouteDetailsValue);
                        setShowRemovePickup(false);
                        setPickupSelectedAdd(null);
                        setPickupSelectedRemove(null);
                      }}
                    >
                      Xác nhận
                    </Button>
                  </Row>
                  <LeafletMap
                    type="detail"
                    routeDetails={routeDetailsValue}
                    handleGetRouteInfo={handleGetBusInfo}
                    hidden={!showMap}
                  />
                  {!showMap && (
                    <>
                      <List
                        itemLayout="horizontal"
                        dataSource={routeDetailsValue}
                        pagination={{ pageSize: 4 }}
                        renderItem={(routeDetail) => (
                          <List.Item key={routeDetail.pickup?.id}>
                            <List.Item.Meta
                              avatar={
                                <Avatar
                                  src={
                                    routeDetail.pickup?.category ===
                                    PointTypeValue.school
                                      ? "https://cdn-icons-png.flaticon.com/512/167/167707.png"
                                      : routeDetail.pickup?.category ===
                                        PointTypeValue.pickup
                                      ? "https://cdn-icons-png.flaticon.com/512/6395/6395324.png"
                                      : "https://cdn-icons-png.flaticon.com/512/1068/1068580.png"
                                  }
                                  size={50}
                                />
                              }
                              title={
                                <strong>
                                  {routeDetail.order} -{" "}
                                  {routeDetail.pickup?.name}
                                </strong>
                              }
                              description={
                                <>
                                  <div>
                                    Loại: {routeDetail.pickup?.category}
                                  </div>
                                  <div>
                                    Toạ độ: {routeDetail.pickup?.lat} -{" "}
                                    {routeDetail.pickup?.lng}
                                  </div>
                                </>
                              }
                            />
                          </List.Item>
                        )}
                      />
                    </>
                  )}
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
  const RouteLock: React.FC<{ route: RouteFormatType }> = ({ route }) => {
    const handleLockRoute = async () => {
      const restResponse = await execute(
        updateRoute(route.id!, {
          status:
            route.status === CommonStatusValue.active ? "INACTIVE" : "ACTIVE",
        }),
        true
      );
      notify(
        restResponse!,
        route.status === CommonStatusValue.active
          ? "Khoá tuyến đường thành công"
          : "Mở khoá tuyến đường thành công"
      );
      if (restResponse?.result) {
        getRouteData();
        setCurrentAction("list");
      }
    };

    return (
      <>
        <Alert
          message={"Tuyến đường: " + "#" + route?.id + " - " + route?.name}
          showIcon
          icon={
            <FontAwesomeIcon
              icon={
                route?.status === CommonStatusValue.active ? faLock : faLockOpen
              }
            />
          }
          description={
            "Bạn có chắc chắc muốn" +
            (route?.status === CommonStatusValue.active
              ? " khoá "
              : " mở khoá ") +
            "tuyến đường này ? Hành động không thể hoàn tác !"
          }
          type="error"
          action={
            <Button
              color="danger"
              variant="solid"
              onClick={() => handleLockRoute()}
            >
              Xác nhận
            </Button>
          }
        />
      </>
    );
  };
  const RouteActions = {
    detail: (selectedRoute: RouteFormatType) => (
      <RouteDetail route={selectedRoute} />
    ),
    create: () => <RouteCreate />,
    update: (selectedRoute: RouteFormatType) => (
      <RouteUpdate route={selectedRoute} />
    ),
    lock: (selectedRoute: RouteFormatType) => (
      <RouteLock route={selectedRoute} />
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
              &nbsp;{t("route-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("route-list")}
            </span>
          ),
        },
      ]);
      setCurrentCardTitle(t("route-list"));
      setCurrentCardContent("list");
    } else if (currentAction === "detail") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faUserGraduate} />
              &nbsp;{t("route-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("route-list")}
            </span>
          ),
        },
        { title: <span>{t("route-detail")}</span> },
      ]);
      setCurrentCardTitle(t("route-detail"));
      setCurrentCardContent("detail");
    } else if (currentAction === "create") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faUserGraduate} />
              &nbsp;{t("route-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("route-list")}
            </span>
          ),
        },
        { title: <span>{t("route-create")}</span> },
      ]);
      setCurrentCardTitle(t("route-create"));
      setCurrentCardContent("create");
    } else if (currentAction === "update") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faUserGraduate} />
              &nbsp;{t("route-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("route-list")}
            </span>
          ),
        },
        { title: <span>{t("route-update")}</span> },
      ]);
      setCurrentCardTitle(t("route-update"));
      setCurrentCardContent("update");
    } else if (currentAction === "lock") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faUserGraduate} />
              &nbsp;{t("route-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("route-list")}
            </span>
          ),
        },
        { title: <span>{t("route-lock")}</span> },
      ]);
      setCurrentCardTitle(t("route-lock"));
      setCurrentCardContent("lock");
    } else if (currentAction === "unlock") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faUserGraduate} />
              &nbsp;{t("route-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("route-list")}
            </span>
          ),
        },
        { title: <span>{t("route-unlock")}</span> },
      ]);
      setCurrentCardTitle(t("route-unlock"));
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
          <div className="route-data">
            <div className="admin-layout__main-filter">
              <div className="left">
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="Tìm theo họ và tên tuyến đường"
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
                  icon={<FontAwesomeIcon icon={faPlus} />}
                  onClick={() => setCurrentAction("create")}
                >
                  {t("route-create")}
                </Button>
              </div>
            </div>
            <CustomTableActions<RouteFormatType>
              columns={columns}
              data={filteredRouteList || []}
              rowKey={(record) => String(record?.id)}
              loading={loading}
              defaultPageSize={10}
              className="admin-layout__main-table table-data routes"
            />
          </div>
        )}
        {currentCardContent === "detail" &&
          RouteActions.detail(currentSelectedItem!)}
        {currentCardContent === "create" && RouteActions.create()}
        {currentCardContent === "update" &&
          RouteActions.update(currentSelectedItem!)}
        {(currentCardContent === "lock" || currentCardContent === "unlock") &&
          RouteActions.lock(currentSelectedItem!)}
      </Card>
    </div>
  );
};

export default RoutePage;
