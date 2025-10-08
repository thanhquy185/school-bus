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
import type { StudentFormatType } from "../../common/types";
import { ruleRequired } from "../../common/rules";
import type { RcFile } from "antd/es/upload";
import CustomUpload from "../../components/upload";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons";

type DrawerMode = "view" | "edit" | "bus" | null;

const ParentStudentPage = () => {
  const students: StudentFormatType[] = [
    {
      id: "1",
      pickup: {
        id: 1,
        name: "Trạm xe buýt 1",
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
        id: 2,
        name: "Trạm xe buýt 2",
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
      : drawerMode === "bus"
      ? `Cập nhật trạm xe buýt ${selectedStudent?.fullname}`
      : "";

  // Form
  const [form] = Form.useForm<StudentFormatType>();
  const [imageFile, setImageFile] = useState<RcFile>();
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
                  onClick={() => openDrawerWithMode("bus", student)}
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
                    {/* <div>Mã học sinh: #{student.id}</div>
                    <div>Ngày sinh: {student.birthday}</div> */}
                    <div>
                      Giới tính:{" "}
                      <Tag
                        color={student.gender === "Nam" ? "blue" : "magenta"}
                      >
                        {student.gender}
                      </Tag>
                    </div>
                    <div>Lớp: {student.class?.name}</div>
                    <div>Trạm: Trạm abc - 123</div>
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
        {drawerMode === "bus" ? (
          <Form form={form} layout="vertical" onFinish={() => {}}>
            <Form.Item>
              <div style={{ height: 300, background: "#ccc" }}></div>
            </Form.Item>
            <Form.Item
              name="pickup"
              htmlFor="pickup"
              label="Trạm xe buýt"
              rules={[ruleRequired("Trạm xe buýt không được để trống !")]}
            >
              <Select
                id="pickup"
                placeholder="Chọn Trạm xe buýt"
                options={[
                  { label: "Trạm Nguyễn Văn Cừ", value: 1 },
                  { label: "Trạm Lê Văn Sỹ", value: 2 },
                  { label: "Trạm Điện Biên Phủ", value: 3 },
                ]}
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
