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

// Map Page
const MapPage = () => {
  // Language
  const { t } = useTranslation();

  // Notification
  const { openNotification } = useNotification();

  //
  const data: ActiveFormatType[] = [
    {
      id: 1,
      schedule: {
        id: 1,
        bus: {
          id: 1,
          licensePlate: "AA00-0000",
          capacity: 20,
          status: "Hoạt động",
        },
        route: {
          id: 1,
          name: "Tuyến CV Lê Thị Riêng-Ngã 3 Tô Hiến Thành",
          startPickup: "Công Viên Lê Thị Riêng",
          endPickup: "Ngã 3 Tô Hiến Thành",
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
          ],
        },
        driver: {
          id: 1,
          user: {
            id: 1,
            role: "driver",
            username: "taixe1",
            password: "taixe1",
          },
          fullname: "Họ tên tài xế 1",
          birthday: "2025-01-01",
          gender: "Nữ",
          phone: "1234567890",
          email: "taixe1@gmail.com",
          address: "Địa chỉ ở đâu không biết",
          status: "Hoạt động",
        },
        startDate: "2025-10-01",
        endDate: "2025-10-31",
      },
      createTime: "2025-10-11 04:56:20",
      startTime: "2025-10-11 05:00:20",
      busLat: 10.786197005344277,
      busLng: 106.66577696800232,
      busSpeed: 1000,
      status: "Đã hoàn thành",
      activeStudents: [
        {
          student: {
            id: "1",
            parent: {
              id: 1,
              user: {
                id: 1,
                role: "parent",
                username: "phuhuynh1",
                password: "phuhuynh1",
              },
              fullname: "Họ tên phụ huynh 1",
              phone: "1234567890",
              email: "phuhuynh1@gmail.com",
              address: "Địa chỉ ở đâu không biết",
              status: "Hoạt động",
            },
            pickup: {
              id: 2,
              name: "Trạm Công viên Lê Thị Riêng",
              category: "Điểm đưa đón",
              lat: 10.786197005344277,
              lng: 106.66577696800232,
              status: "Tạm dừng",
            },
            class: {
              id: 1,
              name: "Lớp 10A1",
            },
            avatar: "test-1.png",
            fullname: "Học sinh 1",
            birthday: "2025-01-01",
            gender: "Nam",
            address: "Địa chỉ ở đâu không biết",
            status: "Hoạt động",
          },
          time: "2025-10-01 08:00:00",
          status: "Đã điểm danh",
        },
        {
          student: {
            id: "2",
            parent: {
              id: 2,
              user: {
                id: 2,
                role: "parent",
                username: "phuhuynh2",
                password: "phuhuynh2",
              },
              fullname: "Họ tên phụ huynh 2",
              phone: "2234567890",
              email: "phuhuynh2@gmail.com",
              address: "Địa chỉ ở đâu không biết",
              status: "Tạm dừng",
            },

            pickup: {
              id: 3,
              name: "Trạm Ngã 3 Tô Hiến Thành",
              category: "Điểm đưa đón",
              lat: 10.782542301538852,
              lng: 106.67269945487907,
              status: "Hoạt động",
            },

            class: {
              id: 2,
              name: "Lớp 10A2",
            },
            avatar: "test-2.png",
            fullname: "Học sinh 2",
            birthday: "2025-02-02",
            gender: "Nam",
            address: "Địa chỉ ở đâu không biết",
            status: "Tạm dừng",
          },
          time: "2025-10-01 08:30:00",
          status: "Đã nghỉ học",
        },
      ],
      activePickups: [
        {
          pickup: {
            id: 2,
            name: "Trạm Công viên Lê Thị Riêng",
            category: "Điểm đưa đón",
            lat: 10.786197005344277,
            lng: 106.66577696800232,
            status: "Tạm dừng",
          },
          time: "2025-10-01 06:58:23",
          status: "Đã đến trạm",
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
          time: "2025-10-01 08:10:23",
          status: "Đang đến trạm",
        },
      ],
    },
    {
      id: 2,
      schedule: {
        id: 2,
        route: {
          id: 2,
          name: "Tuyến Vòng Xoay Dân Chủ-Vòng Xoay Lý Thái Tổ",
          startPickup: "Vòng Xoay Dân Chủ",
          endPickup: "Vòng Xoay Lý Thái Tổ",
          startTime: "07:00:00",
          endTime: "08:00:00",
          status: "Hoạt động",
          routeDetails: [
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
          ],
        },
        bus: {
          id: 2,
          licensePlate: "AA00-0000",
          capacity: 20,
          status: "Hoạt động",
        },
        driver: {
          id: 2,
          user: {
            id: 2,
            role: "driver",
            username: "taixe2",
            password: "taixe2",
          },
          fullname: "Họ tên tài xế 2",
          birthday: "2025-02-02",
          gender: "Nữ",
          phone: "2234567890",
          email: "taixe2@gmail.com",
          address: "Địa chỉ ở đâu không biết",
          status: "Hoạt động",
        },
        startDate: "2025-10-01",
        endDate: "2025-10-31",
      },
      createTime: "2025-10-11 08:56:20",
      startTime: "2025-10-11 09:00:20",
      busLat: 10.778231651587179,
      busLng: 106.68071896686253,
      status: "Đang chạy xe",
      activeStudents: [
        {
          student: {
            id: "3",
            parent: {
              id: 3,
              user: {
                id: 3,
                role: "parent",
                username: "phuhuynh3",
                password: "phuhuynh3",
              },
              fullname: "Họ tên phụ huynh 3",
              phone: "3234567890",
              email: "phuhuynh3@gmail.com",
              address: "Địa chỉ ở đâu không biết",
              status: "Hoạt động",
            },
            pickup: {
              id: 4,
              name: "Trạm Vòng xoay Dân Chủ",
              category: "Điểm đưa đón",
              lat: 10.778231651587179,
              lng: 106.68071896686253,
              status: "Hoạt động",
            },
            class: {
              id: 3,
              name: "Lớp 10A3",
            },
            avatar: "test-3.png",
            fullname: "Học sinh 3",
            birthday: "2025-03-03",
            gender: "Nữ",
            address: "Địa chỉ ở đâu không biết",
            status: "Hoạt động",
          },
          time: "2025-10-01 08:00:00",
          status: "Đang chờ xác nhận",
        },
      ],
      activePickups: [
        {
          pickup: {
            id: 4,
            name: "Trạm Vòng xoay Dân Chủ",
            category: "Điểm đưa đón",
            lat: 10.778231651587179,
            lng: 106.68071896686253,
            status: "Hoạt động",
          },
          time: "2025-10-01 06:58:23",
          status: "Đã đến trạm",
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
          time: "2025-10-01 08:10:23",
          status: "Đang đến trạm",
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
          time: "2025-10-01 09:02:23",
          status: "Đang chờ xác nhận",
        },
      ],
    },
    {
      id: 3,
      schedule: {
        id: 3,
        route: {
          id: 3,
          name: "Tuyến Vòng xoay Cộng Hoà-Trường Đại học Sài Gòn",
          startPickup: "Vòng xoay Cộng Hoà",
          endPickup: "Trường Đại học Sài Gòn",
          startTime: "07:00:00",
          endTime: "08:00:00",
          status: "Hoạt động",
          routeDetails: [
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
        bus: {
          id: 3,
          licensePlate: "AA00-0000",
          capacity: 20,
          status: "Hoạt động",
        },
        driver: {
          id: 3,
          user: {
            id: 3,
            role: "driver",
            username: "taixe3",
            password: "taixe3",
          },
          fullname: "Họ tên tài xế 3",
          birthday: "2025-03-03",
          gender: "Nữ",
          phone: "3234567890",
          email: "taixe3@gmail.com",
          address: "Địa chỉ ở đâu không biết",
          status: "Hoạt động",
        },
        startDate: "2025-10-01",
        endDate: "2025-10-31",
      },
      startTime: "2025-10-11 04:56:20",
      status: "Đang có sự cố",
      activeStudents: [
        {
          student: {
            id: "4",
            parent: {
              id: 4,
              user: {
                id: 4,
                role: "parent",
                username: "phuhuynh4",
                password: "phuhuynh4",
              },
              fullname: "Họ tên phụ huynh 4",
              phone: "4244567890",
              email: "phuhuynh4@gmail.com",
              address: "Địa chỉ ở đâu không biết",
              status: "Hoạt động",
            },
            pickup: {
              id: 7,
              name: "Trạm Vòng xoay Cộng Hoà",
              category: "Điểm đưa đón",
              lat: 10.764561529473132,
              lng: 106.6818913125902,
              status: "Hoạt động",
            },
            class: {
              id: 4,
              name: "Lớp 10A4",
            },
            avatar: "test-4.png",
            fullname: "Học sinh 4",
            birthday: "2025-04-04",
            gender: "Nữ",
            address: "Địa chỉ ở đâu không biết",
            status: "Hoạt động",
          },
          time: "2025-10-01 08:00:00",
          status: "Đã nghỉ phép",
        },
      ],
      activePickups: [
        {
          pickup: {
            id: 7,
            name: "Trạm Vòng xoay Cộng Hoà",
            category: "Điểm đưa đón",
            lat: 10.764561529473132,
            lng: 106.6818913125902,
            status: "Hoạt động",
          },
          time: "2025-10-01 06:58:23",
          status: "Đã đến trạm",
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
          time: "2025-10-01 08:10:23",
          status: "Đang chờ xác nhận",
        },
      ],
    },
  ];
  const [actives, setActives] = useState<ActiveFormatType[]>(data);

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
  // State giữ breadcrumb items hiện tại
  const [currentBreadcrumbItems, setCurrentBreadcrumbItems] = useState<
    Partial<BreadcrumbItemType & BreadcrumbSeparatorType>[]
  >([
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
        <span onClick={() => setCurrentAction("list")}>{t("map-info")}</span>
      ),
    },
  ]);
  // State giữ card info hiện tại
  const [currentCardTitle, setCurrentCardTitle] = useState<string>(
    t("map-info")
  );
  // const [currentCardContent, setCurrentCardContent] =
  //   useState<string>("journey");

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
    activeId,
    busLat,
    busLng,
  }: HandleGetBusInfoProps) => {
    // console.log(activeId, busLat, busLng);
    const newActives = actives?.map((active) => {
      if (active.id === activeId) {
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
    for (let i = 0; i < actives.length; i++) {
      const activePickups: ActivePickupFormatType[] =
        actives[i]?.activePickups || [];
      for (let j = 0; j < activePickups.length; j++) {
        if (activePickups[j].pickup?.id === id) {
          active = actives[i];
          activePickup = activePickups[j];
          break;
        }
      }
    }

    setCurrentSelectedItem(active);
    setCurrentSelectedActivePickup(activePickup);
  };
  //
  const handleSelectedBus = ({ activeId }: HandleSelectedBusProps) => {
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

    const active = actives?.find((active) => active?.id === activeId)!;

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
      if (active.status === ActiveStatusValue.success) {
        newSuccess += 1;
      } else if (active.status === ActiveStatusValue.running) {
        newRunning += 1;
      } else if (active.status === ActiveStatusValue.incident) {
        newIncident += 1;
      } else if (active.status === ActiveStatusValue.pending) {
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
    if (status === ActiveStatusValue.success) return "purple";
    if (status === ActiveStatusValue.running) return "green";
    if (status === ActiveStatusValue.incident) return "red";

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
          items={currentBreadcrumbItems}
          className="admin-layout__main-breadcrumb"
        />
        {/* Card */}
        <Card title={currentCardTitle} className="admin-layout__main-card">
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
          <div className="admin-layout__main-statistics">
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
          </div>
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
                activeId: active?.id,
                busLat: active?.busLat,
                busLng: active?.busLng,
                busSpeed: active?.busSpeed,
              }))}
              routeDetailsList={actives?.map((active) => ({
                activeId: active?.id,
                routeDetails: active?.schedule?.route?.routeDetails || [],
                status: active.status!,
              }))}
              activePickupsList={actives?.flatMap((active) => ({
                activeId: active?.id,
                activePickups: active?.activePickups,
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
                          {currentSelectedItem?.schedule?.route?.startTime} -{" "}
                          {currentSelectedItem?.schedule?.route?.endTime}
                        </b>
                      </p>
                      <p>
                        <span>Trạm BĐ:</span>
                        <b>
                          {currentSelectedItem?.schedule?.route?.startPickup}
                        </b>
                      </p>
                      <p>
                        <span>Trạm KT:</span>
                        <b>{currentSelectedItem?.schedule?.route?.endPickup}</b>
                      </p>
                      <LeafletMap
                        id="map-route"
                        type="detail"
                        enableZoom={false}
                        enableSearch={false}
                        enableBaseLayers={false}
                        busInfos={[
                          {
                            activeId: currentSelectedItem?.id,
                            busLat: currentSelectedItem?.busLat,
                            busLng: currentSelectedItem?.busLng,
                            busSpeed: currentSelectedItem?.busSpeed,
                          },
                        ]}
                        routeDetailsList={[
                          {
                            activeId: currentSelectedItem?.id,
                            routeDetails:
                              currentSelectedItem?.schedule?.route
                                ?.routeDetails || [],
                            status: currentSelectedItem.status!,
                          },
                        ]}
                        activePickupsList={[
                          {
                            activeId: currentSelectedItem?.id,
                            activePickups: currentSelectedItem?.activePickups,
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
                              {currentSelectedItem?.schedule?.bus?.licensePlate}
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
                            <b>{currentSelectedItem?.busSpeed} km/h</b>
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
                              {currentSelectedItem?.schedule?.driver?.fullname}
                            </b>
                          </p>
                          <p>
                            <span>Ngày sinh:</span>
                            <b>
                              {currentSelectedItem?.schedule?.driver?.birthday}
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
                              {currentSelectedItem?.schedule?.startDate} -{" "}
                              {currentSelectedItem?.schedule?.endDate}
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
                            PointTypeValue.school
                              ? "https://cdn-icons-png.flaticon.com/512/167/167707.png"
                              : currentSelectedActivePickup?.pickup
                                  ?.category === PointTypeValue.pickup
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
                                    ActivePickupStatusValue.confirmed
                                      ? "green-inverse"
                                      : currentSelectedActivePickup?.status ===
                                        ActivePickupStatusValue.canceled
                                      ? "red-inverse"
                                      : "default"
                                  }
                                >
                                  {currentSelectedActivePickup?.status}{" "}
                                  {currentSelectedActivePickup?.status !==
                                  ActivePickupStatusValue.pending
                                    ? "(" +
                                      currentSelectedActivePickup?.time +
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
                            dataSource={currentSelectedItem?.activePickups?.map(
                              (activePickup) => activePickup
                            )}
                            style={{ marginTop: 6 }}
                            renderItem={(activePickup) => (
                              <List.Item key={activePickup?.pickup?.id}>
                                <List.Item.Meta
                                  avatar={
                                    <Avatar
                                      src={
                                        activePickup?.pickup?.category ===
                                        PointTypeValue.school
                                          ? "https://cdn-icons-png.flaticon.com/512/167/167707.png"
                                          : activePickup?.pickup?.category ===
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
                                        currentSelectedItem?.schedule?.route?.routeDetails?.find(
                                          (routeDetail) =>
                                            routeDetail?.pickup?.id ===
                                            activePickup?.pickup?.id
                                        )?.order
                                      }{" "}
                                      - {activePickup?.pickup?.name}
                                    </strong>
                                  }
                                  description={
                                    <>
                                      <div className="block-flex">
                                        <div className="left">
                                          <div>
                                            Loại:{" "}
                                            {activePickup?.pickup?.category}
                                          </div>
                                          <div>
                                            Toạ độ x:{" "}
                                            {activePickup?.pickup?.lat}
                                          </div>
                                          <div>
                                            Toạ độ y:{" "}
                                            {activePickup?.pickup?.lng}
                                          </div>
                                          <div>
                                            Trạng thái:{" "}
                                            <Tag
                                              color={
                                                activePickup?.status ===
                                                ActivePickupStatusValue.confirmed
                                                  ? "green-inverse"
                                                  : activePickup?.status ===
                                                    ActivePickupStatusValue.driving
                                                  ? "orange-inverse"
                                                  : activePickup?.status ===
                                                    ActivePickupStatusValue.canceled
                                                  ? "red-inverse"
                                                  : "default"
                                              }
                                            >
                                              {activePickup?.status}
                                            </Tag>
                                          </div>
                                        </div>
                                        <div className="right">
                                          <LeafletMap
                                            id={
                                              "map-pickup-" +
                                              activePickup?.pickup?.id
                                            }
                                            type="detail"
                                            enableZoom={false}
                                            enableSearch={false}
                                            enableBaseLayers={false}
                                            lat={activePickup?.pickup?.lat}
                                            lng={activePickup?.pickup?.lng}
                                            pointType={
                                              activePickup?.pickup?.category
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
                            ? currentSelectedItem?.activeStudents?.filter(
                                (activeStudent) =>
                                  activeStudent?.student?.pickup?.id ===
                                  currentSelectedActivePickup?.pickup?.id
                              )
                            : currentSelectedItem?.activeStudents?.map(
                                (activeStudent) => activeStudent
                              )
                        }
                        renderItem={(activeStudent) => (
                          <List.Item
                            key={activeStudent?.student?.id}
                            actions={[
                              <Button
                                variant="solid"
                                color="blue"
                                icon={<EyeOutlined />}
                                onClick={() => {
                                  setCurrentSelectedActiveStudent(
                                    activeStudent
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
                                  src={activeStudent?.student?.avatar}
                                  size={36}
                                />
                              }
                              title={
                                <strong>
                                  {activeStudent?.student?.fullname}
                                </strong>
                              }
                              description={
                                <>
                                  <div>Mã: {activeStudent?.student?.id}</div>
                                  <div>
                                    Lớp: {activeStudent?.student?.class?.name}
                                  </div>
                                  <div>
                                    Phụ huynh:{" "}
                                    {activeStudent?.student?.parent?.fullname}
                                  </div>
                                  {!currentSelectedActivePickup && (
                                    <div>
                                      Trạm:{" "}
                                      {activeStudent?.student?.pickup?.name}
                                    </div>
                                  )}
                                  <div>
                                    Trạng thái:{" "}
                                    <Tag
                                      color={
                                        activeStudent?.status ===
                                        ActiveStudentStatusValue.confirmed
                                          ? "green-inverse"
                                          : activeStudent?.status ===
                                            ActiveStudentStatusValue.canceled
                                          ? "red-inverse"
                                          : activeStudent?.status ===
                                            ActiveStudentStatusValue.leave
                                          ? "orange-inverse"
                                          : "default"
                                      }
                                    >
                                      {activeStudent?.status}
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
              fullname: currentSelectedActiveStudent?.student?.fullname,
              birthday: currentSelectedActiveStudent?.student?.birthday
                ? dayjs(
                    currentSelectedActiveStudent?.student?.birthday,
                    "YYYY-MM-DD"
                  )
                : "",
              gender: currentSelectedActiveStudent?.student?.gender,
              class: currentSelectedActiveStudent?.student?.class?.name,
              parent:
                currentSelectedActiveStudent?.student?.parent?.fullname +
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
                  name="fullname"
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
