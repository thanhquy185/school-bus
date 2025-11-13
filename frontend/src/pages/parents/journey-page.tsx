import { Card, Tabs, List, Avatar, Button, Row, Col, Tag } from "antd";
import {
  InfoCircleOutlined,
  BellOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faMapLocationDot,
  faPlusCircle,
  faWarning,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import LeafletMap from "../../components/leaflet-map";
import { useState } from "react";
import type { ActiveFormatType } from "../../common/types";

const { TabPane } = Tabs;

//
const ParentJourneyPage = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleSelectStudent = (student: any) => {
    // Nếu chọn lại cùng học sinh -> bỏ chọn
    setSelectedStudent((prev: any) =>
      prev && prev.id === student.id ? null : student
    );
  };

  const students = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      avatar: "https://i.pravatar.cc/100?img=3",
    },
    {
      id: 2,
      name: "Trần Thị B",
      avatar: "https://i.pravatar.cc/100?img=5",
    },
    {
      id: 3,
      name: "Lê Văn C",
      avatar: "https://i.pravatar.cc/100?img=7",
    },
  ];

  // State giữ đối tượng được chọn hiện tại
  const [currentSelectedItem, setCurrentSelectedItem] =
    useState<ActiveFormatType | null>(null);

  return (
    <>
      <div className="client-layout__main">
        <h2 className="client-layout__title">
          <span>
            <FontAwesomeIcon icon={faMapLocationDot} />
            <strong>Hành trình đưa đón</strong>
          </span>
        </h2>
        <Card className="client-layout__journey parent" title="Thông tin hành trình đưa đón">
          <Row className="row">
            <Col className="tabs-wrapper">
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
                  <LeafletMap id="map-parent" type="detail" />
                </TabPane>
                <TabPane
                  tab={
                    <>
                      <span>
                        <InfoCircleOutlined />
                      </span>
                      <span>Thông tin tuyến</span>
                    </>
                  }
                  key="2"
                >
                  <div className="route-infos"></div>
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
                          Xe buýt khởi hành từ Công viên Lê Thị Riêng lúc 7:00
                          AM
                        </p>
                      </Tag>
                      <Tag color="orange" className="notification-tag">
                        <p className="title">
                          <img
                            src="/src/assets/images/others/parent-warning-image.png"
                            alt=""
                          />
                          <span>Xe buýt Tuyến 01 thay đổi tuyến đường</span>
                        </p>
                        <p className="description">
                          Xe buýt thay đổi đường đi do sự cố giao thông lúc 7:08
                          AM
                        </p>
                      </Tag>
                      <Tag color="green" className="notification-tag">
                        <p className="title">
                          <img
                            src="/src/assets/images/others/parent-success-image.png"
                            alt=""
                          />
                          <span>Xe buýt Tuyến 01 đã đến trạm</span>
                        </p>
                        <p className="description">
                          Xe buýt đã đến Ngã 3 Hoà Hưng lúc 7:20 AM
                        </p>
                      </Tag>
                      <Tag color="red" className="notification-tag">
                        <p className="title">
                          <img
                            src="/src/assets/images/others/parent-error-image.png"
                            alt=""
                          />
                          <span>Xe buýt Tuyến 01 huỷ đến trạm</span>
                        </p>
                        <p className="description">
                          Xe buýt huỷ đến trạm Vòng xoay Lý Thái Tổ
                        </p>
                      </Tag>
                    </div>
                  </div>
                </TabPane>
              </Tabs>
            </Col>
            <Col className="students-wrapper">
              <List
                itemLayout="horizontal"
                dataSource={students}
                pagination={students.length > 10 ? { pageSize: 8 } : undefined}
                renderItem={(student: any) => {
                  const isSelected =
                    (selectedStudent as any)?.id === student.id;
                  return (
                    <List.Item
                      onClick={() => handleSelectStudent(student)}
                      className={isSelected ? "active" : ""}
                    >
                      <List.Item.Meta
                        avatar={<Avatar src={student.avatar} />}
                        title={student.name}
                        description={
                          <>
                            <p>Lớp abc de</p>
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
      </div>
    </>
  );
};

export default ParentJourneyPage;
