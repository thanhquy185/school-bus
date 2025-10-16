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
  EditOutlined,
  EyeOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import type { PickupType, StudentFormatType } from "../../common/types";
import { ruleRequired } from "../../common/rules";
import type { RcFile } from "antd/es/upload";
import CustomUpload from "../../components/upload";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import LeafletMap from "../../components/leaflet-map";
import { getItemById } from "../../utils/getItemEvents";

type DrawerMode = "view" | "edit" | "pickup" | null;

const ParentStudentPage = () => {
  const pickupData: PickupType[] = [
    {
      id: 1,
      name: "Trường Đại học Sài Gòn",
      category: "Trường học",
      lat: 10.75960314081626,
      lng: 106.68201506137848,
      status: "Hoạt động",
    },
    {
      id: 2,
      name: "Trạm Công viên Lê Thị Riêng",
      category: "Điểm đưa đón",
      lat: 10.786197005344277,
      lng: 106.66577696800232,
      status: "Tạm dừng",
    },
    {
      id: 3,
      name: "Trạm Ngã 3 Tô Hiến Thành",
      category: "Điểm đưa đón",
      lat: 10.782542301538852,
      lng: 106.67269945487907,
      status: "Hoạt động",
    },
    {
      id: 4,
      name: "Trạm Vòng xoay Dân Chủ",
      category: "Điểm đưa đón",
      lat: 10.778231651587179,
      lng: 106.68071896686253,
      status: "Hoạt động",
    },
    {
      id: 5,
      name: "Trạm Nhà hát Hoà Bình",
      category: "Điểm đưa đón",
      lat: 10.771691782379415,
      lng: 106.67420637069971,
      status: "Hoạt động",
    },
    {
      id: 6,
      name: "Trạm Vòng xoay Lý Thái Tổ",
      category: "Điểm đưa đón",
      lat: 10.767212337954136,
      lng: 106.67562797183044,
      status: "Hoạt động",
    },
    {
      id: 7,
      name: "Trạm Vòng xoay Cộng Hoà",
      category: "Điểm đưa đón",
      lat: 10.764561529473132,
      lng: 106.6818913125902,
      status: "Hoạt động",
    },
  ];
  const students: StudentFormatType[] = [
    {
      id: "1",
      pickup: {
        id: 5,
        name: "Trạm Nhà hát Hoà Bình",
        category: "Điểm đưa đón",
        lat: 10.771691782379415,
        lng: 106.67420637069971,
        status: "Hoạt động",
      },
      class: {
        id: 1,
        name: "Lớp 10A1",
      },
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=1",
      fullname: "Nguyễn Văn A",
      birthday: "2014-05-12",
      gender: "Nam",
    },
    {
      id: "2",
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
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=2",
      fullname: "Trần Thị B",
      birthday: "2015-02-20",
      gender: "Nữ",
    },
  ];

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
      ? `Chi tiết thông tin ${selectedStudent?.fullname}`
      : drawerMode === "edit"
      ? `Cập nhật thông tin ${selectedStudent?.fullname}`
      : drawerMode === "pickup"
      ? `Cập nhật trạm xe buýt ${selectedStudent?.fullname}`
      : "";

  // Form
  const [form] = Form.useForm<StudentFormatType>();
  const [imageFile, setImageFile] = useState<RcFile>();
  const [pickupValue, setPickupValue] = useState<PickupType>();
  useEffect(() => {
    form.setFieldValue("avatar", imageFile?.name);
  }, [imageFile]);
  useEffect(() => {
    form.setFieldValue("id", selectedStudent?.id || undefined);
    form.setFieldValue("pickup", selectedStudent?.pickup?.id || undefined);
    form.setFieldValue("class", selectedStudent?.class?.id || undefined);
    form.setFieldValue("avatar", selectedStudent?.avatar || undefined);
    form.setFieldValue("fullname", selectedStudent?.fullname || undefined);
    form.setFieldValue("birthday", selectedStudent?.birthday || undefined);
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
                  color="orange"
                  icon={<EditOutlined />}
                  onClick={() => openDrawerWithMode("edit", student)}
                >
                  Cập nhật thông tin
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
                title={<strong>{student.fullname}</strong>}
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
            initialValues={{ pickup: selectedStudent?.pickup?.id }}
            onFinish={() => {}}
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
                onFinish={() => {}}
                disabled={drawerMode === "view"}
              >
                <Form.Item
                  name="avatar"
                  htmlFor="avatar"
                  label="Ảnh đại diện"
                  valuePropName="fileList"
                  rules={
                    drawerMode === "edit"
                      ? [ruleRequired("Ảnh đại diện không được để trống !")]
                      : []
                  }
                >
                  <CustomUpload
                    // defaultSrc={
                    //   selectedStudent?.avatar
                    //     ? selectedStudent?.avatar
                    //     : "no-image.png"
                    // }
                    imageFile={imageFile}
                    setImageFile={setImageFile}
                    alt="image-preview"
                    htmlFor="avatar"
                    imageClassName="image-preview"
                    imageCategoryName="students"
                    uploadClassName="image-uploader"
                    labelButton="Tải ảnh lên"
                    disabled={drawerMode === "view"}
                  />
                </Form.Item>
                <Form.Item
                  name="fullname"
                  htmlFor="fullname"
                  label="Họ và tên"
                  rules={
                    drawerMode === "edit"
                      ? [ruleRequired("Họ và tên không được để trống !")]
                      : []
                  }
                >
                  <Input id="fullname" placeholder="Nhập Họ và tên" />
                </Form.Item>
                <Form.Item
                  name="birthday"
                  htmlFor="birthday"
                  label="Ngày sinh"
                  rules={
                    drawerMode === "edit"
                      ? [ruleRequired("Ngày sinh không được để trống")]
                      : []
                  }
                >
                  <Input id="birthday" placeholder="YYYY-MM-DD" />
                </Form.Item>
                <Form.Item
                  name="gender"
                  htmlFor="gender"
                  label="Giới tính"
                  rules={
                    drawerMode === "edit"
                      ? [ruleRequired("Giới tính không được để trống")]
                      : []
                  }
                >
                  <Select
                    id="gender"
                    placeholder="Chọn Giới tính"
                    options={[
                      { value: "Nam", label: "Nam" },
                      { value: "Nữ", label: "Nữ" },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  name="class"
                  htmlFor="class"
                  label="Lớp"
                  rules={
                    drawerMode === "edit"
                      ? [ruleRequired("Lớp không được để trống !")]
                      : []
                  }
                >
                  <Select
                    allowClear
                    id="class"
                    options={[
                      {
                        label: "#1 - Lớp 10A1",
                        value: 1,
                      },
                      {
                        label: "#2 - Lớp 10A2",
                        value: 2,
                      },
                    ]}
                    placeholder="Chọn Lớp"
                  />
                </Form.Item>
                {drawerMode === "edit" && (
                  <div className="buttons">
                    <Button type="primary" htmlType="submit">
                      Lưu thay đổi
                    </Button>
                    <Button onClick={handleCloseDrawer}>Hủy</Button>
                  </div>
                )}
              </Form>
            </div>
          )
        )}
      </Drawer>
    </div>
  );
};

export default ParentStudentPage;
