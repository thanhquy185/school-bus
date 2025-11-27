import { useEffect, useState } from "react";
import {
  List,
  Avatar,
  Card,
  Button,
  Tag,
  Drawer,
  Form,
  Input,
} from "antd";
import {
  EyeOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import type { StudentFormatType } from "../../common/types";
import CustomUpload from "../../components/upload";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import LeafletMap from "../../components/leaflet-map";
import { getStudents } from "../../services/parent-service";
import useCallApi from "../../api/useCall";
import {
  CommonGenderValue,
  PointTypeValue,
  StudentStatusValue,
} from "../../common/values";

type DrawerMode = "view" | "pickup" | null;

const ParentStudentPage = () => {
  const { execute, notify, loading } = useCallApi();

  // Dữ liệu học sinh mà phụ huynh có quản lý
  const [students, setStudents] = useState<StudentFormatType[]>([]);
  const getStudentsByParent = async () => {
    const restResponse = await execute(getStudents(), false);
    if (restResponse?.result) {
      setStudents(
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

  // Drawer
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>(null);
  const [selectedStudent, setSelectedStudent] =
    useState<StudentFormatType | null>(null);
  const openDrawerWithMode = (mode: DrawerMode, student: StudentFormatType) => {
    setSelectedStudent(student);
    setDrawerMode(mode);
    setOpenDrawer(true);
  };
  const handleCloseDrawer = () => {
    setOpenDrawer(false);
    setSelectedStudent(null);
    setDrawerMode(null);
  };

  // Tạo tiêu đề động cho Drawer
  const drawerTitle =
    drawerMode === "view"
      ? `Thông tin cá nhân ${selectedStudent?.full_name}`
      : drawerMode === "pickup"
      ? `Thông tin trạm xe buýt ${selectedStudent?.full_name}`
      : "";

  // Form
  const [form] = Form.useForm<StudentFormatType>();

  return (
    <div className="client-layout__main parent">
      <h2 className="client-layout__title">
        <span>
          <FontAwesomeIcon icon={faGraduationCap} />
          <strong>Học sinh</strong>
        </span>
      </h2>
      <Card title="Thông tin học sinh" className="client-layout__students">
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
                  Thông tin cá nhân
                </Button>,
                <Button
                  variant="solid"
                  color="green"
                  icon={<EnvironmentOutlined />}
                  onClick={() => openDrawerWithMode("pickup", student)}
                >
                  Thông tin trạm xe buýt
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
                        color={student.gender === "Nam" ? "blue" : "magenta"}
                      >
                        {student.gender}
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
            initialValues={{
              name: selectedStudent?.pickup?.name,
              category: selectedStudent?.pickup?.category,
              lat: selectedStudent?.pickup?.lat,
              lng: selectedStudent?.pickup?.lng,
            }}
            disabled={true}
          >
            <Form.Item className="margin-bottom-0">
              <LeafletMap
                id={"map-" + selectedStudent?.pickup?.id}
                pointType={selectedStudent?.pickup?.category}
                lat={selectedStudent?.pickup?.lat}
                lng={selectedStudent?.pickup?.lng}
                type="detail"
              />
            </Form.Item>
            <Form.Item
              name="name"
              htmlFor="name"
              label="Tên trạm"
              style={{ marginTop: 16 }}
            >
              <Input id="name" />
            </Form.Item>
            {/* <Form.Item name="category" htmlFor="category" label="Loại trạm">
              <Input id="category" />
            </Form.Item>
            <Form.Item name="lat" htmlFor="lat" label="Toạ độ x">
              <Input id="lat" />
            </Form.Item>
            <Form.Item
              name="lng"
              htmlFor="lng"
              label="Toạ độ y"
              className="margin-bottom-0"
            >
              <Input id="lng" />
            </Form.Item> */}
          </Form>
        ) : (
          selectedStudent && (
            <div className="parent-content">
              <Form
                form={form}
                layout="vertical"
                initialValues={{
                  id: selectedStudent?.id,
                  full_name: selectedStudent?.full_name,
                  birth_date: selectedStudent?.birth_date,
                  gender: selectedStudent?.gender,
                  class: selectedStudent?.class?.name,
                }}
                disabled={drawerMode === "view"}
              >
                <Form.Item
                  name="avatar"
                  htmlFor="avatar"
                  label="Ảnh đại diện"
                  valuePropName="fileList"
                >
                  <CustomUpload
                    defaultSrc={
                      selectedStudent?.avatar
                        ? selectedStudent?.avatar
                        : "no-image.png"
                    }
                    alt="image-preview"
                    htmlFor="avatar"
                    imageClassName="image-preview"
                    imageCategoryName="students"
                    uploadClassName="image-uploader"
                    labelButton="Không thể cập nhật ảnh"
                    disabled={drawerMode === "view"}
                    buttonHidden={true}
                  />
                </Form.Item>
                <Form.Item
                  name="full_name"
                  htmlFor="full_name"
                  label="Họ và tên"
                >
                  <Input id="full_name" />
                </Form.Item>
                <Form.Item
                  name="birth_date"
                  htmlFor="birthday"
                  label="Ngày sinh"
                >
                  <Input id="birthday" />
                </Form.Item>
                <Form.Item name="gender" htmlFor="gender" label="Giới tính">
                  <Input id="gender" />
                </Form.Item>
                <Form.Item name="class" htmlFor="class" label="Lớp">
                  <Input allowClear id="class" />
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
