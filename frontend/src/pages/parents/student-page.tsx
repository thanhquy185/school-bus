import { useEffect, useState } from "react";
import {
  List,
  Avatar,
  Card,
  Button,
  Tag,
  Drawer,
  Form,
  Select,
} from "antd";
import {
  EyeOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import type { PickupType, StudentFormatType } from "../../common/types";
import { ruleRequired } from "../../common/rules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import LeafletMap from "../../components/leaflet-map";
import { getItemById } from "../../utils/getItemEvents";
import type { StudentResponse } from "../../responses/student.response";
import useCallApi from "../../api/useCall";
import { getPickups, getStudents, updateStudent } from "../../services/parent-service";
import { getGenderText, getPickupCategoryName } from "../../utils/vi-trans";
import type { PickupResponse } from "../../responses/pickup.response";

type DrawerMode = "view" | "pickup" | null;

const ParentStudentPage = () => {
  const { execute, notify } = useCallApi();

  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [pickups, setPickups] = useState<PickupResponse[]>([]);

  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>(null);
  const [selectedStudent, setSelectedStudent] =
    useState<StudentResponse | null>(null);
  const openDrawerWithMode = (mode: DrawerMode, student: StudentResponse) => {
    setSelectedStudent(student);
    setDrawerMode(mode);
    setOpenDrawer(true);
  };

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
    setSelectedStudent(null);
    setDrawerMode(null);
  };

  const drawerTitle =
    drawerMode === "view"
      ? `Chi tiết thông tin ${selectedStudent?.full_name}`
      : drawerMode === "pickup"
          ? `Cập nhật trạm xe buýt ${selectedStudent?.full_name}`
          : "";

  const [form] = Form.useForm<StudentFormatType>();
  const [pickupValue, setPickupValue] = useState<PickupType>();

  useEffect(() => {
    form.setFieldValue("id", selectedStudent?.id || undefined);
    form.setFieldValue("pickup", selectedStudent?.pickup?.id || undefined);
    form.setFieldValue("class", selectedStudent?.class?.id || undefined);
    form.setFieldValue("avatar", selectedStudent?.avatar || undefined);
    form.setFieldValue("full_name", selectedStudent?.full_name || undefined);
    form.setFieldValue("birth_date", selectedStudent?.birth_date || undefined);
    form.setFieldValue("gender", selectedStudent?.gender || undefined);
    setPickupValue(selectedStudent?.pickup);
  }, [selectedStudent]);

  const handleGetData = async () => {
    const [studentRes, pickupRes] = await Promise.all([
      execute(getStudents()),
      execute(getPickups())
    ]);

    if (studentRes?.data) {
      setStudents(studentRes.data);
    }

    if (pickupRes?.data) {
      setPickups(pickupRes.data);
    }
  }

  const handleChangePickup = async () => {
      if (selectedStudent) {
        const restResponse = await execute(updateStudent(selectedStudent.id, { pickupId: form.getFieldValue("pickup")}));
        notify(restResponse, "Cập nhật vi trí đón học sinh thành công");
        if (restResponse?.result) {
          handleGetData();
          handleCloseDrawer();
        }
      }
  }

  useEffect(() => {
    handleGetData();
  }, []);

  return (
    <div className="client-layout__main parent">
      <h2 className="client-layout__title">
        <span>
          <FontAwesomeIcon icon={faGraduationCap} />
          <strong>Học sinh</strong>
        </span>
      </h2>

      <Card title="Danh sách học sinh" className="client-layout__students">
        <List
          itemLayout="horizontal"
          dataSource={students}
          pagination={{ pageSize: 5 }}
          renderItem={(student) => (
            <List.Item
              key={student.id}
              actions={[
                <Button
                  variant="solid"
                  color="blue"
                  icon={<EyeOutlined />}
                  onClick={() => openDrawerWithMode("view", student)}
                >
                  Chi tiết thông tin
                </Button>,

                <Button
                  variant="solid"
                  color="green"
                  icon={<EnvironmentOutlined />}
                  onClick={() => openDrawerWithMode("pickup", student)}
                >
                  Cập nhật trạm xe buýt
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={student.avatar} size={50} />}
                title={<strong>{student.full_name}</strong>}
                description={
                  <>
                    <div>
                      Giới tính:{" "}
                      <Tag
                        color={student.gender === "MALE" ? "blue" : "magenta"}
                      >
                        {getGenderText(student.gender)}
                      </Tag>
                    </div>
                    <div>Lớp: {student.class?.name}</div>
                    <div>Trạm: {student.pickup?.name}</div>
                  </>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      <Drawer
        title={drawerTitle}
        placement="right"
        width={500}
        onClose={handleCloseDrawer}
        open={openDrawer}
        className="drawer--default"
      >
        {drawerMode === "pickup" ? (
          <Form
            form={form}
            layout="vertical"
            initialValues={{ pickup: selectedStudent?.pickup?.id }}
            onFinish={handleChangePickup}
          >
            <Form.Item>
              <LeafletMap
                id={"map-" + pickupValue?.id}
                pointType={pickupValue?.category}
                lat={pickupValue?.lat}
                lng={pickupValue?.lng}
                type="detail"
              />
            </Form.Item>
            <Form.Item
              name="pickup"
              htmlFor="pickup"
              label="Trạm xe buýt"
              rules={[ruleRequired("Trạm xe buýt không được để trống !")]}
            >
              <Select
                allowClear
                showSearch
                id="pickup"
                placeholder="Chọn Trạm xe buýt"
                options={pickups?.map((pickup) => ({
                  label:
                    "#" +
                    pickup?.id +
                    " - " +
                    pickup?.name +
                    " - " +
                    getPickupCategoryName(pickup?.category),
                  value: pickup?.id,
                }))}
                onChange={(val: number) =>
                  setPickupValue(getItemById(pickups, val))
                }
              />
            </Form.Item>

            <div className="buttons">
              <Button type="primary" htmlType="submit">
                Lưu thay đổi
              </Button>
              <Button onClick={handleCloseDrawer}>Hủy</Button>
            </div>
          </Form>
        ) : (
          selectedStudent && (
            <div className="parent-content">
              <div className="student-info">
                <img 
                  src={selectedStudent?.avatar || "no-image.png"} 
                  alt="Ảnh đại diện"
                  className="student-avatar"
                />
                <div className="info-item">
                  <strong>Họ và tên:</strong> {selectedStudent?.full_name}
                </div>
                <div className="info-item">
                  <strong>Ngày sinh:</strong> {selectedStudent?.birth_date}
                </div>
                <div className="info-item">
                  <strong>Giới tính:</strong> {getGenderText(selectedStudent?.gender)}
                </div>
                <div className="info-item">
                  <strong>Lớp:</strong> {selectedStudent?.class?.name}
                </div>
              </div>
            </div>
          )
        )}
      </Drawer>
    </div>
  );
};

export default ParentStudentPage;
