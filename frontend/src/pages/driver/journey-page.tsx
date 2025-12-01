import CountUp from "react-countup";
import {
  Card,
  Tabs,
  List,
  Avatar,
  Button,
  Row,
  Col,
  Tag,
  Alert,
  Modal,
  Form,
  Input,
} from "antd";
import {
  BellOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  CalendarOutlined,
  CloseCircleOutlined,
  UnorderedListOutlined,
  ToolOutlined,
  UserOutlined,
  WarningOutlined,
  CarOutlined,
  CloudOutlined,
  IdcardOutlined,
  ApartmentOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  LoadingOutlined,
  FrownOutlined,
  SmileOutlined,
  MehOutlined,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useMemo, useState, useCallback } from "react";
import QrBarcodeScanner from "../../components/qr-barcode-scanner";
import {
  ActivePickupStatusValue,
  ActiveStudentStatusValue,
  PointTypeValue,
} from "../../common/values";
import type { ActiveFormatType } from "../../common/types";
import { getActive } from "../../services/driver-service";
import useCallApi from "../../api/useCall";
import { getGenderText } from "../../utils/vi-trans";
import { updateActive } from "../../services/active-service";
import dayjs from "dayjs";
import {
  scanActiveStudent,
  updateActiveStudent,
} from "../../services/active-student-service";
import { updateActivePickup } from "../../services/active-pickup-service";
import { ruleRequired } from "../../common/rules";
import TextArea from "antd/es/input/TextArea";
import { createInform } from "../../services/inform-service";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polyline,
} from "react-leaflet";
import L, { LatLng } from "leaflet";
import { busIcon } from "../../common/leaflet-icon/BusIcon";
import { schoolIcon } from "../../common/leaflet-icon/SchoolIcon";
import { pickupIcon } from "../../common/leaflet-icon/PickupIcon";
import { getCoordRoutes } from "../../common/osm/coords";
import useSocket from "../../api/socket";
import { useNotification } from "../../utils/showNotification";
import { useConfirmation } from "../../utils/showConfirmation";

const { TabPane } = Tabs;

// Component để fly về vị trí cụ thể
const FlyToLocation = ({ center }: { center: LatLng | null }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.flyTo([center.lat, center.lng], 15, {
        duration: 1.5,
      });
    }
  }, [center, map]);

  return null;
};

// Component để set view khi busLocation thay đổi
const SetViewOnBusLocation = ({
  busLocation,
}: {
  busLocation: LatLng | null;
}) => {
  const map = useMap();

  useEffect(() => {
    if (busLocation) {
      map.setView([busLocation.lat, busLocation.lng], 15);
    }
  }, [busLocation, map]);

  return null;
};

const renderActivePickupStatusTag = (status?: string, at?: string) => {
  switch (status) {
    case "CONFIRMED":
      return (
        <Button variant="text" color="green" icon={<CheckCircleOutlined />}>
          {ActivePickupStatusValue.confirmed} (xác nhận lúc {at?.split(" ")[1]})
        </Button>
      );
    case "DRIVING":
      return (
        <Button variant="text" color="orange" icon={<ClockCircleOutlined />}>
          {ActivePickupStatusValue.driving} (xác nhận lúc {at?.split(" ")[1]})
        </Button>
      );
    case "CANCELED":
      return (
        <Button variant="text" color="red" icon={<CloseCircleOutlined />}>
          {ActivePickupStatusValue.canceled} (xác nhận lúc {at?.split(" ")[1]})
        </Button>
      );
    case "PENDING":
      return (
        <Button variant="text" color="default" icon={<LoadingOutlined />}>
          {ActivePickupStatusValue.pending}
        </Button>
      );
  }
};
const renderActiveStudentStatusTag = (status?: string, at?: string) => {
  switch (status) {
    case "CHECKED":
      return (
        <Button variant="text" color="green" icon={<SmileOutlined />}>
          {ActiveStudentStatusValue.checked} (xác nhận lúc {at?.split(" ")[1]})
        </Button>
      );
    case "LEAVE":
      return (
        <Button variant="text" color="orange" icon={<MehOutlined />}>
          {ActiveStudentStatusValue.leave} (xác nhận lúc {at?.split(" ")[1]})
        </Button>
      );
    case "ABSENT":
      return (
        <Button variant="text" color="red" icon={<FrownOutlined />}>
          {ActiveStudentStatusValue.absent} (xác nhận lúc {at?.split(" ")[1]})
        </Button>
      );
    case "PENDING":
      return (
        <Button variant="text" color="default" icon={<LoadingOutlined />}>
          {ActiveStudentStatusValue.pending}
        </Button>
      );
  }
};
const calProgressValue = (driverActive?: ActiveFormatType) => {
  if (!driverActive) return 0;

  // Active Pickups
  const activePickups = driverActive?.active_pickups || [];
  const totalPickup = activePickups.length;
  const processedPickup = activePickups.filter((activePickup) =>
    ["CONFIRMED", "CANCELED"].includes(activePickup?.status!)
  ).length;
  const progressPickup =
    totalPickup > 0 ? (processedPickup / totalPickup) * 100 : 0;

  // Active Students
  const activeStudents = driverActive?.active_students || [];
  const totalStudent = activeStudents.length;
  const processedStudent = activeStudents.filter(
    (activeStudent) => activeStudent.status !== "PENDING"
  ).length;
  const progressStudent =
    totalStudent > 0 ? (processedStudent / totalStudent) * 100 : 0;

  // Tính tiến độ cả 2
  const totalProgressValue = Math.round((progressPickup + progressStudent) / 2);

  return totalProgressValue;
};

const informValues = {
  val1: "Tai nạn",
  val2: "Kẹt xe",
  val3: "Học sinh gặp vấn đề",
  val4: "Xe gặp vấn đề",
  val5: "Thời tiết xấu",
};

// Driver Journey Page
const DriverJourneyPage = () => {
  const { execute, notify } = useCallApi();
  const socketClient = useSocket();
  const { openNotification } = useNotification();
  const { openConfirmation } = useConfirmation();

  // Dữ liệu về vận hành xe buýt
  const [driverActive, setDriverActive] = useState<ActiveFormatType>();
  const [isSuccessJourney, setIsSuccessJourney] = useState<boolean>(false);

  const [activePickups, setActivePickups] = useState<
    {
      at: string;
      order: number;
      pickup: {
        category: string;
        id: number;
        lat: number;
        lng: number;
        name: string;
        status: string;
      };
      status: string;
    }[]
  >([]);
  const [_, setActiveStudents] = useState<any[]>([]);

  const [coords, setCoords] = useState<
    {
      index: number;
      coords: [number, number][];
    }[]
  >([]);

  // isRunning
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const [isLoadPosition, setIsLoadPosition] = useState<boolean>(false);
  // Index of coord
  const [currentCoord, setCurrentCoord] = useState<number>(0);
  // Index of point in coord
  const [currentPoint, setCurrentPoint] = useState<number>(0);

  const [busLocation, setBusLocation] = useState<LatLng | null>(null);
  const [flyToLocation, setFlyToLocation] = useState<LatLng | null>(null);

  // Fix Leaflet default icon issue
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });
  }, []);

  const getDriverActive = async () => {
    const response = await execute(getActive(), false);
    const data = response?.data;
    setDriverActive(data);
  };

  const loadCoordRoutes = async () => {
    if (activePickups.length < 2) return;
    const coordsRoutes: {
      index: number;
      coords: [number, number][];
    }[] = [];
    for (let i = 0; i < activePickups.length - 1; i++) {
      const start = activePickups[i];
      const end = activePickups[i + 1];
      const coordRoute = await getCoordRoutes(
        [start.pickup.lat, start.pickup.lng],
        [end.pickup.lat, end.pickup.lng]
      );
      coordsRoutes.push({
        index: i,
        coords: coordRoute,
      });
    }
    setCoords(coordsRoutes);
  };

  useEffect(() => {
    getDriverActive();
  }, []);

  useEffect(() => {
    if (!driverActive) return;
    const newActivePickups = (driverActive.active_pickups ?? [])
      .slice()
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((item) => ({
        at: item.at ?? "",
        order: item.order ?? 0,
        pickup: {
          category: item.pickup?.category ?? "",
          id: item.pickup?.id ?? 0,
          lat: item.pickup?.lat ?? 0,
          lng: item.pickup?.lng ?? 0,
          name: item.pickup?.name ?? "",
          status: item.pickup?.status ?? "",
        },
        status: item.status ?? "",
      }));

    setActivePickups(newActivePickups);
    setActiveStudents(
      (driverActive.active_students ?? []).slice().sort((a, b) => {
        const aPickupId = a.student?.pickup?.id ?? 0;
        const bPickupId = b.student?.pickup?.id ?? 0;
        return aPickupId - bPickupId;
      })
    );

    // Set position bus
    if (driverActive.bus_lat && driverActive.bus_lng) {
      setBusLocation(new LatLng(driverActive.bus_lat, driverActive.bus_lng));
    } else {
      // Nếu xe chưa có vị trí, đặt xe tại điểm đầu tiên của lộ trình
      if (newActivePickups.length > 0) {
        const firstPickup = newActivePickups[0];
        setBusLocation(
          new LatLng(
            firstPickup.pickup?.lat ?? 10.8231,
            firstPickup.pickup?.lng ?? 106.6297
          )
        );
      }
    }
  }, [driverActive]);

  // Tự động load coords khi có activePickups
  useEffect(() => {
    if (activePickups.length >= 2) {
      loadCoordRoutes();
    }
  }, [activePickups]);

  useEffect(() => {
    if (!coords || coords.length < 2 || !busLocation) return;
    if (isLoadPosition == true) return;
    outter: for (let i = 0; i < coords.length; i++) {
      const busLat = busLocation.lat;
      const busLng = busLocation.lng;
      for (let j = 0; j < coords[i].coords.length; j++) {
        if (
          busLat === coords[i].coords[j][0] &&
          busLng === coords[i].coords[j][1]
        ) {
          setCurrentCoord(i);
          setCurrentPoint(j);
          break outter;
        }
      }
    }
    setIsLoadPosition(true);
  }, [coords, busLocation]);

  const handleChangeIsRunning = async (reserve?: boolean) => {
    const response = await openConfirmation({
      title: "Thông báo chạy xe",
      content: "Có chắc chắn xác nhận hành động này ?",
    });

    if (!response) return;
    setIsRunning(reserve ? reserve : true);
  };

  const handleConfirmPickup = async (item: any) => {
    if (!driverActive) {
      notify(null!, "Không thể xác nhận trạm: chưa tải dữ liệu tài xế");
      return;
    }
    const restResponse = await execute(
      updateActivePickup({
        active_id: driverActive.id!,
        pickup_id: item.pickup.id,
        at: dayjs().format("DD/MM/YYYY HH:mm:ss"),
        status: "CONFIRMED",
      }),
      true
    );

    notify(restResponse!, "Xác nhận đã đến trạm thành công");

    if (restResponse?.result) {
      getDriverActive();
    }
  };

  useEffect(() => {
    if (!isRunning) return;

    if (coords.length === 0) {
      openNotification({
        type: "warning",
        message: "Không thể chạy xe",
        description:
          "Vui lòng đợi hệ thống tải đường đi hoặc ít nhất cần 2 điểm đón để tạo lộ trình",
      });
      setIsRunning(false);
      return;
    }

    // Get all [number, number][] array to tele bus
    const currentRoute = coords[currentCoord]?.coords;
    if (!currentRoute) return;

    // end point in route
    if (currentPoint >= currentRoute.length) {
      const currentPickup = activePickups[currentCoord];
      // check empty route
      if (currentCoord >= coords.length - 1) {
        alert("🏁 Đã hoàn thành hành trình! Hết học sinh rồi.");
        handleConfirmPickup(currentPickup);
        setIsRunning(false);
        return;
      } else {
        // next route and checkin student

        // Đặt xe tại pickup point hiện tại (trạm vừa đến)
        if (currentPickup) {
          setBusLocation(
            new LatLng(currentPickup.pickup.lat, currentPickup.pickup.lng)
          );
        }

        setCurrentCoord(currentCoord + 1);
        setCurrentPoint(0);
        alert(
          `🚏 Đã đến trạm ${currentPickup?.pickup?.name}! Điểm danh học sinh đi.`
        );
        handleConfirmPickup(currentPickup);
        setIsRunning(false);

        return;
      }
    }

    // Next step
    const time = setTimeout(() => {
      const nextCoord = currentRoute[currentPoint];
      if (nextCoord) {
        const newLocation = new LatLng(nextCoord[0], nextCoord[1]);
        setBusLocation(newLocation);
        setCurrentPoint(currentPoint + 1);
        console.log(
          `🚌 Xe đang chạy - Điểm: ${currentPoint + 1}/${
            currentRoute.length
          }, Route: ${currentCoord + 1}/${coords.length}`
        );

        socketClient?.emit("bus-location-send", {
          id: driverActive?.id,
          bus_lat: nextCoord[0],
          bus_lng: nextCoord[1],
          bus_speed: 50,
          bus_status: "RUNNING",
        });
      }
    }, 300);

    return () => clearTimeout(time);
  }, [isRunning, currentCoord, currentPoint, coords.length]);

  // Cột thông tin bên phải
  // - Lấy ra thời gian hiện tại
  const [currentDate, setCurrentDate] = useState("");
  const [currentWeekday, setCurrentWeekday] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const date = now.toLocaleDateString("vi-VN");
      const weekday = now.toLocaleDateString("vi-VN", { weekday: "long" });
      const time = now.toLocaleTimeString("vi-VN");

      setCurrentDate(date);
      setCurrentWeekday(weekday.charAt(0).toUpperCase() + weekday.slice(1));
      setCurrentTime(time);
    };

    updateTime(); // Cập nhật lần đầu
    const timer = setInterval(updateTime, 1000); // cập nhật mỗi giây

    return () => clearInterval(timer);
  }, []);
  // - Tiến độ hành trình
  const [progressValue, setProgressValue] = useState<number>(0);
  useMemo(() => {
    let newProgressValue = calProgressValue(driverActive ?? undefined);

    setProgressValue(newProgressValue);
    if (newProgressValue && newProgressValue === 100) setIsSuccessJourney(true);
  }, [driverActive]);

  // Mục "trạm xe buýt"
  // - Thống kê trạm xe buýt
  const [APTotalPickup, setAPTotalPickup] = useState<number>(0);
  const [APTotalConfirmed, setAPTotalConfirmed] = useState<number>(0);
  const [APTotalDriving, setAPTotalDriving] = useState<number>(0);
  const [APTotalCanceled, setAPTotalCanceled] = useState<number>(0);
  const [APTotalPending, setAPTotalPending] = useState<number>(0);

  // Mục "Học sinh"
  // - Thống kê học sinh
  const [ASTotalStudent, setASTotalStudent] = useState<number>(0);
  const [ASTotalChecked, setASTotalChecked] = useState<number>(0);
  const [ASTotalLeave, setASTotalLeave] = useState<number>(0);
  const [ASTotalAbsent, setASTotalAbsent] = useState<number>(0);
  const [ASTotalPending, setASTotalPending] = useState<number>(0);
  // - Quét mã học sinh
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<string>("");
  useEffect(() => {
    const handleScanCardId = async () => {
      const restResponse = await execute(
        scanActiveStudent({
          active_id: driverActive?.id!,
          card_id: scanResult!,
          at: dayjs().format("DD/MM/YYYY HH:mm:ss"),
        }),
        false
      );
      notify(
        restResponse!,
        "Cập nhật trạng thái đã điểm danh cho học sinh thành công"
      );
      if (restResponse?.result) {
        getDriverActive();
      }
    };
    if (scanResult) handleScanCardId();

    // Mỗi 3s mới được quét để điểm danh tiếp (mỗi 3s mới gọi api 1 lần)
    setTimeout(() => {
      setScanResult("");
    }, 3000);
  }, [scanResult]);

  // Mục "Thông báo"
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [informValue, setInformValue] = useState<string>();
  const [informForm] = Form.useForm<{ message: string; description: string }>();
  useEffect(() => {
    informForm.resetFields();
  }, [modalOpen]);

  useEffect(() => {
    // console.log(driverActive);

    // Thống kê trạm xe buýt
    let newAPTotalPickup = 0,
      newAPTotalConfirmed = 0,
      newAPTotalDriving = 0,
      newAPTotalCanceled = 0,
      newAPTotalPending = 0;
    driverActive?.active_pickups?.forEach((activeStudent) => {
      newAPTotalPickup++;
      if (activeStudent.status === "CONFIRMED") newAPTotalConfirmed++;
      if (activeStudent.status === "DRIVING") newAPTotalDriving++;
      if (activeStudent.status === "CANCELED") newAPTotalCanceled++;
      if (activeStudent.status === "PENDING") newAPTotalPending++;
    });
    setAPTotalPickup(newAPTotalPickup);
    setAPTotalConfirmed(newAPTotalConfirmed);
    setAPTotalDriving(newAPTotalDriving);
    setAPTotalCanceled(newAPTotalCanceled);
    setAPTotalPending(newAPTotalPending);

    // Thống kê học sinh
    let newASTotalStudent = 0,
      newASTotalChecked = 0,
      newASTotalLeave = 0,
      newASTotalAbsent = 0,
      newASTotalPending = 0;
    driverActive?.active_students?.forEach((activeStudent) => {
      newASTotalStudent++;
      if (activeStudent.status === "CHECKED") newASTotalChecked++;
      if (activeStudent.status === "LEAVE") newASTotalLeave++;
      if (activeStudent.status === "ABSENT") newASTotalAbsent++;
      if (activeStudent.status === "PENDING") newASTotalPending++;
    });
    setASTotalStudent(newASTotalStudent);
    setASTotalChecked(newASTotalChecked);
    setASTotalLeave(newASTotalLeave);
    setASTotalAbsent(newASTotalAbsent);
    setASTotalPending(newASTotalPending);
  }, [driverActive]);

  return (
    <>
      <div className="client-layout__main">
        <h2 className="client-layout__title">
          <span>
            <FontAwesomeIcon icon={faMapLocationDot} />
            <strong>Hành trình đưa đón</strong>
          </span>
        </h2>
        <Card
          className="client-layout__journey driver"
          title="Thông tin hành trình đưa đón"
        >
          {driverActive ? (
            <>
              <Row className="row">
                <Col className="tabs-wrapper">
                  <Tabs
                    type="card"
                    defaultActiveKey="1"
                    onChange={() => {
                      setShowCamera(false);
                    }}
                  >
                    <TabPane
                      tab={
                        <>
                          <span>
                            <EnvironmentOutlined />
                          </span>
                          <span>Bản đồ</span>
                        </>
                      }
                      key="1"
                    >
                      {/* <LeafletMap id="map-parent" type="detail" /> */}

                      <MapContainer
                        style={{ height: "600px", width: "100%", zIndex: 1 }}
                        center={[
                          busLocation?.lat || 10.8231,
                          busLocation?.lng || 106.6297,
                        ]}
                        zoom={15}
                        scrollWheelZoom={true}
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />

                        {/* Auto center map when bus location changes */}
                        <SetViewOnBusLocation busLocation={busLocation} />

                        {/* Route */}
                        {coords &&
                          coords.map((coord, index) => (
                            <Polyline
                              key={`route-${index}`}
                              positions={coord.coords}
                              pathOptions={{
                                color: "#1890ff",
                                weight: 4,
                                opacity: 0.7,
                                dashArray: "10, 5",
                              }}
                            />
                          ))}

                        {/* Component để fly đến vị trí */}
                        <FlyToLocation center={flyToLocation} />

                        {/* Bus location */}
                        <Marker
                          position={
                            busLocation || new LatLng(10.8231, 106.6297)
                          }
                          icon={busIcon}
                        >
                          <Popup>
                            Vị trí xe buýt hiện tại
                            <br />
                            {busLocation &&
                              `Lat: ${busLocation.lat.toFixed(
                                6
                              )}, Lng: ${busLocation.lng.toFixed(6)}`}
                          </Popup>
                        </Marker>

                        {/* Pickup location */}
                        {activePickups &&
                          activePickups.map((activePickup, index) => {
                            if (busLocation) {
                              if (
                                activePickup.pickup.lat === busLocation.lat &&
                                activePickup.pickup.lng === busLocation.lng
                              )
                                return null;
                            }

                            if (activePickup.pickup.category === "SCHOOL") {
                              return (
                                <Marker
                                  key={`school-${index}`}
                                  position={
                                    activePickup.pickup
                                      ? new LatLng(
                                          activePickup.pickup.lat,
                                          activePickup.pickup.lng
                                        )
                                      : new LatLng(0, 0)
                                  }
                                  icon={schoolIcon}
                                >
                                  <Popup>
                                    <p>
                                      Trường học: {activePickup.pickup.name}
                                    </p>
                                    <p>
                                      Tọa độ: {activePickup.pickup.lat},{" "}
                                      {activePickup.pickup.lng}
                                    </p>
                                  </Popup>
                                </Marker>
                              );
                            }

                            return (
                              <Marker
                                key={`pickup-${index}`}
                                position={
                                  activePickup.pickup
                                    ? new LatLng(
                                        activePickup.pickup.lat,
                                        activePickup.pickup.lng
                                      )
                                    : new LatLng(0, 0)
                                }
                                icon={pickupIcon}
                              >
                                <Popup>
                                  <p>Điểm đón: {activePickup.pickup.name}</p>
                                  <p>Thứ tự: {activePickup.order}</p>
                                  <p>
                                    Tọa độ: {activePickup.pickup.lat},{" "}
                                    {activePickup.pickup.lng}
                                  </p>
                                  <p>
                                    Trạng thái:{" "}
                                    {activePickup.status === "CONFIRMED"
                                      ? "Đã xác nhận"
                                      : activePickup.status === "DRIVING"
                                      ? "Đang di chuyển"
                                      : activePickup.status === "CANCELED"
                                      ? "Đã hủy"
                                      : "Chờ xử lý"}
                                  </p>
                                </Popup>
                              </Marker>
                            );
                          })}
                      </MapContainer>

                      <div
                        style={{ marginTop: 16, display: "flex", gap: "12px" }}
                      >
                        <Button onClick={loadCoordRoutes}>Xem đường đi</Button>
                        <Button
                          type="primary"
                          icon={<EnvironmentOutlined />}
                          onClick={() => {
                            if (busLocation) {
                              setFlyToLocation(
                                new LatLng(busLocation.lat, busLocation.lng)
                              );
                            }
                          }}
                          disabled={!busLocation}
                        >
                          Về vị trí xe
                        </Button>
                      </div>
                    </TabPane>
                    <TabPane
                      tab={
                        <>
                          <span>
                            <ApartmentOutlined />
                          </span>
                          <span>Trạm xe buýt</span>
                        </>
                      }
                      key="2"
                    >
                      <div className="pickup-infos">
                        <div className="header">
                          <div className="summary">
                            <p>Tổng số trạm xe buýt</p>
                            <strong>
                              <CountUp end={APTotalPickup} duration={1} />
                            </strong>
                          </div>
                          <div className="statistics">
                            <div className="statistic green">
                              <p>{ActivePickupStatusValue.confirmed}</p>
                              <strong>
                                <CountUp end={APTotalConfirmed} duration={1} />
                              </strong>
                            </div>
                            <div className="statistic orange">
                              <p>{ActivePickupStatusValue.driving}</p>
                              <strong>
                                <CountUp end={APTotalDriving} duration={1} />
                              </strong>
                            </div>
                            <div className="statistic red">
                              <p>{ActivePickupStatusValue.canceled}</p>
                              <strong>
                                <CountUp end={APTotalCanceled} duration={1} />
                              </strong>
                            </div>
                            <div className="statistic gray">
                              <p>{ActivePickupStatusValue.pending}</p>
                              <strong>
                                <CountUp end={APTotalPending} duration={1} />
                              </strong>
                            </div>
                          </div>
                        </div>
                        <List
                          itemLayout="horizontal"
                          dataSource={driverActive.active_pickups}
                          pagination={{ pageSize: 4 }}
                          renderItem={(item) => {
                            if (
                              item.pickup?.category === "SCHOOL" &&
                              item.status !== "CONFIRMED"
                            ) {
                              handleConfirmPickup(item);
                            }
                            return (
                              <List.Item
                                className={
                                  item.status === "CONFIRMED"
                                    ? "green"
                                    : item.status === "DRIVING"
                                    ? "orange"
                                    : item.status === "CANCELED"
                                    ? "red"
                                    : "gray"
                                }
                              >
                                <List.Item.Meta
                                  avatar={
                                    <Avatar
                                      src={
                                        item.pickup?.category === "SCHOOL"
                                          ? "https://cdn-icons-png.flaticon.com/512/167/167707.png"
                                          : "https://cdn-icons-png.flaticon.com/512/6395/6395324.png"
                                      }
                                      size={48}
                                    />
                                  }
                                  title={
                                    <div className="title">
                                      <strong>{item.pickup?.name}</strong>
                                      {renderActivePickupStatusTag(
                                        item.status,
                                        item.at
                                      )}
                                    </div>
                                  }
                                  description={
                                    <>
                                      <p>Thứ tự: {item.order}</p>
                                      <p>
                                        Loại:{" "}
                                        {item.pickup?.category === "SCHOOL"
                                          ? PointTypeValue.school
                                          : PointTypeValue.pickup}
                                      </p>
                                    </>
                                  }
                                />
                              </List.Item>
                            );
                          }}
                        />
                      </div>
                    </TabPane>
                    <TabPane
                      tab={
                        <>
                          <span>
                            <TeamOutlined />
                          </span>
                          <span>Học sinh</span>
                        </>
                      }
                      key="3"
                    >
                      <div className="student-infos">
                        <div className="header">
                          <div className="summary">
                            <p>Tổng số học sinh</p>
                            <strong>
                              <CountUp end={ASTotalStudent} duration={1} />
                            </strong>
                          </div>
                          <div className="statistics">
                            <div className="statistic green">
                              <p>{ActiveStudentStatusValue.checked}</p>
                              <strong>
                                <CountUp end={ASTotalChecked} duration={1} />
                              </strong>
                            </div>
                            <div className="statistic orange">
                              <p>{ActiveStudentStatusValue.leave}</p>
                              <strong>
                                <CountUp end={ASTotalLeave} duration={1} />
                              </strong>
                            </div>
                            <div className="statistic red">
                              <p>{ActiveStudentStatusValue.absent}</p>
                              <strong>
                                <CountUp end={ASTotalAbsent} duration={1} />
                              </strong>
                            </div>
                            <div className="statistic gray">
                              <p>{ActiveStudentStatusValue.pending}</p>
                              <strong>
                                <CountUp end={ASTotalPending} duration={1} />
                              </strong>
                            </div>
                          </div>
                          <Button
                            variant="solid"
                            color="blue"
                            icon={
                              !showCamera ? (
                                <IdcardOutlined />
                              ) : (
                                <UnorderedListOutlined />
                              )
                            }
                            onClick={() => setShowCamera(!showCamera)}
                          >
                            {!showCamera ? "Điểm danh" : "Danh sách"}
                          </Button>
                        </div>
                        {showCamera ? (
                          <>
                            <div
                              style={{
                                height: 526,
                              }}
                            >
                              <QrBarcodeScanner onScan={setScanResult} />
                            </div>
                          </>
                        ) : (
                          <List
                            itemLayout="horizontal"
                            dataSource={driverActive.active_students}
                            pagination={{ pageSize: 3 }}
                            renderItem={(item) => (
                              <List.Item
                                className={
                                  item.status === "CHECKED"
                                    ? "green"
                                    : item.status === "LEAVE"
                                    ? "orange"
                                    : item.status === "ABSENT"
                                    ? "red"
                                    : "gray"
                                }
                                actions={[
                                  <Button
                                    variant="solid"
                                    color="orange"
                                    icon={<CalendarOutlined />}
                                    onClick={async () => {
                                      const restResponse = await execute(
                                        updateActiveStudent({
                                          active_id: driverActive.id!,
                                          student_id: item.student?.id!,
                                          at: dayjs().format(
                                            "DD/MM/YYYY HH:mm:ss"
                                          ),
                                          status: "LEAVE",
                                        }),
                                        true
                                      );
                                      notify(
                                        restResponse!,
                                        "Cập nhật trạng thái đã nghỉ phép cho học sinh thành công"
                                      );
                                      if (restResponse?.result) {
                                        getDriverActive();
                                      }
                                    }}
                                    disabled={item?.status === "LEAVE"}
                                  >
                                    Nghỉ phép
                                  </Button>,
                                  <Button
                                    variant="solid"
                                    color="red"
                                    icon={<CloseCircleOutlined />}
                                    onClick={async () => {
                                      const restResponse = await execute(
                                        updateActiveStudent({
                                          active_id: driverActive.id!,
                                          student_id: item.student?.id!,
                                          at: dayjs().format(
                                            "DD/MM/YYYY HH:mm:ss"
                                          ),
                                          status: "ABSENT",
                                        }),
                                        true
                                      );
                                      notify(
                                        restResponse!,
                                        "Cập nhật trạng thái đã nghỉ học cho học sinh này thành công"
                                      );
                                      if (restResponse?.result) {
                                        getDriverActive();
                                      }
                                    }}
                                    disabled={item?.status === "ABSENT"}
                                  >
                                    Nghỉ học
                                  </Button>,
                                ]}
                              >
                                <List.Item.Meta
                                  avatar={
                                    <Avatar
                                      src={item.student?.avatar}
                                      size={48}
                                    />
                                  }
                                  title={
                                    <div className="title">
                                      <strong>{item.student?.full_name}</strong>
                                      {renderActiveStudentStatusTag(
                                        item.status,
                                        item.at
                                      )}
                                    </div>
                                  }
                                  description={
                                    <>
                                      <p>
                                        Ngày sinh: {item.student?.birth_date}
                                      </p>
                                      <p>
                                        Giới tính:{" "}
                                        <Tag
                                          color={
                                            item.student?.gender === "MALE"
                                              ? "blue"
                                              : "magenta"
                                          }
                                        >
                                          {getGenderText(item.student?.gender!)}
                                        </Tag>
                                      </p>
                                      <p>Lớp: {item.student?.class?.name}</p>
                                      <p>
                                        Phụ huynh:{" "}
                                        {item.student?.parent?.full_name}
                                      </p>
                                      <p>Trạm: {item.student?.pickup?.name}</p>
                                    </>
                                  }
                                />
                              </List.Item>
                            )}
                            style={{
                              height: 526,
                            }}
                          />
                        )}
                      </div>
                    </TabPane>
                    <TabPane
                      tab={
                        <>
                          <span>
                            <BellOutlined />
                          </span>
                          <span>Thông báo</span>
                        </>
                      }
                      key="4"
                    >
                      <div className="inform-actions">
                        <Button
                          variant="solid"
                          color="red"
                          icon={<WarningOutlined />}
                          onClick={() => {
                            setInformValue(informValues.val1);
                            setModalOpen(true);
                          }}
                        >
                          {informValues.val1}
                        </Button>
                        <Button
                          variant="solid"
                          color="orange"
                          icon={<CarOutlined />}
                          onClick={() => {
                            setInformValue(informValues.val2);
                            setModalOpen(true);
                          }}
                        >
                          {informValues.val2}
                        </Button>
                        <Button
                          variant="solid"
                          color="blue"
                          icon={<UserOutlined />}
                          onClick={() => {
                            setInformValue(informValues.val3);
                            setModalOpen(true);
                          }}
                        >
                          {informValues.val3}
                        </Button>
                        <Button
                          variant="solid"
                          color="purple"
                          icon={<ToolOutlined />}
                          onClick={() => {
                            setInformValue(informValues.val4);
                            setModalOpen(true);
                          }}
                        >
                          {informValues.val4}
                        </Button>
                        <Button
                          variant="solid"
                          color="default"
                          icon={<CloudOutlined />}
                          onClick={() => {
                            setInformValue(informValues.val5);
                            setModalOpen(true);
                          }}
                        >
                          {informValues.val5}
                        </Button>
                      </div>
                      <div className="inform-tags-wrapper">
                        <div className="inform-tags">
                          {driverActive?.informs
                            ?.sort((a, b) => b.at?.localeCompare(a.at!)!)
                            .map((inform) => (
                              <Alert
                                type={
                                  inform?.type?.toLowerCase() as
                                    | "info"
                                    | "success"
                                    | "warning"
                                    | "error"
                                    | undefined
                                }
                                className="inform-tag inform"
                                message={
                                  <>
                                    <p className="title">
                                      <img
                                        src={`/src/assets/images/others/inform-${inform?.type}-icon.png`}
                                        alt=""
                                      />
                                      <span>{inform?.message}</span>
                                    </p>
                                  </>
                                }
                                description={
                                  <>
                                    <p className="description">
                                      {inform?.description} vào lúc{" "}
                                      {inform?.at?.split(" ")[1]}
                                    </p>
                                  </>
                                }
                                style={{ margin: 0 }}
                              ></Alert>
                            ))}
                        </div>
                      </div>
                    </TabPane>
                  </Tabs>
                </Col>
                <Col className="journey-info-wrapper">
                  <div className="top-grid">
                    <div className="driver-section">
                      <Avatar
                        size={72}
                        src={driverActive.schedule?.driver?.avatar}
                      />
                      <h3 className="driver-name">
                        {driverActive.schedule?.driver?.full_name}
                      </h3>
                      <p className="driver-role">Tài xế chính</p>
                    </div>
                    <div className="date-section">
                      <div className="date-card">
                        <p className="date-main">{currentDate}</p>
                        <p className="date-sub">{currentWeekday}</p>
                        <p className="date-time">{currentTime}</p>
                      </div>
                    </div>
                  </div>
                  <div className="route-section">
                    <div className="route-header">
                      <p className="sub-title">Tổng quan hành trình</p>
                      <span className="route-badge">
                        Tuyến {driverActive.schedule?.route?.id}
                      </span>
                    </div>
                    <div className="route-grid">
                      <div className="item">
                        <span className="label">Bắt đầu</span>
                        <p className="value">
                          {driverActive.schedule?.route?.start_pickup}
                        </p>
                      </div>
                      <div className="item">
                        <span className="label">Kết thúc</span>
                        <p className="value">
                          {driverActive.schedule?.route?.end_pickup}
                        </p>
                      </div>
                      <div className="item">
                        <span className="label">Thời gian dự kiến</span>
                        <p className="value">
                          {driverActive.schedule?.start_time} -{" "}
                          {driverActive.schedule?.end_time}
                        </p>
                      </div>
                      <div className="item">
                        <span className="label">Học sinh</span>
                        <p className="value">{ASTotalStudent}</p>
                      </div>
                    </div>
                    <div className="progress-wrapper">
                      <div className="progress-top">
                        <span>Tiến độ</span>
                        <span className="percent">{progressValue}%</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${progressValue}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="bus-section">
                    <div className="bus-header">
                      <p className="sub-title">Thông tin xe buýt</p>
                      <span className="bus-badge">
                        Xe {driverActive.schedule?.bus?.id}
                      </span>
                    </div>
                    <div className="bus-grid">
                      <div className="item">
                        <span className="label">Biển số</span>
                        <p className="value">
                          {driverActive.schedule?.bus?.license_plate}
                        </p>
                      </div>
                      <div className="item">
                        <span className="label">Số chỗ ngồi</span>
                        <p className="value">
                          {driverActive.schedule?.bus?.capacity}
                        </p>
                      </div>
                      <div className="item">
                        <span className="label">Tốc độ</span>
                        <p className="value">{driverActive.bus_speed} km/h</p>
                      </div>
                      <div className="item">
                        <span className="label">Trạng thái</span>
                        {/* <p className="value">{driverActive.busStatus}</p> */}
                        <p className="value">Đang di chuyển</p>
                      </div>
                    </div>
                  </div>
                  <div className="actions">
                    {isSuccessJourney ? (
                      <>
                        <Button
                          type="primary"
                          onClick={async () => {
                            const restResponse = await execute(
                              updateActive(driverActive.id!, {
                                end_at: dayjs().format("DD/MM/YYYY HH:mm:ss"),
                                status: "SUCCESS",
                              }),
                              true
                            );
                            notify(
                              restResponse!,
                              "Xác nhận làm việc thành công"
                            );
                            if (restResponse?.result) {
                              getDriverActive();
                            }
                          }}
                        >
                          Hoàn tất chuyến đi
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          type="primary"
                          onClick={() => handleChangeIsRunning()}
                          // loading={isRunning}
                        >
                          Chạy xe
                        </Button>
                        <Button onClick={() => setIsRunning(false)}>
                          Dừng xe
                        </Button>
                      </>
                    )}
                  </div>
                </Col>
              </Row>
            </>
          ) : (
            <>
              <div className="big-inform">
                <img src="/src/assets/images/others/schedule-question-icon.png" />
                <h3>Tài xế chưa xác nhận làm việc</h3>
                <p>
                  Vui lòng chuyển đến mục <strong>lịch trình</strong> để xác
                  nhận ca làm ngày hôm nay.
                </p>
              </div>
            </>
          )}
        </Card>
      </div>
      <Modal
        title={
          <p
            className={
              informValue === informValues.val1
                ? "red"
                : informValue === informValues.val2
                ? "orange"
                : informValue === informValues.val3
                ? "blue"
                : informValue === informValues.val4
                ? "purple"
                : ""
            }
          >
            {informValue === informValues.val1 ? (
              <WarningOutlined />
            ) : informValue === informValues.val2 ? (
              <CarOutlined />
            ) : informValue === informValues.val3 ? (
              <UserOutlined />
            ) : informValue === informValues.val4 ? (
              <ToolOutlined />
            ) : (
              <CloudOutlined />
            )}{" "}
            {informValue}
          </p>
        }
        centered
        open={modalOpen}
        footer={null}
        onCancel={() => setModalOpen(false)}
        className="inform-modal"
      >
        <Form
          form={informForm}
          layout="vertical"
          autoComplete="off"
          initialValues={{ message: undefined, description: undefined }}
          onFinish={async () => {
            const restResponse = await execute(
              createInform({
                active_id: driverActive?.id!,
                at: dayjs().format("DD/MM/YYYY HH:mm:ss"),
                type: "WARNING",
                message: informForm.getFieldValue("message") || undefined,
                description:
                  informForm.getFieldValue("description") || undefined,
              }),
              true
            );
            notify(restResponse!, "Tài xế báo cáo sự cố thành công");
            if (restResponse?.result) {
              setModalOpen(false);
              getDriverActive();
              if (socketClient) {
                socketClient.emit("bus-notification-send", {
                  active_id: restResponse.data.active.id,
                  notify_id: restResponse.data.id,
                  at: restResponse.data.at,
                  type: restResponse.data.type,
                  message: restResponse.data.message,
                  description: restResponse.data.description,
                });
              }
            }
          }}
        >
          <Form.Item
            name="message"
            label="Tiêu đề"
            rules={[ruleRequired("Tiêu đề không được bỏ trống !")]}
          >
            <Input placeholder="Nhập Tiêu đề"></Input>
          </Form.Item>
          <Form.Item
            name="description"
            label="Nội dung"
            rules={[ruleRequired("Nội dung không được bỏ trống !")]}
          >
            <TextArea
              showCount
              placeholder="Nhập Nội dung"
              style={{ height: 160, resize: "none" }}
            ></TextArea>
          </Form.Item>
          <Button
            htmlType="submit"
            variant="solid"
            color={
              informValue === informValues.val1
                ? "red"
                : informValue === informValues.val2
                ? "orange"
                : informValue === informValues.val3
                ? "blue"
                : informValue === informValues.val4
                ? "purple"
                : "default"
            }
            style={{
              width: "100%",
              height: 35,
              marginTop: 30,
              fontWeight: 500,
            }}
          >
            Xác nhận
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default DriverJourneyPage;
