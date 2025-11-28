import { act, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Breadcrumb,
  Card,
  Button,
  Image,
  Select,
  Tag,
  DatePicker,
  Avatar,
  List,
  Modal,
  Form,
  Input,
  Row,
  Col,
} from "antd";
import {
  ReloadOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
  EyeOutlined,
  EditOutlined,
} from "@ant-design/icons";
import type {
  BreadcrumbItemType,
  BreadcrumbSeparatorType,
} from "antd/es/breadcrumb/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapLocationDot, faXmark } from "@fortawesome/free-solid-svg-icons";
import {
  ActivePickupStatusValue,
  ActiveStatusValue,
  ActiveStudentStatusValue,
  CommonGenderValue,
  PointTypeValue,
} from "../../common/values";
import type {
  ActiveFormatType,
  ActivePickupFormatType,
  ActiveStudentFormatType,
} from "../../common/types";
import LeafletMap, {
  type HandleGetBusInfoProps,
  type HandleGetRouteInfoProps,
  type HandleSelectedBusProps,
  type HandleSelectedPickupProps,
} from "../../components/leaflet-map";
import CustomStatistic from "../../components/statistic";
import { useNotification } from "../../utils/showNotification";
import dayjs from "dayjs";
import { getActivesActive } from "../../services/active-service";
import useCallApi from "../../api/useCall";

// Map Page
const MapPage = () => {
  // Language
  const { t } = useTranslation();

  const { execute, notify, loading } = useCallApi();

  // Dữ liệu về các chuyến xe đang vận hành "ACTIVE"
  const [actives, setActives] = useState<ActiveFormatType[]>();
  const getActiveData = async () => {
    try {
      const response = await execute(getActivesActive(), false);

      if (response && response.result) {
        if (Array.isArray(response.data)) {
          setActives(response.data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getActiveData();
  }, []);

  useEffect(() => {
    console.log(actives);
  }, [actives]);

  // State giữ đối tượng được chọn hiện tại
  const [currentSelectedItem, setCurrentSelectedItem] =
    useState<ActiveFormatType | null>(null);
  // State giữ trạm được chọn hiện tại
  const [currentSelectedActivePickup, setCurrentSelectedActivePickup] =
    useState<ActivePickupFormatType | null>(null);
  // State giữ học sinh được chọn hiện tại
  const [currentSelectedActiveStudent, setCurrentSelectedActiveStudent] =
    useState<ActiveStudentFormatType | null>(null);
  // State giữ hành động hiện tại
  const [currentAction, setCurrentAction] = useState<string>("journey");

  //
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  // Các biến giữ giá trị cho việc hiển thị thông số trên card
  const [totalActiveCardValue, setTotalActiveCardValue] = useState<number>(0);
  const [successCardValue, setSuccessCardValue] = useState<number>(0);
  const [runningCardValue, setRunningCardValue] = useState<number>(0);
  const [incidentCardValue, setIncidentCardValue] = useState<number>(0);
  const [pendingCardValue, setPendingCardValue] = useState<number>(0);

  //
  const handleGetBusInfo = ({
    active_id,
    busLat,
    busLng,
  }: HandleGetBusInfoProps) => {
    // console.log(active_id, busLat, busLng);
    const newActives = actives?.map((active) => {
      if (active.id === active_id) {
        return {
          ...active,
          busLat: busLat,
          busLng: busLng,
        };
      }

      return active;
    });
    // setActives(newActives);
  };
  //
  const handleGetRouteInfo = ({
    distance,
    duration,
  }: HandleGetRouteInfoProps) => {
    console.log(distance);
    console.log(duration);
  };
  //
  const handleSelectedPickup = ({ id }: HandleSelectedPickupProps) => {
    // - ĐANG NGU CHỖ NÀY
    // const item = actives?.map((active) => active.route?.routeDetails)?.find((routeDetail) => routeDetail?.)

    let active: ActiveFormatType | null = null;
    let activePickup: ActivePickupFormatType | null = null;
    for (let i = 0; i < actives!.length; i++) {
      const activePickups: ActivePickupFormatType[] =
        actives![i]?.active_pickups || [];
      for (let j = 0; j < activePickups.length; j++) {
        if (activePickups[j].pickup?.id === id) {
          active = actives![i];
          activePickup = activePickups[j];
          break;
        }
      }
    }

    setCurrentSelectedItem(active);
    setCurrentSelectedActivePickup(activePickup);
  };
  //
  const handleSelectedBus = ({ active_id }: HandleSelectedBusProps) => {
    // - ĐANG NGU CHỖ NÀY
    // const item = actives?.map((active) => active.route?.routeDetails)?.find((routeDetail) => routeDetail?.)
    // let active: ActiveFormatType | null = null;
    // for (let i = 0; i < actives.length; i++) {
    // const activePickups: ActivePickupFormatType[] =
    //   actives[i]?.activePickups || [];
    // for (let j = 0; j < activePickups.length; j++) {
    //   if (activePickups[j].pickup?.id === activePickupId) {
    //     active = actives[i];
    //     break;
    //   }
    // }
    // }

    const active = actives?.find((active) => active?.id === active_id)!;

    setCurrentSelectedItem(active);
    setCurrentSelectedActivePickup(null);
  };

  //
  const updateCard = () => {
    let newTotalActive = 0,
      newSuccess = 0,
      newRunning = 0,
      newIncident = 0,
      newPending = 0;

    actives?.forEach((active) => {
      newTotalActive += 1;
      if (active.status === "SUCCESS") {
        newSuccess += 1;
      } else if (active.status === "ACTIVE") {
        newRunning += 1;
      } else if (active.status === "CANCELED") {
        newIncident += 1;
      } else if (active.status === "PENDING") {
        newPending += 1;
      }
    });

    setTotalActiveCardValue(newTotalActive);
    setSuccessCardValue(newSuccess);
    setRunningCardValue(newRunning);
    setIncidentCardValue(newIncident);
    setPendingCardValue(newPending);
  };
  //
  const getStatisticColorByActiveStatus = (status: string) => {
    if (status === "SUCCESS") return "purple";
    if (status === "ACTIVE") return "green";
    if (status === "CANCELED") return "red";

    return "default";
  };

  //
  useEffect(() => {
    updateCard();
  }, [actives]);

  return (
    <>
      <div className="admin-layout__main-content">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            {
              title: (
                <span onClick={() => setCurrentAction("list")}>
                  <FontAwesomeIcon icon={faMapLocationDot} />
                  &nbsp;{t("map-manager")}
                </span>
              ),
            },
            {
              title: (
                <span onClick={() => setCurrentAction("list")}>
                  {t("map-info")}
                </span>
              ),
            },
          ]}
          className="admin-layout__main-breadcrumb"
        />
        {/* Card */}
        <Card title={t("map-info")} className="admin-layout__main-card">
          <div className="admin-layout__main-filter">
            <div className="left">
              <DatePicker.RangePicker
                showTime
                allowClear
                placeholder={["Thời gian bắt đầu", "Thời gian kết thúc"]}
                className="filter-time"
              />
              <Select
                allowClear
                placeholder="Chọn Xe buýt"
                options={[
                  {
                    label: "#1 - Số đăng ký xe 1",
                    value: 1,
                  },
                  {
                    label: "#2 - Số đăng ký xe 2",
                    value: 2,
                  },
                ]}
                className="filter-select"
              />
              <Select
                allowClear
                placeholder="Chọn Tài xế"
                options={[
                  {
                    label: "#1 - Tài xế 1 - 0123456789",
                    value: 1,
                  },
                  {
                    label: "#2 - Tài xế 2 - 0123456789",
                    value: 2,
                  },
                ]}
                className="filter-select"
              />
            </div>
            <div className="right">
              <Button
                color="blue"
                variant="filled"
                icon={<ReloadOutlined />}
                onClick={() => {
                  setCurrentSelectedItem(null);
                  setCurrentSelectedActivePickup(null);
                }}
                className="filter-reset"
              >
                Làm mới
              </Button>
            </div>
          </div>
          {/* <div className="admin-layout__main-statistics">
            <CustomStatistic
              title="Tổng tuyến vận hành"
              value={totalActiveCardValue}
              prefix={<EnvironmentOutlined />}
              color="#1666d2"
            />
            <CustomStatistic
              title={ActiveStatusValue.success}
              value={successCardValue}
              prefix={<CheckCircleOutlined />}
              color="#7b13cf"
            />
            <CustomStatistic
              title={ActiveStatusValue.running}
              value={runningCardValue}
              prefix={<ClockCircleOutlined />}
              color="#3f8600"
            />
            <CustomStatistic
              title={ActiveStatusValue.incident}
              value={incidentCardValue}
              prefix={<ExclamationCircleOutlined />}
              color="#cf1322"
            />
            <CustomStatistic
              title={ActiveStatusValue.pending}
              value={pendingCardValue}
              prefix={<QuestionCircleOutlined />}
              color="#676767"
            />
          </div> */}
          <div
            className={
              "admin-layout__main-map" +
              (currentSelectedItem ? " click-map" : "")
            }
          >
            <LeafletMap
              id="map-summary"
              type="detail"
              busInfos={actives?.map((active) => ({
                active_id: active?.id,
                busLat: active?.bus_lat,
                busLng: active?.bus_lng,
                busSpeed: active?.bus_speed,
              }))}
              routeDetailsList={actives?.map((active) => ({
                active_id: active?.id,
                routeDetails: active?.schedule?.route?.routePickups || [],
                status: active.status!,
              }))}
              activePickupsList={actives?.flatMap((active) => ({
                active_id: active?.id,
                activePickups: active?.active_pickups,
              }))}
              handleGetBusInfo={handleGetBusInfo}
              handleSelectedPickup={handleSelectedPickup}
              handleSelectedBus={handleSelectedBus}
            />
            {currentSelectedItem && (
              <div className="click-info">
                <img
                  src="/src/assets/images/others/search-location-image.png"
                  alt=""
                />
                <p>
                  Đã chọn{" "}
                  {currentSelectedActivePickup ? "trạm xe buýt" : "xe buýt"}{" "}
                  trên bản đồ
                </p>
                <span>Kéo xuống dưới để xem chi tiết</span>
              </div>
            )}
          </div>
        </Card>
        {currentSelectedItem && (
          <Card
            title={
              <div className="header">
                <p
                  className={
                    "title " +
                    getStatisticColorByActiveStatus(currentSelectedItem.status!)
                  }
                >
                  Thông tin {currentSelectedActivePickup ? "trạm" : "xe buýt"}
                </p>
                <Button
                  variant="filled"
                  color="default"
                  onClick={() => {
                    setCurrentSelectedItem(null);
                    setCurrentSelectedActivePickup(null);
                  }}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </Button>
              </div>
            }
            className="admin-layout__main-card info"
          >
            <div className="tags">
              <div className="tag-wrapper">
                {/* Tuyến */}
                <div className="tag multiple-2 no-align-stretch">
                  <div className="header">
                    <img src="https://cdn-icons-png.flaticon.com/512/854/854894.png" />
                    <b>Tuyến đường</b>
                  </div>
                  <Tag
                    color={getStatisticColorByActiveStatus(
                      currentSelectedItem.status!
                    )}
                  >
                    <div className="content">
                      <p>
                        <span>Tên:</span>
                        <b>{currentSelectedItem?.schedule?.route?.name}</b>
                      </p>
                      <p>
                        <span>Giờ:</span>
                        <b>
                          {currentSelectedItem?.schedule?.start_time} -{" "}
                          {currentSelectedItem?.schedule?.end_time}
                        </b>
                      </p>
                      <p>
                        <span>Trạm BĐ:</span>
                        <b>
                          {currentSelectedItem?.schedule?.route?.start_pickup}
                        </b>
                      </p>
                      <p>
                        <span>Trạm KT:</span>
                        <b>
                          {currentSelectedItem?.schedule?.route?.end_pickup}
                        </b>
                      </p>
                      <LeafletMap
                        id="map-route"
                        type="detail"
                        enableZoom={false}
                        enableSearch={false}
                        enableBaseLayers={false}
                        busInfos={[
                          {
                            active_id: currentSelectedItem?.id,
                            bus_lat: currentSelectedItem?.bus_lat,
                            bus_lng: currentSelectedItem?.bus_lng,
                            bus_speed: currentSelectedItem?.bus_speed,
                          },
                        ]}
                        routeDetailsList={[
                          {
                            active_id: currentSelectedItem?.id,
                            routeDetails:
                              currentSelectedItem?.schedule?.route
                                ?.routeDetails || [],
                            status: currentSelectedItem.status!,
                          },
                        ]}
                        activePickupsList={[
                          {
                            active_id: currentSelectedItem?.id,
                            activePickups: currentSelectedItem?.active_pickups,
                          },
                        ]}
                        handleGetRouteInfo={handleGetRouteInfo}
                      />
                    </div>
                  </Tag>
                </div>
                {!currentSelectedActivePickup && (
                  <>
                    {/* Xe buýt */}
                    <div className="tag multiple-2">
                      <div className="header">
                        <img src="https://cdn-icons-png.flaticon.com/512/1068/1068580.png" />
                        <b>Xe buýt</b>
                      </div>
                      <Tag
                        color={getStatisticColorByActiveStatus(
                          currentSelectedItem.status!
                        )}
                      >
                        <div className="content">
                          <p>
                            <span>Biển số:</span>
                            <b>
                              {
                                currentSelectedItem?.schedule?.bus
                                  ?.license_plate
                              }
                            </b>
                          </p>
                          <p>
                            <span>Số chỗ:</span>
                            <b>
                              {currentSelectedItem?.schedule?.bus?.capacity}
                            </b>
                          </p>
                          <p>
                            <span>Vận tốc:</span>
                            <b>{currentSelectedItem?.bus_speed} km/h</b>
                          </p>
                          <p>
                            <span>Đã đi:</span>
                            <b>m</b>
                          </p>
                          <p>
                            <span>Còn lại:</span>
                            <b>m</b>
                          </p>
                        </div>
                      </Tag>
                    </div>
                    {/* Tài xế */}
                    <div className="tag multiple-2">
                      <div className="header">
                        <img src="https://cdn-icons-png.flaticon.com/512/2684/2684225.png" />
                        <b>Tài xế</b>
                      </div>
                      <Tag
                        color={getStatisticColorByActiveStatus(
                          currentSelectedItem.status!
                        )}
                        className="tag multiple-2"
                      >
                        <div className="content">
                          <img
                            src={
                              currentSelectedItem?.schedule?.driver?.avatar
                                ? "/src/assets/images/drivers/" +
                                  currentSelectedItem?.schedule?.driver?.avatar
                                : "/src/assets/images/others/no-image.png"
                            }
                            className="avatar"
                          />
                          <p>
                            <span>Họ tên:</span>
                            <b>
                              {currentSelectedItem?.schedule?.driver?.full_name}
                            </b>
                          </p>
                          <p>
                            <span>Ngày sinh:</span>
                            <b>
                              {
                                currentSelectedItem?.schedule?.driver
                                  ?.birth_date
                              }
                            </b>
                          </p>
                          <p>
                            <span>Giới tính:</span>
                            <b>
                              {currentSelectedItem?.schedule?.driver?.gender}
                            </b>
                          </p>
                          <p>
                            <span>Số ĐT:</span>
                            <b>
                              {currentSelectedItem?.schedule?.driver?.phone}
                            </b>
                          </p>
                          <p>
                            <span>Email:</span>
                            <b>
                              {currentSelectedItem?.schedule?.driver?.email}
                            </b>
                          </p>
                          <p>
                            <span>Lịch chạy:</span>
                            <b>
                              {currentSelectedItem?.schedule?.start_date} -{" "}
                              {currentSelectedItem?.schedule?.end_date}
                            </b>
                          </p>
                        </div>
                      </Tag>
                    </div>
                  </>
                )}
              </div>
              <div className="tag-wrapper">
                {currentSelectedActivePickup ? (
                  <>
                    {/* Trạm xe */}
                    <div className="tag multiple-3 no-align-stretch">
                      <div className="header">
                        <img
                          src={
                            currentSelectedActivePickup?.pickup?.category ===
                            "SCHOOL"
                              ? "https://cdn-icons-png.flaticon.com/512/167/167707.png"
                              : currentSelectedActivePickup?.pickup
                                  ?.category === "PICKUP"
                              ? "https://cdn-icons-png.flaticon.com/512/6395/6395324.png"
                              : "https://cdn-icons-png.flaticon.com/512/1068/1068580.png"
                          }
                        />
                        <b>Trạm xe buýt</b>
                      </div>
                      <Tag
                        color={getStatisticColorByActiveStatus(
                          currentSelectedItem.status!
                        )}
                      >
                        <div className="content">
                          <div className="left">
                            <p>
                              <span>Thứ tự:</span>
                              <b>
                                {
                                  currentSelectedItem?.schedule?.route?.routeDetails?.find(
                                    (routeDetail) =>
                                      routeDetail?.pickup?.id ===
                                      currentSelectedActivePickup?.pickup?.id
                                  )?.order
                                }
                              </b>
                            </p>
                            <p>
                              <span>Tên:</span>
                              <b>{currentSelectedActivePickup?.pickup?.name}</b>
                            </p>
                            <p>
                              <span>Loại:</span>
                              <b>
                                {currentSelectedActivePickup?.pickup?.category}
                              </b>
                            </p>
                            <p>
                              <span>Toạ độ x:</span>
                              <b>{currentSelectedActivePickup?.pickup?.lat}</b>
                            </p>
                            <p>
                              <span>Toạ độ y:</span>
                              <b>{currentSelectedActivePickup?.pickup?.lng}</b>
                            </p>
                            <p>
                              <span>Trạng thái:</span>
                              <b>
                                <Tag
                                  color={
                                    currentSelectedActivePickup?.status ===
                                    "CONFIRMED"
                                      ? "green-inverse"
                                      : currentSelectedActivePickup?.status ===
                                        "DRIVING"
                                      ? "orange-inverse"
                                      : currentSelectedActivePickup?.status ===
                                        "CANCELED"
                                      ? "red-inverse"
                                      : "default"
                                  }
                                >
                                  {currentSelectedActivePickup?.status}{" "}
                                  {currentSelectedActivePickup?.status !==
                                  "PENDING"
                                    ? "(" +
                                      currentSelectedActivePickup?.at +
                                      ")"
                                    : ""}
                                </Tag>
                              </b>
                            </p>
                          </div>
                          <div className="right">
                            <LeafletMap
                              id={"map-pickup"}
                              type="detail"
                              lat={currentSelectedActivePickup?.pickup?.lat}
                              lng={currentSelectedActivePickup?.pickup?.lng}
                              pointType={
                                currentSelectedActivePickup?.pickup?.category
                              }
                            />
                          </div>
                        </div>
                      </Tag>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Danh sách trạm */}
                    <div className="tag pickups multiple-2 no-align-stretch">
                      <div className="header">
                        <img src="https://cdn-icons-png.flaticon.com/512/854/854901.png" />
                        <b>Danh sách trạm</b>
                      </div>
                      <Tag
                        color={getStatisticColorByActiveStatus(
                          currentSelectedItem.status!
                        )}
                      >
                        <div className="body">
                          <List
                            bordered
                            itemLayout="horizontal"
                            dataSource={currentSelectedItem?.active_pickups?.map(
                              (active_pickup) => active_pickup
                            )}
                            style={{ marginTop: 6 }}
                            renderItem={(active_pickup) => (
                              <List.Item key={active_pickup?.pickup?.id}>
                                <List.Item.Meta
                                  avatar={
                                    <Avatar
                                      src={
                                        active_pickup?.pickup?.category ===
                                        PointTypeValue.school
                                          ? "https://cdn-icons-png.flaticon.com/512/167/167707.png"
                                          : active_pickup?.pickup?.category ===
                                            PointTypeValue.pickup
                                          ? "https://cdn-icons-png.flaticon.com/512/6395/6395324.png"
                                          : "https://cdn-icons-png.flaticon.com/512/1068/1068580.png"
                                      }
                                      size={36}
                                    />
                                  }
                                  title={
                                    <strong>
                                      {
                                        currentSelectedItem?.schedule?.route?.routePickups?.find(
                                          (routePickup) =>
                                            routePickup?.pickup?.id ===
                                            active_pickup?.pickup?.id
                                        )?.order
                                      }{" "}
                                      - {active_pickup?.pickup?.name}
                                    </strong>
                                  }
                                  description={
                                    <>
                                      <div className="block-flex">
                                        <div className="left">
                                          <div>
                                            Loại:{" "}
                                            {active_pickup?.pickup?.category}
                                          </div>
                                          <div>
                                            Toạ độ x:{" "}
                                            {active_pickup?.pickup?.lat}
                                          </div>
                                          <div>
                                            Toạ độ y:{" "}
                                            {active_pickup?.pickup?.lng}
                                          </div>
                                          <div>
                                            Trạng thái:{" "}
                                            <Tag
                                              color={
                                                active_pickup?.status ===
                                                "CONFIRMED"
                                                  ? "green-inverse"
                                                  : active_pickup?.status ===
                                                    "DRIVING"
                                                  ? "orange-inverse"
                                                  : active_pickup?.status ===
                                                    "CANCELED"
                                                  ? "red-inverse"
                                                  : "default"
                                              }
                                            >
                                              {active_pickup?.status}
                                            </Tag>
                                          </div>
                                        </div>
                                        <div className="right">
                                          <LeafletMap
                                            id={
                                              "map-pickup-" +
                                              active_pickup?.pickup?.id
                                            }
                                            type="detail"
                                            enableZoom={false}
                                            enableSearch={false}
                                            enableBaseLayers={false}
                                            lat={active_pickup?.pickup?.lat}
                                            lng={active_pickup?.pickup?.lng}
                                            pointType={
                                              active_pickup?.pickup?.category
                                            }
                                          />
                                        </div>
                                      </div>
                                    </>
                                  }
                                />
                              </List.Item>
                            )}
                          />
                        </div>
                      </Tag>
                    </div>
                  </>
                )}
                {/* Danh sách học sinh */}
                <div className="tag multiple-3 no-align-stretch students">
                  <div className="header">
                    <img src="https://cdn-icons-png.flaticon.com/512/2995/2995459.png" />
                    <b>
                      Danh sách học sinh{" "}
                      {currentSelectedActivePickup ? "theo trạm" : ""}
                    </b>
                  </div>
                  <Tag
                    color={getStatisticColorByActiveStatus(
                      currentSelectedItem.status!
                    )}
                  >
                    <div className="content">
                      <List
                        bordered
                        itemLayout="horizontal"
                        dataSource={
                          currentSelectedActivePickup
                            ? currentSelectedItem?.active_students?.filter(
                                (active_student) =>
                                  active_student?.student?.pickup?.id ===
                                  currentSelectedActivePickup?.pickup?.id
                              )
                            : currentSelectedItem?.active_students?.map(
                                (active_student) => active_student
                              )
                        }
                        renderItem={(active_student) => (
                          <List.Item
                            key={active_student?.student?.id}
                            actions={[
                              <Button
                                variant="solid"
                                color="blue"
                                icon={<EyeOutlined />}
                                onClick={() => {
                                  setCurrentSelectedActiveStudent(
                                    active_student
                                  );
                                  showModal();
                                }}
                              >
                                Chi tiết
                              </Button>,
                            ]}
                          >
                            <List.Item.Meta
                              avatar={
                                <Avatar
                                  src={active_student?.student?.avatar}
                                  size={36}
                                />
                              }
                              title={
                                <strong>
                                  {active_student?.student?.full_name}
                                </strong>
                              }
                              description={
                                <>
                                  <div>Mã: {active_student?.student?.id}</div>
                                  <div>
                                    Lớp: {active_student?.student?.class?.name}
                                  </div>
                                  <div>
                                    Phụ huynh:{" "}
                                    {active_student?.student?.parent?.full_name}
                                  </div>
                                  {!currentSelectedActivePickup && (
                                    <div>
                                      Trạm:{" "}
                                      {active_student?.student?.pickup?.name}
                                    </div>
                                  )}
                                  <div>
                                    Trạng thái:{" "}
                                    <Tag
                                      color={
                                        active_student?.status === "CHECKED"
                                          ? "green-inverse"
                                          : active_student?.status === "LEAVE"
                                          ? "orange-inverse"
                                          : active_student?.status === "ABSENT"
                                          ? "red-inverse"
                                          : "default"
                                      }
                                    >
                                      {active_student?.status}
                                    </Tag>
                                  </div>
                                </>
                              }
                            />
                          </List.Item>
                        )}
                      />
                    </div>
                  </Tag>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
      <Modal
        centered
        footer={null}
        title="Chi tiết học sinh"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        className={
          "modal map-admin " +
          getStatisticColorByActiveStatus(currentSelectedItem?.status!)
        }
      >
        <div className="form-group">
          <p className="title">
            <span>Thông tin học sinh</span>
          </p>
          <Form
            initialValues={{
              id: currentSelectedActiveStudent?.student?.id,
              full_name: currentSelectedActiveStudent?.student?.full_name,
              birthday: currentSelectedActiveStudent?.student?.birth_date
                ? dayjs(
                    currentSelectedActiveStudent?.student?.birth_date,
                    "YYYY-MM-DD"
                  )
                : "",
              gender: currentSelectedActiveStudent?.student?.gender,
              class: currentSelectedActiveStudent?.student?.class?.name,
              parent:
                currentSelectedActiveStudent?.student?.parent?.full_name +
                " - " +
                currentSelectedActiveStudent?.student?.parent?.phone,
              address: currentSelectedActiveStudent?.student?.address,
              status: currentSelectedActiveStudent?.student?.status,
            }}
            layout="horizontal"
            variant="filled"
            disabled
          >
            <Row className="split-3">
              <Col>
                <Image
                  src="/src/assets/images/others/no-image.png"
                  alt=""
                  className="avatar"
                />
              </Col>
              <Col>
                <Form.Item
                  name="id"
                  label="Mã học sinh"
                  className="text-center"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="full_name"
                  label="Họ và tên"
                  className="multiple-2"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="birthday"
                  label="Ngày sinh"
                  className="text-center"
                >
                  <DatePicker type="date" format="YYYY-MM-DD" />
                </Form.Item>
                <Form.Item name="class" label="Lớp học" className="multiple-2">
                  <Input />
                </Form.Item>
                <Form.Item
                  name="parent"
                  label="Phụ huynh"
                  className="multiple-2"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="address"
                  label="Địa chỉ"
                  className="multiple-2"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  name="status"
                  label="Trạng thái"
                  className="text-center"
                >
                  <Input />
                </Form.Item>
                <Form.Item label="." className="hidden">
                  <Input />
                </Form.Item>
                <Form.Item
                  name="gender"
                  label="Giới tính"
                  className="text-center"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        {!currentSelectedActivePickup && (
          <>
            <div className="form-group">
              <div className="title">
                <span>Thông tin trạm</span>
              </div>
              <Form
                initialValues={{
                  pickupName:
                    currentSelectedActiveStudent?.student?.pickup?.name,
                  pickupCategory:
                    currentSelectedActiveStudent?.student?.pickup?.category,
                  pickupLat: currentSelectedActiveStudent?.student?.pickup?.lat,
                  pickupLng: currentSelectedActiveStudent?.student?.pickup?.lng,
                }}
                layout="horizontal"
                variant="filled"
                disabled
              >
                <Row className="split-3">
                  <Col>
                    <Form.Item name="pickupName" label="Tên trạm">
                      <Input />
                    </Form.Item>
                    <Form.Item name="pickupCategory" label="Loại trạm">
                      <Input />
                    </Form.Item>
                    <Form.Item name="pickupLat" label="Toạ độ x">
                      <Input />
                    </Form.Item>
                    <Form.Item name="pickupLng" label="Toạ độ y">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item name="pickupLng" className="multiple-2">
                      <LeafletMap
                        id={
                          "map-pickup-" +
                          currentSelectedActiveStudent?.student?.pickup?.id +
                          "-" +
                          currentSelectedActiveStudent?.student?.id
                        }
                        type="detail"
                        lat={currentSelectedActiveStudent?.student?.pickup?.lat}
                        lng={currentSelectedActiveStudent?.student?.pickup?.lng}
                        pointType={
                          currentSelectedActiveStudent?.student?.pickup
                            ?.category
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col></Col>
                </Row>
              </Form>
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export default MapPage;
