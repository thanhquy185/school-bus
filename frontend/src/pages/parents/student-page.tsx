import React, { useEffect, useState } from "react";
import {
  List,
  Avatar,
  Card,
  Button,
  Tag,
  Drawer,
  Form,
  Input,
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
import useCallApi from "../../api/useCall";
import { getStudents } from "../../services/parent-service";
import type { StudentResponse } from "../../responses/student.response";
import { getPickups } from "../../services/pickup-service";
import { getGenderText } from "../../utils/vi-trans";

type DrawerMode = "view" | "pickup" | null;

const ParentStudentPage = () => {
  const { execute } = useCallApi();

  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [pickupData, setPickupData] = useState<PickupType[]>([]);

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

  const handleGetData = async () => {
    const studentRes = await execute(getStudents(), false);
    if (studentRes?.result) {
      setStudents(studentRes.data);
    }

    const pickupRes = await execute(getPickups(), false);
    if (pickupRes?.result) {
      setPickupData(pickupRes.data);
    } 
  }

  useEffect(() => {
    handleGetData();
  }, []);

  // Tạo tiêu đề động cho Drawer
  const drawerTitle =
    drawerMode === "view"
      ? `Chi tiết thông tin ${selectedStudent?.full_name}`
        : drawerMode === "pickup"
          ? `Cập nhật trạm xe buýt ${selectedStudent?.full_name}`
          : "";

  // Form
  const [form] = Form.useForm<StudentFormatType>();
  const [pickupValue, setPickupValue] = useState<PickupType>();
  useEffect(() => {
    form.setFieldValue("id", selectedStudent?.id || undefined);
    form.setFieldValue("pickup", selectedStudent?.pickup?.id || undefined);
    form.setFieldValue("class", selectedStudent?.class?.name || undefined);
    form.setFieldValue("avatar", selectedStudent?.avatar || undefined);
    form.setFieldValue("full_name", selectedStudent?.full_name || undefined);
    form.setFieldValue("birth_date", selectedStudent?.birth_date || undefined);
    form.setFieldValue("gender", selectedStudent?.gender || undefined);
    setPickupValue(selectedStudent?.pickup);
  }, [selectedStudent]);

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
            onFinish={() => { }}
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
                  setPickupValue(getItemById(pickupData, val))
                }
              />
            </Form.Item>
            {/* <Form.Item label="Ghi chú" name="note">
              <Input.TextArea placeholder="Ghi chú thêm..." />
            </Form.Item> */}
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
              <Form
                form={form}
                layout="vertical"
                onFinish={() => { }}
                disabled={drawerMode === "view"}
              >
                <Form.Item
                >
                  <div style={{ textAlign: 'center' }}>
                    <Avatar 
                      src={selectedStudent?.avatar} 
                      size={150} 
                      alt={selectedStudent?.full_name}
                      style={{ border: '2px solid #d9d9d9' }}
                    />
                  </div>
                </Form.Item>
                <Form.Item
                  name="full_name"
                  htmlFor="fullname"
                  label="Họ và tên"
                >
                  <Input id="full_name" placeholder="Nhập Họ và tên" />
                </Form.Item>
                <Form.Item
                  name="birth_date"
                  htmlFor="birthday"
                  label="Ngày sinh"
                >
                  <Input id="birthday" placeholder="YYYY-MM-DD" />
                </Form.Item>
                <Form.Item
                  name="gender"
                  htmlFor="gender"
                  label="Giới tính"
                >
                  <Select
                    id="gender"
                    placeholder="Chọn Giới tính"
                    options={[
                      { value: "MALE", label: "Nam" },
                      { value: "FEMALE", label: "Nữ" },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  name="class"
                  htmlFor="class"
                  label="Lớp"
                >
                  <Input id="class" placeholder="Lớp" />
                </Form.Item>
              </Form>
            </div>
          )
        )}
      </Drawer>
    </div>
  );
};

export default ParentStudentPage;
