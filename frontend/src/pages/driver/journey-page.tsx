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
import LeafletMap from "../../components/leaflet-map";
import { useEffect, useMemo, useState } from "react";
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
import { ruleRequired } from "../../common/rules";
import TextArea from "antd/es/input/TextArea";
import { createInform } from "../../services/inform-service";

const { TabPane } = Tabs;

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

  // Dữ liệu về vận hành xe buýt
  const [driverActive, setDriverActive] = useState<ActiveFormatType>();
  const [isSuccessJourney, setIsSuccessJourney] = useState<boolean>(false);
  const getDriverActive = async () => {
    const response = await execute(getActive(), false);
    const data = response?.data;
    setDriverActive(data);
  };
  useEffect(() => {
    getDriverActive();
  }, []);

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
    console.log(driverActive);

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
                      // Luôn luôn tắt camera khi chuyển đổi giữa các mục
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
                      <LeafletMap id="map-parent" type="detail" />
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
                          renderItem={(item) => (
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
                          )}
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
                        <Button type="primary">Chạy xe</Button>
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
                description: informForm.getFieldValue("description") || undefined,
              }),
              true
            );
            notify(restResponse!, "Tài xế báo cáo sự cố thành công");
            if (restResponse?.result) {
              setModalOpen(false);
              getDriverActive();
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
