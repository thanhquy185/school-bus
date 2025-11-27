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
  List,
  Avatar,
  DatePicker,
  TimePicker,
} from "antd";
import { ReloadOutlined } from "@ant-design/icons";
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
} from "@fortawesome/free-solid-svg-icons";
import type { ColumnsType } from "antd/es/table";
import type {
  BreadcrumbItemType,
  BreadcrumbSeparatorType,
} from "antd/es/breadcrumb/Breadcrumb";
import { ruleRequired } from "../../common/rules";
import { CommonStatusValue, PointTypeValue } from "../../common/values";
import type {
  ScheduleFormatType,
  PickupType,
  RouteFormatType,
  BusType,
  DriverFormatType,
} from "../../common/types";
import LeafletMap from "../../components/leaflet-map";
import CustomTableActions from "../../components/table-actions";
import useCallApi from "../../api/useCall";
import { getRoutesActive } from "../../services/route-service";
import {
  createSchedule,
  getSchedules,
  updateSchedule,
} from "../../services/schedule-service";
import dayjs from "dayjs";
import { getBusesActive } from "../../services/bus-service";
import { getDriversActive } from "../../services/driver-service";
import { formatByDate, formatByTime } from "../../utils/format-day";

// Schedule Page
const SchedulePage = () => {
  // Language
  const { t } = useTranslation();

  //   // Notification
  //   const { openNotification } = useNotification();

  // Execute
  const { execute, notify, loading } = useCallApi();

  // Dữ liệu
  const [routes, setRoutes] = useState<RouteFormatType[]>([]);
  const [buses, setBuses] = useState<BusType[]>([]);
  const [drivers, setDrivers] = useState<DriverFormatType[]>([]);
  const [schedules, setSchedules] = useState<ScheduleFormatType[]>([]);
  const columns: ColumnsType<ScheduleFormatType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: "10%",
      sorter: (a, b) => a?.id! - b?.id!,
    },
    {
      title: "Ngày",
      key: "date",
      width: "16%",
      render: (record: ScheduleFormatType) =>
        record.start_date + " - " + record.end_date,
    },
    {
      title: "Giờ",
      key: "time",
      width: "16%",
      render: (record: ScheduleFormatType) =>
        record.start_time + " - " + record.end_time,
    },
    {
      title: "Tuyến đường - Xe buýt - Tài xế",
      key: "route - bus - driver",
      width: "38%",
      render: (record: ScheduleFormatType) =>
        record.route?.name +
        " - " +
        record.bus?.license_plate +
        " - " +
        record.driver?.full_name,
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
  const getRouteData = async () => {
      try {
        const response = await execute(getRoutesActive(), false);
        if (response && response.result) {
          if (Array.isArray(response.data)) {
            setRoutes(
              response.data.map((route) => ({
                ...route,
                status: route.status == "ACTIVE" ? "Hoạt động" : "Tạm dừng",
                routeDetails: route?.routePickups?.map((rp: any) => ({
                  pickup: {
                    ...rp.pickup,
                    category:
                      rp.pickup.category == "SCHOOL"
                        ? "Trường học"
                        : "Điểm đưa đón",
                    status:
                      rp.pickup.status == "ACTIVE" ? "Hoạt động" : "Tạm dừng",
                  },
                  order: rp.order,
                })),
              }))
            );
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
  const getBusData = async () => {
    try {
      const response = await execute(getBusesActive(), false);

      if (response && response.result) {
        if (Array.isArray(response.data)) {
          setBuses(
            response.data.map((bus) => ({
              ...bus,
              status: bus.status == "ACTIVE" ? "Hoạt động" : "Tạm dừng",
            }))
          );
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getDriverData = async () => {
    try {
      const response = await execute(getDriversActive(), false);

      if (response && response.result) {
        if (Array.isArray(response.data)) {
          setDrivers(
            response.data.map((driver) => ({
              ...driver,
              status: driver.status == "ACTIVE" ? "Hoạt động" : "Tạm dừng",
            }))
          );
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getScheduleData = async () => {
    try {
      const response = await execute(getSchedules(), false);

      if (response && response.result) {
        if (Array.isArray(response.data)) {
          setSchedules(
            response.data.map((schedule) => ({
              ...schedule,
              status: schedule.status === "ACTIVE" ? "Hoạt động" : "Tạm dừng",
              route: schedule.route
                ? {
                    ...schedule.route,
                    routeDetails:
                      schedule.route.pickups?.map(
                        (pickupNotFormat: {
                          pickup: PickupType;
                          order: number;
                        }) => ({
                          pickup: {
                            ...pickupNotFormat.pickup,
                            category:
                              pickupNotFormat.pickup.category === "SCHOOL"
                                ? "Trường học"
                                : "Điểm đưa đón",
                            status:
                              pickupNotFormat.pickup.status === "ACTIVE"
                                ? "Hoạt động"
                                : "Tạm dừng",
                          },
                          order: pickupNotFormat.order,
                        })
                      ) || [],
                  }
                : null,
            }))
          );
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getRouteData();
    getBusData();
    getDriverData();
    getScheduleData();
  }, []);

  // Lọc dữ liệu
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const filteredScheduleList = schedules.filter((schedule) => {
    const matchesStatus = statusFilter
      ? schedule.status === statusFilter
      : true;
    return matchesStatus;
  });

  // State giữ đối tượng được chọn hiện tại
  const [currentSelectedItem, setCurrentSelectedItem] =
    useState<ScheduleFormatType>();
  // State giữ hành động hiện tại
  const [currentAction, setCurrentAction] = useState<string>("list");
  // State giữ breadcrumb items hiện tại
  const [currentBreadcrumbItems, setCurrentBreadcrumbItems] =
    useState<Partial<BreadcrumbItemType & BreadcrumbSeparatorType>[]>();
  // State giữ card info hiện tại
  const [currentCardTitle, setCurrentCardTitle] = useState<string>(
    t("schedule-list")
  );
  const [currentCardContent, setCurrentCardContent] = useState<string>("list");

  // Effect cập nhật Card Content
  useEffect(() => {
    if (currentAction === "list") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faUserGraduate} />
              &nbsp;{t("schedule-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("schedule-list")}
            </span>
          ),
        },
      ]);
      setCurrentCardTitle(t("schedule-list"));
      setCurrentCardContent("list");
    } else if (currentAction === "detail") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faUserGraduate} />
              &nbsp;{t("schedule-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("schedule-list")}
            </span>
          ),
        },
        { title: <span>{t("schedule-detail")}</span> },
      ]);
      setCurrentCardTitle(t("schedule-detail"));
      setCurrentCardContent("detail");
    } else if (currentAction === "create") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faUserGraduate} />
              &nbsp;{t("schedule-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("schedule-list")}
            </span>
          ),
        },
        { title: <span>{t("schedule-create")}</span> },
      ]);
      setCurrentCardTitle(t("schedule-create"));
      setCurrentCardContent("create");
    } else if (currentAction === "update") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faUserGraduate} />
              &nbsp;{t("schedule-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("schedule-list")}
            </span>
          ),
        },
        { title: <span>{t("schedule-update")}</span> },
      ]);
      setCurrentCardTitle(t("schedule-update"));
      setCurrentCardContent("update");
    } else if (currentAction === "lock") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faUserGraduate} />
              &nbsp;{t("schedule-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("schedule-list")}
            </span>
          ),
        },
        { title: <span>{t("schedule-lock")}</span> },
      ]);
      setCurrentCardTitle(t("schedule-lock"));
      setCurrentCardContent("lock");
    } else if (currentAction === "unlock") {
      setCurrentBreadcrumbItems([
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              <FontAwesomeIcon icon={faUserGraduate} />
              &nbsp;{t("schedule-manager")}
            </span>
          ),
        },
        {
          title: (
            <span onClick={() => setCurrentAction("list")}>
              {t("schedule-list")}
            </span>
          ),
        },
        { title: <span>{t("schedule-unlock")}</span> },
      ]);
      setCurrentCardTitle(t("schedule-unlock"));
      setCurrentCardContent("unlock");
    }
  }, [currentAction]);

  // Schedule Actions
  const defaultLabels = {
    id: "Mã lịch trình",
    route: "Tuyến đường",
    bus: "Xe buýt",
    driver: "Tài xế",
    start_date: "Ngày bắt đầu",
    end_date: "Ngày kết thúc",
    start_time: "Giờ bắt đầu",
    end_time: "Giờ kết thúc",
    days_of_week: "Thứ trong tuần",
    status: "Trạng thái",
    routeDriverAndBus: "Chi tiết Tuyến đường - Xe buýt - Tài xế",
    map: "Bản đồ",
    list: "Danh sách",
  };
  const defaultInputs = {
    id: "Chưa xác định !",
    route: "Chọn Tuyến đường",
    bus: "Chọn Xe buýt",
    driver: "Chọn Tài xế",
    start_date: "Chọn Ngày bắt đầu",
    end_date: "Chọn Ngày kết thúc",
    start_time: "Chọn Giờ bắt đầu",
    end_time: "Chọn Giờ kết thúc",
    days_of_week: "Chọn Thứ trong tuần",
    status: "Chọn Trạng thái",
    routeDriverAndBus: "",
    map: "",
    list: "",
  };
  const ScheduleDetail: React.FC<{ schedule: ScheduleFormatType }> = ({
    schedule,
  }) => {
    const [form] = Form.useForm<ScheduleFormatType>();
    const [showMap, setShowMap] = useState<boolean>(true);

    return (
      <>
        <div className="schedule-content detail">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              id: schedule.id || undefined,
              route: schedule.route?.id || undefined,
              bus: schedule.bus?.id || undefined,
              driver: schedule.driver?.id || undefined,
              start_date: schedule.start_date
                ? dayjs(schedule.start_date, "DD/MM/YYYY")
                : undefined,
              end_date: schedule.end_date
                ? dayjs(schedule.end_date, "DD/MM/YYYY")
                : undefined,
              start_time: schedule.start_time
                ? dayjs(schedule.start_time, "HH:mm:ss")
                : undefined,
              end_time: schedule.end_time
                ? dayjs(schedule.end_time, "HH:mm:ss")
                : undefined,
              days_of_week: schedule.days_of_week?.split("|") || undefined,
              status: schedule.status || undefined,
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
                <Row className="split-2">
                  <Col>
                    <Form.Item
                      name="start_date"
                      label={defaultLabels.start_date}
                    >
                      <DatePicker format="DD/MM/YYYY" disabled />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item name="end_date" label={defaultLabels.end_date}>
                      <DatePicker format="DD/MM/YYYY" disabled />
                    </Form.Item>
                  </Col>
                </Row>
                <Row className="split-2">
                  <Col>
                    <Form.Item
                      name="start_time"
                      label={defaultLabels.start_time}
                    >
                      <TimePicker format="HH:mm:ss" disabled />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item name="end_time" label={defaultLabels.end_time}>
                      <TimePicker format="HH:mm:ss" disabled />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  name="days_of_week"
                  label={defaultLabels.days_of_week}
                >
                  <Select
                    mode="multiple"
                    options={[
                      {
                        label: "Thứ 2",
                        value: "1",
                      },
                      {
                        label: "Thứ 3",
                        value: "2",
                      },
                      {
                        label: "Thứ 4",
                        value: "3",
                      },
                      {
                        label: "Thứ 5",
                        value: "4",
                      },
                      {
                        label: "Thứ 6",
                        value: "5",
                      },
                      {
                        label: "Thứ 7",
                        value: "6",
                      },
                      {
                        label: "Chủ nhật",
                        value: "0",
                      },
                    ]}
                    disabled
                  />
                </Form.Item>
                <Form.Item name="route" label={defaultLabels.route}>
                  <Select
                    options={[
                      {
                        label:
                          schedule.route?.id + " - " + schedule.route?.name,
                        value: schedule.route?.id,
                      },
                    ]}
                    disabled
                  />
                </Form.Item>
                <Row className="split-2">
                  <Col>
                    <Form.Item
                      name="bus"
                      label={defaultLabels.bus}
                      className="margin-bottom-0"
                    >
                      <Select
                        options={[
                          {
                            label:
                              "#" +
                              schedule.bus?.id +
                              " - " +
                              schedule.bus?.license_plate,
                            value: schedule.bus?.id,
                          },
                        ]}
                        disabled
                      />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      name="driver"
                      label={defaultLabels.driver}
                      className="margin-bottom-0"
                    >
                      <Select
                        options={[
                          {
                            label:
                              "#" +
                              schedule.driver?.id +
                              " - " +
                              schedule.driver?.full_name,
                            value: schedule.driver?.id,
                          },
                        ]}
                        disabled
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col>
                <Form.Item
                  label={defaultLabels.routeDriverAndBus}
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
                  <div className="infos">
                    <div className="info-block bus">
                      <div className="icon">
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/1068/1068580.png"
                          alt=""
                        />
                      </div>
                      <div className="info">
                        <p>
                          <span>Mã xe: </span>
                          <b>
                            {schedule.bus?.id ? "#" + schedule.bus?.id : ""}
                          </b>
                        </p>
                        <p>
                          <span>Biển số: </span>
                          <b>{schedule.bus?.license_plate}</b>
                        </p>
                        <p>
                          <span>Số chỗ: </span>
                          <b>{schedule.bus?.capacity}</b>
                        </p>
                      </div>
                    </div>
                    <div className="info-block driver">
                      <div className="avatar">
                        <img src={`${schedule.driver?.avatar}`} alt="" />
                      </div>
                      <div className="info">
                        <p>
                          <span>Mã tài xế: </span>
                          <b>
                            {schedule.driver?.id
                              ? "#" + schedule.driver?.id
                              : ""}
                          </b>
                        </p>
                        <p>
                          <span>Họ tên: </span>
                          <b>{schedule.driver?.full_name}</b>
                        </p>
                        <p>
                          <span>Điện thoại: </span>
                          <b>{schedule.driver?.phone}</b>
                        </p>
                      </div>
                    </div>
                  </div>
                  <LeafletMap
                    type="detail"
                    routes={[schedule.route!]}
                    hidden={!showMap}
                  />
                  {!showMap && (
                    <>
                      <List
                        itemLayout="horizontal"
                        dataSource={schedule.route?.routeDetails}
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
  const ScheduleCreate: React.FC = () => {
    const [form] = Form.useForm<ScheduleFormatType>();
    const [showMap, setShowMap] = useState<boolean>(true);

    const [routeInfoSelected, setRouteInfoSelected] =
      useState<RouteFormatType | null>(null);
    const [busInfoSelected, setBusInfoSelected] = useState<BusType | null>(
      null
    );
    const [driverInfoSelected, setDriverInfoSelected] =
      useState<DriverFormatType | null>(null);

    const handleCreateSchedule = async () => {
      const restResponse = await execute(
        createSchedule({
          route_id: form.getFieldValue("route") || undefined,
          bus_id: form.getFieldValue("bus") || undefined,
          driver_id: form.getFieldValue("driver") || undefined,
          start_date:
            formatByDate(form.getFieldValue("start_date")) || undefined,
          end_date: formatByDate(form.getFieldValue("end_date")) || undefined,
          start_time:
            formatByTime(form.getFieldValue("start_time")) || undefined,
          end_time: formatByTime(form.getFieldValue("end_time")) || undefined,
          days_of_week:
            (form.getFieldValue("days_of_week") as Array<string>)
              ?.sort((a, b) => a.localeCompare(b))
              ?.join("|") || undefined,
          status: form.getFieldValue("status") || undefined,
        }),
        true
      );
      notify(restResponse!, "Thêm lịch trình thành công");
      if (restResponse?.result) {
        getScheduleData();
        setCurrentAction("list");
      }
    };

    return (
      <>
        <div className="schedule-content detail">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              id: undefined,
              route: undefined,
              bus: undefined,
              driver: undefined,
              start_date: undefined,
              end_date: undefined,
              start_time: undefined,
              end_time: undefined,
              days_of_week: undefined,
              status: undefined,
            }}
            autoComplete="off"
            onFinish={handleCreateSchedule}
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
                <Row className="split-2">
                  <Col>
                    <Form.Item
                      name="start_date"
                      label={defaultLabels.start_date}
                      rules={[ruleRequired("Cần chọn Ngày bắt đầu !")]}
                    >
                      <DatePicker
                        format="DD/MM/YYYY"
                        placeholder={defaultInputs.start_date}
                      />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      name="end_date"
                      label={defaultLabels.end_date}
                      rules={[ruleRequired("Cần chọn Ngày kết thúc !")]}
                    >
                      <DatePicker
                        format="DD/MM/YYYY"
                        placeholder={defaultInputs.end_date}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row className="split-2">
                  <Col>
                    <Form.Item
                      name="start_time"
                      label={defaultLabels.start_time}
                      rules={[ruleRequired("Cần chọn Giờ bắt đầu !")]}
                    >
                      <TimePicker
                        format="HH:mm:ss"
                        placeholder={defaultInputs.start_time}
                      />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      name="end_time"
                      label={defaultLabels.end_time}
                      rules={[ruleRequired("Cần chọn Giờ kết thúc !")]}
                    >
                      <TimePicker
                        format="HH:mm:ss"
                        placeholder={defaultInputs.end_time}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  name="days_of_week"
                  label={defaultLabels.days_of_week}
                  rules={[ruleRequired("Thứ trong tuần không được để trống !")]}
                >
                  <Select
                    mode="multiple"
                    placeholder={defaultInputs.days_of_week}
                    options={[
                      {
                        label: "Thứ 2",
                        value: "1",
                      },
                      {
                        label: "Thứ 3",
                        value: "2",
                      },
                      {
                        label: "Thứ 4",
                        value: "3",
                      },
                      {
                        label: "Thứ 5",
                        value: "4",
                      },
                      {
                        label: "Thứ 6",
                        value: "5",
                      },
                      {
                        label: "Thứ 7",
                        value: "6",
                      },
                      {
                        label: "Chủ nhật",
                        value: "0",
                      },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  name="route"
                  label={defaultLabels.route}
                  rules={[ruleRequired("Tuyến đường không được để trống !")]}
                >
                  <Select
                    options={routes?.map((route) => ({
                      label: "#" + route?.id + " - " + route?.name,
                      value: route?.id,
                    }))}
                    placeholder={defaultInputs.route}
                    onChange={(val) => {
                      setRouteInfoSelected(
                        routes?.find((route) => route.id === val) || null
                      );
                    }}
                  />
                </Form.Item>
                <Row className="split-2">
                  <Col>
                    <Form.Item
                      name="bus"
                      label={defaultLabels.bus}
                      rules={[ruleRequired("Cần chọn Xe buýt !")]}
                    >
                      <Select
                        options={buses?.map((bus) => ({
                          label: "#" + bus?.id + " - " + bus?.license_plate,
                          value: bus?.id,
                        }))}
                        placeholder={defaultInputs.bus}
                        onChange={(val) => {
                          setBusInfoSelected(
                            buses?.find((bus) => bus.id === val) || null
                          );
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      name="driver"
                      label={defaultLabels.driver}
                      rules={[ruleRequired("Cần chọn Tài xế !")]}
                    >
                      <Select
                        options={drivers?.map((driver) => ({
                          label: "#" + driver?.id + " - " + driver?.full_name,
                          value: driver?.id,
                        }))}
                        placeholder={defaultInputs.driver}
                        onChange={(val) => {
                          setDriverInfoSelected(
                            drivers?.find((driver) => driver.id === val) || null
                          );
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col>
                <Form.Item
                  label={defaultLabels.routeDriverAndBus}
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
                  <div className="infos">
                    <div className="info-block bus">
                      <div className="icon">
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/1068/1068580.png"
                          alt=""
                        />
                      </div>
                      <div className="info">
                        <p>
                          <span>Mã xe: </span>
                          <b>
                            {busInfoSelected?.id
                              ? "#" + busInfoSelected?.id
                              : ""}
                          </b>
                        </p>
                        <p>
                          <span>Biển số: </span>
                          <b>{busInfoSelected?.license_plate}</b>
                        </p>
                        <p>
                          <span>Số chỗ: </span>
                          <b>{busInfoSelected?.capacity}</b>
                        </p>
                      </div>
                    </div>
                    <div className="info-block driver">
                      <div className="avatar">
                        <img src={`${driverInfoSelected?.avatar}`} alt="" />
                      </div>
                      <div className="info">
                        <p>
                          <span>Mã tài xế: </span>
                          <b>
                            {driverInfoSelected?.id
                              ? "#" + driverInfoSelected?.id
                              : ""}
                          </b>
                        </p>
                        <p>
                          <span>Họ tên: </span>
                          <b>{driverInfoSelected?.full_name}</b>
                        </p>
                        <p>
                          <span>Điện thoại: </span>
                          <b>{driverInfoSelected?.phone}</b>
                        </p>
                      </div>
                    </div>
                  </div>
                  <LeafletMap
                    type="detail"
                    routes={[routeInfoSelected || {}]}
                    hidden={!showMap}
                  />
                  {!showMap && (
                    <>
                      <List
                        itemLayout="horizontal"
                        dataSource={routeInfoSelected?.routeDetails!}
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
  const ScheduleUpdate: React.FC<{ schedule: ScheduleFormatType }> = ({
    schedule,
  }) => {
    const [form] = Form.useForm<ScheduleFormatType>();
    const [showMap, setShowMap] = useState<boolean>(true);

    const [routeInfoSelected, setRouteInfoSelected] =
      useState<RouteFormatType | null>(schedule?.route || null);
    const [busInfoSelected, setBusInfoSelected] = useState<BusType | null>(
      schedule?.bus || null
    );
    const [driverInfoSelected, setDriverInfoSelected] =
      useState<DriverFormatType | null>(schedule?.driver || null);

    const handleUpdateSchedule = async () => {
      const restResponse = await execute(
        updateSchedule(schedule?.id!, {
          route_id: form.getFieldValue("route") || undefined,
          bus_id: form.getFieldValue("bus") || undefined,
          driver_id: form.getFieldValue("driver") || undefined,
          start_date:
            formatByDate(form.getFieldValue("start_date")) || undefined,
          end_date: formatByDate(form.getFieldValue("end_date")) || undefined,
          start_time:
            formatByTime(form.getFieldValue("start_time")) || undefined,
          end_time: formatByTime(form.getFieldValue("end_time")) || undefined,
          days_of_week:
            (form.getFieldValue("days_of_week") as Array<string>)
              ?.sort((a, b) => a.localeCompare(b))
              ?.join("|") || undefined,
        }),
        true
      );
      notify(restResponse!, "Cập nhật lịch trình thành công");
      if (restResponse?.result) {
        getScheduleData();
        setCurrentAction("list");
      }
    };

    return (
      <>
        <div className="schedule-content detail">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              id: schedule.id || undefined,
              route: schedule.route?.id || undefined,
              bus: schedule.bus?.id || undefined,
              driver: schedule.driver?.id || undefined,
              start_date: schedule.start_date
                ? dayjs(schedule.start_date, "DD/MM/YYYY")
                : undefined,
              end_date: schedule.end_date
                ? dayjs(schedule.end_date, "DD/MM/YYYY")
                : undefined,
              start_time: schedule.start_time
                ? dayjs(schedule.start_time, "HH:mm:ss")
                : undefined,
              end_time: schedule.end_time
                ? dayjs(schedule.end_time, "HH:mm:ss")
                : undefined,
              days_of_week: schedule.days_of_week?.split("|") || undefined,
              status: schedule.status || undefined,
            }}
            autoComplete="off"
            onFinish={handleUpdateSchedule}
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
                <Row className="split-2">
                  <Col>
                    <Form.Item
                      name="start_date"
                      label={defaultLabels.start_date}
                      rules={[ruleRequired("Cần chọn Ngày bắt đầu !")]}
                    >
                      <DatePicker
                        format="DD/MM/YYYY"
                        placeholder={defaultInputs.start_date}
                      />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      name="end_date"
                      label={defaultLabels.end_date}
                      rules={[ruleRequired("Cần chọn Ngày kết thúc !")]}
                    >
                      <DatePicker
                        format="DD/MM/YYYY"
                        placeholder={defaultInputs.end_date}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row className="split-2">
                  <Col>
                    <Form.Item
                      name="start_time"
                      label={defaultLabels.start_time}
                      rules={[ruleRequired("Cần chọn Giờ bắt đầu !")]}
                    >
                      <TimePicker
                        format="HH:mm:ss"
                        placeholder={defaultInputs.start_time}
                      />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      name="end_time"
                      label={defaultLabels.end_time}
                      rules={[ruleRequired("Cần chọn Giờ kết thúc !")]}
                    >
                      <TimePicker
                        format="HH:mm:ss"
                        placeholder={defaultInputs.end_time}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  name="days_of_week"
                  label={defaultLabels.days_of_week}
                  rules={[ruleRequired("Thứ trong tuần không được để trống !")]}
                >
                  <Select
                    mode="multiple"
                    placeholder={defaultInputs.days_of_week}
                    options={[
                      {
                        label: "Thứ 2",
                        value: "1",
                      },
                      {
                        label: "Thứ 3",
                        value: "2",
                      },
                      {
                        label: "Thứ 4",
                        value: "3",
                      },
                      {
                        label: "Thứ 5",
                        value: "4",
                      },
                      {
                        label: "Thứ 6",
                        value: "5",
                      },
                      {
                        label: "Thứ 7",
                        value: "6",
                      },
                      {
                        label: "Chủ nhật",
                        value: "0",
                      },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  name="route"
                  label={defaultLabels.route}
                  rules={[ruleRequired("Tuyến đường không được để trống !")]}
                >
                  <Select
                    options={routes?.map((route) => ({
                      label: "#" + route?.id + " - " + route?.name,
                      value: route?.id,
                    }))}
                    placeholder={defaultInputs.route}
                    onChange={(val) => {
                      setRouteInfoSelected(
                        routes?.find((route) => route.id === val) || null
                      );
                    }}
                  />
                </Form.Item>
                <Row className="split-2">
                  <Col>
                    <Form.Item
                      name="bus"
                      label={defaultLabels.bus}
                      rules={[ruleRequired("Cần chọn Xe buýt !")]}
                    >
                      <Select
                        options={buses?.map((bus) => ({
                          label: "#" + bus?.id + " - " + bus?.license_plate,
                          value: bus?.id,
                        }))}
                        placeholder={defaultInputs.bus}
                        onChange={(val) => {
                          setBusInfoSelected(
                            buses?.find((bus) => bus.id === val) || null
                          );
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      name="driver"
                      label={defaultLabels.driver}
                      rules={[ruleRequired("Cần chọn Tài xế !")]}
                    >
                      <Select
                        options={drivers?.map((driver) => ({
                          label: "#" + driver?.id + " - " + driver?.full_name,
                          value: driver?.id,
                        }))}
                        placeholder={defaultInputs.driver}
                        onChange={(val) => {
                          setDriverInfoSelected(
                            drivers?.find((driver) => driver.id === val) || null
                          );
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col>
                <Form.Item
                  label={defaultLabels.routeDriverAndBus}
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
                  <div className="infos">
                    <div className="info-block bus">
                      <div className="icon">
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/1068/1068580.png"
                          alt=""
                        />
                      </div>
                      <div className="info">
                        <p>
                          <span>Mã xe: </span>
                          <b>
                            {busInfoSelected?.id
                              ? "#" + busInfoSelected?.id
                              : ""}
                          </b>
                        </p>
                        <p>
                          <span>Biển số: </span>
                          <b>{busInfoSelected?.license_plate}</b>
                        </p>
                        <p>
                          <span>Số chỗ: </span>
                          <b>{busInfoSelected?.capacity}</b>
                        </p>
                      </div>
                    </div>
                    <div className="info-block driver">
                      <div className="avatar">
                        <img src={`${driverInfoSelected?.avatar}`} alt="" />
                      </div>
                      <div className="info">
                        <p>
                          <span>Mã tài xế: </span>
                          <b>
                            {driverInfoSelected?.id
                              ? "#" + driverInfoSelected?.id
                              : ""}
                          </b>
                        </p>
                        <p>
                          <span>Họ tên: </span>
                          <b>{driverInfoSelected?.full_name}</b>
                        </p>
                        <p>
                          <span>Điện thoại: </span>
                          <b>{driverInfoSelected?.phone}</b>
                        </p>
                      </div>
                    </div>
                  </div>
                  <LeafletMap
                    type="detail"
                    routes={[routeInfoSelected || {}]}
                    hidden={!showMap}
                  />
                  {!showMap && (
                    <>
                      <List
                        itemLayout="horizontal"
                        dataSource={routeInfoSelected?.routeDetails!}
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
  const ScheduleLock: React.FC<{ schedule: ScheduleFormatType }> = ({
    schedule,
  }) => {
    const handleLockSchedule = async () => {
      const restResponse = await execute(
        updateSchedule(schedule.id!, {
          status:
            schedule.status === CommonStatusValue.active
              ? "INACTIVE"
              : "ACTIVE",
        }),
        true
      );
      notify(
        restResponse!,
        schedule.status === CommonStatusValue.active
          ? "Khoá lịch trình thành công"
          : "Mở khoá lịch trình thành công"
      );
      if (restResponse?.result) {
        getScheduleData();
        setCurrentAction("list");
      }
    };

    return (
      <>
        <Alert
          message={"lịch trình: " + "#" + schedule?.id}
          showIcon
          icon={
            <FontAwesomeIcon
              icon={
                schedule?.status === CommonStatusValue.active
                  ? faLock
                  : faLockOpen
              }
            />
          }
          description={
            "Bạn có chắc chắc muốn" +
            (schedule?.status === CommonStatusValue.active
              ? " khoá "
              : " mở khoá ") +
            "lịch trình này ? Hành động không thể hoàn tác !"
          }
          type="error"
          action={
            <Button
              color="danger"
              variant="solid"
              onClick={() => handleLockSchedule()}
            >
              Xác nhận
            </Button>
          }
        />
      </>
    );
  };
  const ScheduleActions = {
    detail: (selectedSchedule: ScheduleFormatType) => (
      <ScheduleDetail schedule={selectedSchedule} />
    ),
    create: () => <ScheduleCreate />,
    update: (selectedSchedule: ScheduleFormatType) => (
      <ScheduleUpdate schedule={selectedSchedule} />
    ),
    lock: (selectedSchedule: ScheduleFormatType) => (
      <ScheduleLock schedule={selectedSchedule} />
    ),
  };

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
            <div className="Schedule-data">
              <div className="admin-layout__main-filter">
                <div className="left">
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
                    {t("schedule-create")}
                  </Button>
                </div>
              </div>
              <CustomTableActions<ScheduleFormatType>
                columns={columns}
                data={filteredScheduleList || []}
                rowKey={(record) => String(record?.id)}
                loading={loading}
                defaultPageSize={10}
                className="admin-layout__main-table table-data Schedules"
              />
            </div>
          )}
          {currentCardContent === "detail" &&
            ScheduleActions.detail(currentSelectedItem!)}
          {currentCardContent === "create" && ScheduleActions.create()}
          {currentCardContent === "update" &&
            ScheduleActions.update(currentSelectedItem!)}
          {(currentCardContent === "lock" || currentCardContent === "unlock") &&
            ScheduleActions.lock(currentSelectedItem!)}
        </Card>
      </div>
    </>
  );
};

export default SchedulePage;
