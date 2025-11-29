import { Card, Tabs, List, Avatar, Button, Row, Col, Alert, Tag } from "antd";
import {
  InfoCircleOutlined,
  BellOutlined,
  EnvironmentOutlined,
  CloseOutlined,
  LoadingOutlined,
  FrownOutlined,
  MehOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import LeafletMap from "../../components/leaflet-map";
import { useEffect, useState } from "react";
import type {
  ActiveFormatType,
  StudentFormatType,
} from "../../common/types";
import {
  ActiveStudentStatusValue,
  CommonGenderValue,
  PointTypeValue,
  StudentStatusValue,
} from "../../common/values";
import { getActiveByStudent, getStudents } from "../../services/parent-service";
import useCallApi from "../../api/useCall";
import { getGenderText } from "../../utils/vi-trans";
import useSocket from "../../api/socket";
import { LatLng } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { busIcon } from "../../common/leaflet-icon/BusIcon";
import type { CurrentActiveStudent } from "./interface";
import StudentIcon from "../../common/leaflet-icon/StudentIcon";
import { useNotification } from "../../utils/showNotification";

const { TabPane } = Tabs;

//
const ParentJourneyPage = () => {
  const { execute, notify, loading } = useCallApi();
  const socketClient = useSocket();
  const { openNotification } = useNotification();

  // Xử lý khi chọn 1 học sinh
  const [selectedStudent, setSelectedStudent] =
    useState<StudentFormatType | null>(null);
  const handleSelectStudent = (student: StudentFormatType | null) => {
    // Nếu chọn lại cùng học sinh -> bỏ chọn
    setSelectedStudent((prev: any) =>
      prev && prev.id === student?.id ? null : student
    );
  };

  // Dữ liệu học sinh mà phụ huynh có quản lý
  const [parentStudents, setParentStudents] = useState<StudentFormatType[]>([]);
  const getStudentsByParent = async () => {
    const restResponse = await execute(getStudents(), false);
    if (restResponse?.result) {
      setParentStudents(
        restResponse.data?.map((student: StudentFormatType) => ({
          ...student,
          gender:
            student?.gender === "MALE"
              ? CommonGenderValue.male
              : CommonGenderValue.female,
          status:
            student?.status === "STUDYING"
              ? StudentStatusValue.studying
              : StudentStatusValue.dropped_out,
          pickup: {
            ...student.pickup,
            category:
              student.pickup?.category === "SCHOOL"
                ? PointTypeValue.school
                : PointTypeValue.pickup,
          },
        }))
      );
    }
  };

  useEffect(() => {
    getStudentsByParent();
  }, []);

  // Dữ liệu vận xe của 1 học sinh
  const [parentActiveStudent, setParentActiveStudent] =
    useState<ActiveFormatType>();

  const [busLocation, setBusLocation] = useState<LatLng | null>(null);

  const [studentPosition, setStudentPosition] = useState<LatLng | null>(null);
  const [currentActiveStudent, setCurrentActiveStudent] = useState<CurrentActiveStudent>({} as CurrentActiveStudent);

  const [notifications, setNotifications] = useState<{
    at: string,
    description: string,
    message: string,
    id: number,
    type: string
  }[]>([]);

  const getParentActiveStudent = async () => {
    if (!selectedStudent) return;
    const restResponse = await execute(
      getActiveByStudent(selectedStudent?.id!),
      false
    );
    if (restResponse?.result) {
      setParentActiveStudent(restResponse.data);
      setBusLocation(new LatLng(restResponse.data.bus_lat, restResponse.data.bus_lng));
      setCurrentActiveStudent(restResponse.data.current_active_student);
      setStudentPosition(new LatLng(restResponse.data.current_active_student.student.pickup.lat, restResponse.data.current_active_student.student.pickup.lng));
      setNotifications(restResponse.data.informs);
    }
  };

  useEffect(() => {
    getParentActiveStudent();
  }, [selectedStudent]);

  useEffect(() => {
    if (!socketClient || !parentActiveStudent?.id) return;

    const busLocationHandler = (data: any) => {
      setBusLocation(new LatLng(data.bus_lat, data.bus_lng));
    };

    const busNotificationHandler = (data: any) => {
      showNotificationFromSocket(data);
      setNotifications(prev => [...prev, data]);
    };

    socketClient.on(`bus-location-receive/${parentActiveStudent.id}`, busLocationHandler);
    socketClient.on(`bus-notification-receive/${parentActiveStudent.id}`, busNotificationHandler);

    return () => {
      socketClient.off(`bus-location-receive/${parentActiveStudent.id}`, busLocationHandler);
      socketClient.off(`bus-notification-receive/${parentActiveStudent.id}`, busNotificationHandler);
    };
  }, [socketClient, parentActiveStudent?.id]);

  const showNotificationFromSocket = (data: any) => {
    openNotification({
      type: data.type === "WARNING" ? "warning" : "info",
      description: data.description,
      message: data.message
    });
  }

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
          className="client-layout__journey parent"
          title="Thông tin hành trình đưa đón"
        >
          <Row className="row">
            <Col className="tabs-wrapper">
              {!selectedStudent && (
                <>
                  <div className="big-inform">
                    <img src="/src/assets/images/others/student-question-icon.png" />
                    <h3>
                      Phụ huynh chưa chọn học sinh để xem hành trình đưa đón
                    </h3>
                    <p>
                      Vui lòng chọn một <strong>học sinh</strong> từ danh sách
                      bên phải để theo dõi hành trình đưa đón của em.
                    </p>
                  </div>
                </>
              )}
              {selectedStudent && !parentActiveStudent && (
                <>
                  <div className="big-inform">
                    <img src="/src/assets/images/others/journey-question-icon.png" />
                    <h3>
                      Hành trình đưa đón của học sinh hiện không hoạt động
                    </h3>
                    <p>
                      Hành trình không được kích hoạt vì tài xế hôm nay không có
                      ca làm hoặc vì một số lý do khác.
                    </p>
                  </div>
                </>
              )}
              {selectedStudent && parentActiveStudent && (
                <>
                  <Tabs type="card" defaultActiveKey="1">
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
                      {/* {currentSelectedItem && (
                    <>
                      <div className="map-infos">
                        <div className="map-info"></div>
                      </div>
                    </>
                  )} */}
                      {/* <LeafletMap id="map-parent" type="detail" /> */}

                      {/* busLocation */}
                      <MapContainer
                        style={{ height: "600px", width: "100%", zIndex: 1 }}
                        center={[busLocation?.lat || 10.8231, busLocation?.lng || 106.6297]}
                        zoom={15}
                        scrollWheelZoom={true}
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />

                        {/* Auto center map when bus location changes */}
                        {/* <SetViewOnBusLocation busLocation={busLocation} /> */}

                        {/* Route */}
                        {/* {coords && coords.map((coord, index) => (
                          <Polyline
                            key={`route-${index}`}
                            positions={coord.coords}
                            pathOptions={{
                              color: '#1890ff',
                              weight: 4,
                              opacity: 0.7,
                              dashArray: '10, 5'
                            }}
                          />
                        ))} */}

                        {/* Component để fly đến vị trí */}
                        {/* <FlyToLocation center={flyToLocation} /> */}

                        {/* Student Location */}
                        {currentActiveStudent && (
                          <Marker
                            position={studentPosition || new LatLng(10.8231, 106.6297)}
                            icon={StudentIcon(currentActiveStudent.student.avatar)}
                          >
                            <Popup>
                              Vị trí xe buýt hiện tại<br />
                              {busLocation && `Lat: ${busLocation.lat.toFixed(6)}, Lng: ${busLocation.lng.toFixed(6)}`}
                            </Popup>
                          </Marker>
                        )}

                        {/* Bus location */}
                        <Marker
                          position={busLocation || new LatLng(10.8231, 106.6297)}
                          icon={busIcon}
                        >
                          <Popup>
                            Vị trí xe buýt hiện tại<br />
                            {busLocation && `Lat: ${busLocation.lat.toFixed(6)}, Lng: ${busLocation.lng.toFixed(6)}`}
                          </Popup>
                        </Marker>

                      </MapContainer>

                    </TabPane>
                    <TabPane
                      tab={
                        <>
                          <span>
                            <InfoCircleOutlined />
                          </span>
                          <span>Thông tin</span>
                        </>
                      }
                      key="2"
                    >
                      <div className="journey-infos">
                        <div className="info route">
                          <div className="header">
                            <img
                              src="https://cdn-icons-png.flaticon.com/512/854/854894.png"
                              alt=""
                              className="icon"
                            />
                            <p className="title">Tuyến đường</p>
                          </div>
                          <p className="description">
                            Tên tuyến:{" "}
                            <b>{parentActiveStudent?.schedule?.route?.name}</b>
                          </p>
                          <p className="description">
                            Thời gian dự kiến:{" "}
                            <b>
                              {parentActiveStudent?.schedule?.start_time} -{" "}
                              {parentActiveStudent?.schedule?.end_time}
                            </b>
                          </p>
                          <p className="description">
                            Hành trình:{" "}
                            <b>
                              {parentActiveStudent?.schedule?.route?.routePickups?.map(
                                (routePickup) => (
                                  <>
                                    {routePickup?.pickup?.name}{" "}
                                    {routePickup?.order ===
                                      parentActiveStudent?.schedule?.route
                                        ?.routePickups?.length!
                                      ? ""
                                      : "→"}{" "}
                                  </>
                                )
                              )}
                            </b>
                          </p>
                        </div>
                        <div className="row">
                          <div className="info driver">
                            <div className="header">
                              <img
                                src="https://cdn-icons-png.flaticon.com/512/2684/2684225.png"
                                alt=""
                                className="icon"
                              />
                              <p className="title">Tài xế</p>
                            </div>
                            <div className="row">
                              <img
                                src={
                                  parentActiveStudent?.schedule?.driver?.avatar
                                }
                                alt=""
                                className="avatar"
                              />
                              <div>
                                <p className="description">
                                  Họ tên:{" "}
                                  <b>
                                    {
                                      parentActiveStudent?.schedule?.driver
                                        ?.full_name
                                    }
                                  </b>
                                </p>
                                <p className="description">
                                  Ngày sinh:{" "}
                                  <b>
                                    {
                                      parentActiveStudent?.schedule?.driver
                                        ?.birth_date
                                    }
                                  </b>
                                </p>
                                <p className="description">
                                  Giới tính:{" "}
                                  <b>
                                    {getGenderText(
                                      parentActiveStudent?.schedule?.driver
                                        ?.gender!
                                    )}
                                  </b>
                                </p>
                                <p className="description">
                                  Số điện thoại:{" "}
                                  <b>
                                    {
                                      parentActiveStudent?.schedule?.driver
                                        ?.phone
                                    }
                                  </b>
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="info bus">
                            <div className="header">
                              <img
                                src="https://cdn-icons-png.flaticon.com/512/1068/1068580.png"
                                alt=""
                                className="icon"
                              />
                              <p className="title">Xe buýt</p>
                            </div>
                            <p className="description">
                              Biển số:{" "}
                              <b>
                                {
                                  parentActiveStudent?.schedule?.bus
                                    ?.license_plate
                                }
                              </b>
                            </p>
                            <p className="description">
                              Số chỗ:{" "}
                              <b>
                                {parentActiveStudent?.schedule?.bus?.capacity}
                              </b>
                            </p>
                            <p className="description">
                              Tốc độ:{" "}
                              <b>{parentActiveStudent?.bus_speed} km/h</b>
                            </p>
                            <p className="description">
                              Trạng thái:{" "}
                              <b>{parentActiveStudent?.bus_status}</b>
                            </p>
                          </div>
                        </div>
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
                      key="3"
                    >
                      <div className="general-notifications" style={{ marginBottom: '20px' }}>
                        <h4 style={{ marginBottom: '12px', color: '#1890ff', fontWeight: "bold", fontSize: "20px" }}>
                          Thông báo chung
                        </h4>
                        {notifications.length > 0 ? (
                          notifications.map((notification, index) => (
                            <Alert
                              key={`general-${index}`}
                              message={notification.message}
                              description={
                                <div>
                                  <p>{notification.description}</p>
                                  <small style={{ color: '#666' }}>
                                    Thời gian: {notification.at}
                                  </small>
                                </div>
                              }
                              type={notification.type === "WARNING" ? "warning" : notification.type === "ERROR" ? "error" : "info"}
                              showIcon
                              closable
                              style={{ marginBottom: '8px' }}
                              onClose={() => {
                                setNotifications(prev => prev.filter((_, i) => i !== index));
                              }}
                            />
                          ))
                        ) : (
                          <Alert
                            message="Không có thông báo chung nào"
                            type="info"
                            showIcon={false}
                            style={{ marginBottom: '8px' }}
                          />
                        )}
                      </div>
                    </TabPane>
                  </Tabs>
                </>
              )}
            </Col>
            <Col className="students-wrapper">
              {selectedStudent && parentActiveStudent && (
                <Tag
                  color={
                    parentActiveStudent.current_active_student?.status ===
                      "CHECKED"
                      ? "green"
                      : parentActiveStudent.current_active_student?.status ===
                        "LEAVE"
                        ? "orange"
                        : parentActiveStudent.current_active_student?.status ===
                          "ABSENT"
                          ? "red"
                          : "default"
                  }
                  icon={
                    parentActiveStudent.current_active_student?.status ===
                      "CHECKED" ? (
                      <SmileOutlined />
                    ) : parentActiveStudent.current_active_student?.status ===
                      "LEAVE" ? (
                      <MehOutlined />
                    ) : parentActiveStudent.current_active_student?.status ===
                      "ABSENT" ? (
                      <FrownOutlined />
                    ) : (
                      <LoadingOutlined />
                    )
                  }
                >
                  Học sinh này{" "}
                  {parentActiveStudent.current_active_student?.status ===
                    "CHECKED"
                    ? ActiveStudentStatusValue.checked.toLowerCase()
                    : parentActiveStudent.current_active_student?.status ===
                      "LEAVE"
                      ? ActiveStudentStatusValue.leave.toLowerCase()
                      : parentActiveStudent.current_active_student?.status ===
                        "ABSENT"
                        ? ActiveStudentStatusValue.absent.toLowerCase()
                        : ActiveStudentStatusValue.pending.toLowerCase()}
                </Tag>
              )}
              <List
                itemLayout="horizontal"
                dataSource={parentStudents}
                pagination={
                  parentStudents.length > 10 ? { pageSize: 8 } : undefined
                }
                renderItem={(student: StudentFormatType) => {
                  const isSelected =
                    (selectedStudent as any)?.id === student.id;

                  return (
                    <List.Item
                      onClick={() => handleSelectStudent(student)}
                      className={isSelected ? "active" : ""}
                      actions={
                        selectedStudent && selectedStudent.id === student.id
                          ? [
                            <Button
                              type="primary"
                              danger
                              icon={<CloseOutlined />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectStudent(null);
                              }}
                            />,
                          ]
                          : []
                      }
                    >
                      <List.Item.Meta
                        avatar={<Avatar src={student.avatar} />}
                        title={student.full_name}
                        description={
                          <>
                            <p>Lớp: {student.class?.name}</p>
                            <p>Trạm: {student.pickup?.name}</p>
                            {/* <p>Tuyến đường: </p> */}
                          </>
                        }
                      />
                    </List.Item>
                  );
                }}
              />
            </Col>
          </Row>
        </Card>
      </div >
    </>
  );
};

export default ParentJourneyPage;
