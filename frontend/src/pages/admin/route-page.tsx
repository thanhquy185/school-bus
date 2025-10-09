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
  DatePicker,
  TimePicker,
  List,
  Avatar,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
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
import LeafletMap from "../../components/leaflet-map";
import CustomTableActions from "../../components/table-actions";
import { useNotification } from "../../utils/showNotification";
import dayjs from "dayjs";
import { getItemById } from "../../utils/getItemEvents";

// Route Page
const RoutePage = () => {
  // Language
  const { t } = useTranslation();

  // Notification
  const { openNotification } = useNotification();

  // Cấu hình bảng dữ liệu (sau cập nhật lọc giới tính, phụ huynh, trạm và lớp)
  const pickupData: PickupType[] = [
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
    {
      id: 3,
      name: "Trạm Ngã 3 Tô Hiến Thành",
      category: "Điểm đưa đón",
      lat: 10.782542301538852,
      lng: 106.67269945487907,
      status: "Hoạt động",
    },
    {
      id: 4,
      name: "Trạm Vòng xoay Dân Chủ",
      category: "Điểm đưa đón",
      lat: 10.778231651587179,
      lng: 106.68071896686253,
      status: "Hoạt động",
    },
    {
      id: 5,
      name: "Trạm Nhà hát Hoà Bình",
      category: "Điểm đưa đón",
      lat: 10.771691782379415,
      lng: 106.67420637069971,
      status: "Hoạt động",
    },
    {
      id: 6,
      name: "Trạm Vòng xoay Lý Thái Tổ",
      category: "Điểm đưa đón",
      lat: 10.767212337954136,
      lng: 106.67562797183044,
      status: "Hoạt động",
    },
    {
      id: 7,
      name: "Trạm Vòng xoay Cộng Hoà",
      category: "Điểm đưa đón",
      lat: 10.764561529473132,
      lng: 106.6818913125902,
      status: "Hoạt động",
    },
  ];
  const demoData: RouteFormatType[] = [
    {
      id: 1,
      name: "Tuyến CV Lê Thị Riêng-Trường Đại học Sài Gòn",
      startPickup: "Công Viên Lê Thị Riêng",
      endPickup: "Trường Đại học Sài Gòn",
      startTime: "07:00:00",
      endTime: "08:00:00",
      status: "Hoạt động",
      routeDetails: [
        {
          pickup: {
            id: 2,
            name: "Trạm Công viên Lê Thị Riêng",
            category: "Điểm đưa đón",
            lat: 10.786197005344277,
            lng: 106.66577696800232,
            status: "Tạm dừng",
          },
          order: 1,
        },
        {
          pickup: {
            id: 3,
            name: "Trạm Ngã 3 Tô Hiến Thành",
            category: "Điểm đưa đón",
            lat: 10.782542301538852,
            lng: 106.67269945487907,
            status: "Hoạt động",
          },
          order: 2,
        },
        {
          pickup: {
            id: 4,
            name: "Trạm Vòng xoay Dân Chủ",
            category: "Điểm đưa đón",
            lat: 10.778231651587179,
            lng: 106.68071896686253,
            status: "Hoạt động",
          },
          order: 3,
        },
        {
          pickup: {
            id: 5,
            name: "Trạm Nhà hát Hoà Bình",
            category: "Điểm đưa đón",
            lat: 10.771691782379415,
            lng: 106.67420637069971,
            status: "Hoạt động",
          },
          order: 4,
        },
        {
          pickup: {
            id: 6,
            name: "Trạm Vòng xoay Lý Thái Tổ",
            category: "Điểm đưa đón",
            lat: 10.767212337954136,
            lng: 106.67562797183044,
            status: "Hoạt động",
          },
          order: 5,
        },
        {
          pickup: {
            id: 7,
            name: "Trạm Vòng xoay Cộng Hoà",
            category: "Điểm đưa đón",
            lat: 10.764561529473132,
            lng: 106.6818913125902,
            status: "Hoạt động",
          },
          order: 6,
        },
        {
          pickup: {
            id: 1,
            name: "Trường Đại học Sài Gòn",
            category: "Trường học",
            lat: 10.75960314081626,
            lng: 106.68201506137848,
            status: "Hoạt động",
          },
          order: 7,
        },
      ],
    },
  ];
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
      width: "12%",
      sorter: (a, b) => a?.startPickup!.localeCompare(b?.startPickup!),
    },
    {
      title: "Trạm KT",
      dataIndex: "endPickup",
      key: "endPickup",
      width: "12%",
      sorter: (a, b) => a?.endPickup!.localeCompare(b?.endPickup!),
    },
    {
      title: "Thời gian BĐ",
      dataIndex: "startTime",
      key: "startTime",
      width: "12%",
      sorter: (a, b) => a?.startTime!.localeCompare(b?.startTime!),
    },
    {
      title: "Thời gian BĐ",
      dataIndex: "endTime",
      key: "endTime",
      width: "12%",
      sorter: (a, b) => a?.endTime!.localeCompare(b?.endTime!),
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
    startTime: "Thời gian bắt đầu",
    endTime: "Thời gian kết thúc",
    status: "Trạng thái",
    map: "Bản đồ",
    list: "Danh sách",
  };
  const defaultInputs = {
    id: "Chưa xác định !",
    name: "Nhập Tên tuyến đường",
    startPickup: "Nhập Trạm bắt đầu",
    endPickup: "Nhập Trạm kết thúc",
    startTime: "Chọn Thời gian bắt đầu",
    endTime: "Chọn Thời gian kết thúc",
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
              startTime: route.startTime
                ? dayjs(route.startTime, "HH:MM:SS")
                : undefined,
              endTime: route.endTime
                ? dayjs(route.endTime, "HH:MM:SS")
                : undefined,
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
                      name="startTime"
                      label={defaultLabels.startTime}
                      className="margin-bottom-0"
                    >
                      <TimePicker disabled />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      name="endTime"
                      label={defaultLabels.endTime}
                      className="margin-bottom-0"
                    >
                      <TimePicker disabled />
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
                  {showMap ? (
                    <LeafletMap
                      type="detail"
                      routeDetails={route.routeDetails}
                    />
                  ) : (
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
    const [showMap, setShowMap] = useState<boolean>(true);
    const [showAddPickup, setShowAddPickup] = useState<boolean>(false);
    const [showRemovePickup, setShowRemovePickup] = useState<boolean>(false);
    const [pickupSelectedAdd, setPickupSelectedAdd] =
      useState<PickupType | null>(null);
    const [pickupSelectedRemove, setPickupSelectedRemove] = useState<
      number | null
    >(null);
    const [routeDetailsValue, setRouteDetailsValue] = useState<
      RouteDetailsFormatType[]
    >([]);

    useEffect(() => {
      if (routeDetailsValue.length >= 2) {
        form.setFieldValue("routeDetails", routeDetailsValue);
      } else {
        form.setFieldValue("routeDetails", undefined);
      }
    }, [routeDetailsValue]);

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
              startTime: undefined,
              endTime: undefined,
              status: undefined,
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
                      name="startTime"
                      htmlFor="create-startTime"
                      label={defaultLabels.startTime}
                      rules={[ruleRequired("Cần chọn Thời gian bắt đầu !")]}
                    >
                      <TimePicker
                        id="create-startTime"
                        placeholder={defaultInputs.startTime}
                      />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      name="endTime"
                      htmlFor="create-endTime"
                      label={defaultLabels.endTime}
                      rules={[ruleRequired("Cần chọn Thời gian kết thúc !")]}
                    >
                      <TimePicker
                        id="create-endTime"
                        placeholder={defaultInputs.endTime}
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
                      color="blue"
                      onClick={() => setShowMap(!showMap)}
                    >
                      <FontAwesomeIcon icon={!showMap ? faMap : faList} />
                      <span>Xem {!showMap ? "bản đồ" : "danh sách"}</span>
                    </Button>
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
                  </div>
                  {showAddPickup && (
                    <Row className="select-pickup">
                      <Select
                        allowClear
                        showSearch
                        placeholder="Chọn Trạm xe buýt để thêm"
                        options={pickupData?.map((pickup) => ({
                          label:
                            "#" +
                            pickup?.id +
                            " - " +
                            pickup?.name +
                            " - " +
                            pickup?.category,
                          value: pickup?.id,
                        }))}
                        onChange={(val: number) =>
                          setPickupSelectedAdd(getItemById(pickupData, val))
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
                          setPickupSelectedAdd(null);
                          setShowAddPickup(false);
                        }}
                      >
                        Xác nhận
                      </Button>
                    </Row>
                  )}
                  {showRemovePickup && (
                    <Row className="select-pickup">
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
                        onChange={(val: number) => setPickupSelectedRemove(val)}
                      />
                      <Button
                        htmlType="button"
                        type="primary"
                        onClick={(e) => {
                          e.preventDefault();

                          if (routeDetailsValue.length == 2) {
                            openNotification({
                              type: "warning",
                              message: "Cảnh báo",
                              description:
                                "Tuyến đường cần ít nhất 2 trạm đưa đón !",
                              duration: 1.5,
                            });

                            return;
                          }

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
                          setPickupSelectedRemove(null);
                          setShowRemovePickup(false);
                        }}
                      >
                        Xác nhận
                      </Button>
                    </Row>
                  )}
                  {showMap ? (
                    <LeafletMap
                      type="detail"
                      routeDetails={routeDetailsValue}
                    />
                  ) : (
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
    const [showMap, setShowMap] = useState<boolean>(true);
    const [showAddPickup, setShowAddPickup] = useState<boolean>(false);
    const [showRemovePickup, setShowRemovePickup] = useState<boolean>(false);
    const [pickupSelectedAdd, setPickupSelectedAdd] =
      useState<PickupType | null>(null);
    const [pickupSelectedRemove, setPickupSelectedRemove] = useState<
      number | null
    >(null);
    const [routeDetailsValue, setRouteDetailsValue] = useState<
      RouteDetailsFormatType[]
    >(route.routeDetails || []);

    useEffect(() => {
      if (routeDetailsValue.length >= 2) {
        form.setFieldValue("routeDetails", routeDetailsValue);
      } else {
        form.setFieldValue("routeDetails", undefined);
      }
    }, [routeDetailsValue]);

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
              startTime: route.startTime
                ? dayjs(route.startTime, "HH:MM:SS")
                : undefined,
              endTime: route.endTime
                ? dayjs(route.endTime, "HH:MM:SS")
                : undefined,
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
                      name="startTime"
                      htmlFor="update-startTime"
                      label={defaultLabels.startTime}
                      rules={[ruleRequired("Cần chọn Thời gian bắt đầu !")]}
                    >
                      <TimePicker
                        id="update-startTime"
                        placeholder={defaultInputs.startTime}
                      />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      name="endTime"
                      htmlFor="update-endTime"
                      label={defaultLabels.endTime}
                      rules={[ruleRequired("Cần chọn Thời gian kết thúc !")]}
                    >
                      <TimePicker
                        id="update-endTime"
                        placeholder={defaultInputs.endTime}
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
                      color="blue"
                      onClick={() => setShowMap(!showMap)}
                    >
                      <FontAwesomeIcon icon={!showMap ? faMap : faList} />
                      <span>Xem {!showMap ? "bản đồ" : "danh sách"}</span>
                    </Button>
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
                  </div>
                  {showAddPickup && (
                    <Row className="select-pickup">
                      <Select
                        allowClear
                        showSearch
                        placeholder="Chọn Trạm xe buýt để thêm"
                        options={pickupData?.map((pickup) => ({
                          label:
                            "#" +
                            pickup?.id +
                            " - " +
                            pickup?.name +
                            " - " +
                            pickup?.category,
                          value: pickup?.id,
                        }))}
                        onChange={(val: number) =>
                          setPickupSelectedAdd(getItemById(pickupData, val))
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
                          setPickupSelectedAdd(null);
                          setShowAddPickup(false);
                        }}
                      >
                        Xác nhận
                      </Button>
                    </Row>
                  )}
                  {showRemovePickup && (
                    <Row className="select-pickup">
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
                        onChange={(val: number) => setPickupSelectedRemove(val)}
                      />
                      <Button
                        htmlType="button"
                        type="primary"
                        onClick={(e) => {
                          e.preventDefault();

                          if (routeDetailsValue.length == 2) {
                            openNotification({
                              type: "warning",
                              message: "Cảnh báo",
                              description:
                                "Tuyến đường cần ít nhất 2 trạm đưa đón !",
                              duration: 1.5,
                            });

                            return;
                          }

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
                          setPickupSelectedRemove(null);
                          setShowRemovePickup(false);
                        }}
                      >
                        Xác nhận
                      </Button>
                    </Row>
                  )}
                  {showMap ? (
                    <LeafletMap
                      type="detail"
                      routeDetails={routeDetailsValue}
                    />
                  ) : (
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
                  {t("route-create")}
                </Button>
              </div>
            </div>
            <CustomTableActions<RouteFormatType>
              columns={columns}
              data={demoData || []}
              rowKey={(record) => String(record?.id)}
              // loading={isLoading}
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
