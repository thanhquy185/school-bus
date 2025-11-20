import { Card, Tabs, List, Avatar, Button, Row, Col, Tag } from "antd";
import {
  InfoCircleOutlined,
  BellOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  EyeOutlined,
  CalendarOutlined,
  CloseCircleOutlined,
  CameraOutlined,
  UnorderedListOutlined,
  ToolOutlined,
  UserOutlined,
  WarningOutlined,
  CarOutlined,
  CloudOutlined,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import LeafletMap from "../../components/leaflet-map";
import { useEffect, useState } from "react";
import QrBarcodeScanner from "../../components/qr-barcode-scanner";
import { ActiveStudentStatusValue } from "../../common/values";
import type { ActiveStudentFormatType } from "../../common/types";
import { useNotification } from "../../utils/showNotification";
import { useConfirmation } from "../../utils/showConfirmation";

const { TabPane } = Tabs;

const renderStatusTag = (status?: string) => {
  switch (status) {
    case "PENDING":
      return <Tag color="default">{ActiveStudentStatusValue.pending}</Tag>;
    case "LEAVE":
      return <Tag color="red">{ActiveStudentStatusValue.absent}</Tag>;
    case "CANCELED":
      return <Tag color="orange">{ActiveStudentStatusValue.leave}</Tag>;
    case "CHECKED":
      return <Tag color="green">{ActiveStudentStatusValue.checked}</Tag>;
  }
};

const DriverJourneyPage = () => {
  const { openNotification } = useNotification();
  const { openConfirmation } = useConfirmation();

  // Thông tin tài xế (giả lập)
  const driverInfo = {
    id: 1,
    name: "Nguyễn Văn Tài",
    avatar: "https://i.pravatar.cc/100?img=12",
    route: "Tuyến 01",
    busNumber: "51A-123.45",
    status: "Đang hoạt động",
    studentCount: 28,
    startTime: "6:45 AM",
  };

  // Lấy ra thời gian hiện tại
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

  // Quét mã học sinh
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<string>("");
  useEffect(() => {
    console.log(scanResult);
    if (scanResult) {
      openNotification({
        type: "success",
        message: "Thành công",
        description: "Điểm danh học sinh thành công !",
      });
    }
    setScanResult("");
  }, [scanResult]);

  const sampleData: ActiveStudentFormatType[] = [
    {
      student: {
        id: "1",
        avatar: "https://i.pravatar.cc/40?img=1",
        full_name: "Nguyễn Văn A",
        birth_date: "2010-05-12",
        gender: "Nam",
        class: { name: "5A1" },
      },
      time: "08:00",
      status: "CHECKED",
    },
    {
      student: {
        id: "2",
        avatar: "https://i.pravatar.cc/40?img=2",
        full_name: "Trần Thị B",
        birth_date: "2010-08-23",
        gender: "Nữ",
        class: { name: "5A2" },
      },
      time: "08:05",
      status: "PENDING",
    },
    {
      student: {
        id: "3",
        avatar: "https://i.pravatar.cc/40?img=3",
        full_name: "Lê Văn C",
        birth_date: "2010-01-15",
        gender: "Nam",
        class: { name: "5A1" },
      },
      time: "08:10",
      status: "LEAVE",
    },
    {
      student: {
        id: "3",
        avatar: "https://i.pravatar.cc/40?img=3",
        full_name: "Lê Văn C",
        birth_date: "2010-01-15",
        gender: "Nam",
        class: { name: "5A1" },
      },
      time: "08:10",
      status: "LEAVE",
    },
  ];

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
                  <LeafletMap id="map-parent" type="detail" />
                </TabPane>
                <TabPane
                  tab={
                    <>
                      <span>
                        <InfoCircleOutlined />
                      </span>
                      <span>Tuyến đường</span>
                    </>
                  }
                  key="2"
                >
                  <div className="route-infos">
                    <p>
                      <strong>Tuyến xe:</strong> {driverInfo.route}
                    </p>
                    <p>
                      <strong>Thời gian khởi hành:</strong>{" "}
                      {driverInfo.startTime}
                    </p>
                    <p>
                      <strong>Số học sinh trên xe:</strong>{" "}
                      {driverInfo.studentCount}
                    </p>
                    <p>
                      <strong>Trạng thái:</strong> {driverInfo.status}
                    </p>
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
                    <Button
                      variant="solid"
                      color="volcano"
                      icon={
                        !showCamera ? (
                          <CameraOutlined />
                        ) : (
                          <UnorderedListOutlined />
                        )
                      }
                      style={{
                        width: "100%",
                        height: 80,
                        marginBottom: 14,
                        fontSize: 22,
                        fontWeight: 600,
                      }}
                      onClick={() => setShowCamera(!showCamera)}
                    >
                      {!showCamera
                        ? "Điểm danh học sinh bằng quét mã"
                        : "Xem danh sách học sinh"}
                    </Button>
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
                        dataSource={sampleData}
                        pagination={{ pageSize: 4 }}
                        renderItem={(item) => {
                          const student = item.student;
                          return (
                            <List.Item
                              key={student?.id}
                              actions={[
                                <Button
                                  variant="solid"
                                  color="blue"
                                  icon={<EyeOutlined />}
                                  // onClick={() => openDrawerWithMode("view", student)}
                                >
                                  Xem thông tin
                                </Button>,
                                <Button
                                  variant="solid"
                                  color="orange"
                                  icon={<CalendarOutlined />}
                                  onClick={async () => {
                                    const answer = await openConfirmation({
                                      title: "Học sinh này nghỉ phép ?",
                                      content:
                                        "Hãy kiểm tra lại trước khi đồng ý !",
                                    });
                                    if (answer) {
                                      openNotification({
                                        type: "success",
                                        message: "Thành công",
                                        description:
                                          "Cập nhật trạng thái của học sinh thành công !",
                                        duration: 2,
                                      });
                                    }
                                  }}
                                >
                                  Nghỉ phép
                                </Button>,
                                <Button
                                  variant="solid"
                                  color="red"
                                  icon={<CloseCircleOutlined />}
                                  onClick={async () => {
                                    const answer = await openConfirmation({
                                      title: "Học sinh này nghỉ học ?",
                                      content:
                                        "Hãy kiểm tra lại trước khi đồng ý !",
                                    });
                                    if (answer) {
                                      openNotification({
                                        type: "success",
                                        message: "Thành công",
                                        description:
                                          "Cập nhật trạng thái của học sinh thành công !",
                                        duration: 2,
                                      });
                                    }
                                  }}
                                >
                                  Nghỉ học
                                </Button>,
                              ]}
                            >
                              <List.Item.Meta
                                avatar={
                                  <Avatar src={student?.avatar} size={50} />
                                }
                                title={<strong>{student?.full_name}</strong>}
                                description={
                                  <>
                                    <div>Lớp: {student?.class?.name}</div>
                                    <div>Trạm: {student?.pickup?.name}</div>
                                    <div>
                                      Trạng thái: {renderStatusTag(item.status)}
                                    </div>
                                  </>
                                }
                              />
                            </List.Item>
                          );
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
                  <div className="notification-actions">
                    <Button
                      variant="solid"
                      color="red"
                      icon={<WarningOutlined />}
                      // onClick={() => handleReport("accident")}
                    >
                      Xảy ra tai nạn
                    </Button>
                    <Button
                      variant="solid"
                      color="orange"
                      icon={<CarOutlined />}
                      // onClick={() => handleReport("traffic")}
                    >
                      Đường kẹt xe
                    </Button>
                    <Button
                      variant="solid"
                      color="blue"
                      icon={<UserOutlined />}
                      // onClick={() => handleReport("student_issue")}
                    >
                      Học sinh gặp vấn đề
                    </Button>
                    <Button
                      variant="solid"
                      color="purple"
                      icon={<ToolOutlined />}
                      // onClick={() => handleReport("vehicle_issue")}
                    >
                      Xe gặp vấn đề
                    </Button>
                    <Button
                      variant="solid"
                      color="default"
                      icon={<CloudOutlined />}
                      // onClick={() => handleReport("bad_weather")}
                    >
                      Thời tiết xấu
                    </Button>
                  </div>
                  <div className="notification-tags-wrapper">
                    <div className="notification-tags">
                      <Tag color="blue" className="notification-tag">
                        <p className="title">
                          <img
                            src="/src/assets/images/others/parent-info-image.png"
                            alt=""
                          />
                          <span>Xe buýt Tuyến 01 bắt đầu hoạt động</span>
                        </p>
                        <p className="description">
                          Khởi hành từ Công viên Lê Thị Riêng lúc 7:00 AM
                        </p>
                      </Tag>
                      <Tag color="orange" className="notification-tag">
                        <p className="title">
                          <img
                            src="/src/assets/images/others/parent-warning-image.png"
                            alt=""
                          />
                          <span>Xe buýt thay đổi tuyến đường</span>
                        </p>
                        <p className="description">
                          Thay đổi đường đi do sự cố giao thông
                        </p>
                      </Tag>
                      <Tag color="green" className="notification-tag">
                        <p className="title">
                          <img
                            src="/src/assets/images/others/parent-success-image.png"
                            alt=""
                          />
                          <span>Xe buýt đã đến trạm</span>
                        </p>
                        <p className="description">
                          Đến Ngã 3 Hòa Hưng lúc 7:20 AM
                        </p>
                      </Tag>
                      <Tag color="red" className="notification-tag">
                        <p className="title">
                          <img
                            src="/src/assets/images/others/parent-error-image.png"
                            alt=""
                          />
                          <span>Xe buýt hủy đến trạm</span>
                        </p>
                        <p className="description">
                          Hủy tại Vòng xoay Lý Thái Tổ
                        </p>
                      </Tag>
                    </div>
                  </div>
                </TabPane>
              </Tabs>
            </Col>
            <Col className="journey-info-wrapper">
              <div className="top-grid">
                <div className="driver-section">
                  <Avatar size={72} src="https://i.pravatar.cc/100?img=12" />
                  <h3 className="driver-name">Nguyễn Văn Tài</h3>
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
                  <span className="route-badge">Tuyến 01</span>
                </div>
                <div className="route-grid">
                  <div className="item">
                    <span className="label">Bắt đầu</span>
                    <p className="value">Công viên Lê Thị Riêng</p>
                  </div>
                  <div className="item">
                    <span className="label">Kết thúc</span>
                    <p className="value">Trường THCS Minh Đức</p>
                  </div>
                  <div className="item">
                    <span className="label">Khởi hành</span>
                    <p className="value">06:45 AM</p>
                  </div>
                  <div className="item">
                    <span className="label">Học sinh</span>
                    <p className="value">28</p>
                  </div>
                </div>

                <div className="progress-wrapper">
                  <div className="progress-top">
                    <span>Tiến độ</span>
                    <span className="percent">40%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: "40%" }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="bus-section">
                <div className="bus-header">
                  <p className="sub-title">Thông tin xe buýt</p>
                  <span className="bus-badge">Xe 01</span>
                </div>
                <div className="bus-grid">
                  <div className="item">
                    <span className="label">Biển số</span>
                    <p className="value">51A-123.45</p>
                  </div>
                  <div className="item">
                    <span className="label">Sức chứa</span>
                    <p className="value">28 học sinh</p>
                  </div>
                  <div className="item">
                    <span className="label">Tốc độ</span>
                    <p className="value">35 km/h</p>
                  </div>
                  <div className="item">
                    <span className="label">Trạng thái</span>
                    <p className="value">Đang di chuyển</p>
                  </div>
                </div>
              </div>
              <div className="actions">
                <Button type="primary">Bắt đầu chuyến</Button>
                {/* <Button variant="solid" color="green">Hoàn tất</Button>
                <Button variant="solid" color="red">Tạm dừng</Button> */}
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </>
  );
};

export default DriverJourneyPage;
