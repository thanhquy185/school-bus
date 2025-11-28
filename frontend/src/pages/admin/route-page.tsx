import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Breadcrumb,
  Card,
  Input,
  Button,
  Select,
  Tag,
  Form,
  Col,
  Row,
  Alert,
} from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faList,
  faLock,
  faLockOpen,
  faMap,
  faPenToSquare,
  faPlus,
  faUserGraduate,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import type { ColumnsType } from "antd/es/table";
import type {
  BreadcrumbItemType,
  BreadcrumbSeparatorType,
} from "antd/es/breadcrumb/Breadcrumb";
import { CommonStatusValue } from "../../common/values";
import type {
  RouteFormatType,
  RouteDetailsFormatType,
  PickupType,
} from "../../common/types";
import LeafletMap, {
  type HandleGetRouteInfoProps,
} from "../../components/leaflet-map";
import CustomTableActions from "../../components/table-actions";

import useCallApi from "../../api/useCall";
import { getPickupsActive } from "../../services/pickup-service";
import { getRoutes } from "../../services/route-service";

import { DndContext, closestCenter } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import SortableItem from "../../components/SortableItem";
import Swal from "sweetalert2";
import L from "leaflet";
import {
  createRoute,
  // getRoutes,
  updateRoute,
} from "../../services/route-service";

interface RouteFormProps {
  mode: "detail" | "create" | "update";
  route?: RouteFormatType;
  pickups?: PickupType[];
  onSubmit?: (routeData: any) => void;
}

const RouteForm: React.FC<RouteFormProps> = ({ mode, route, pickups = [] }) => {
  const { t } = useTranslation();

  // Call API
  const { execute, loading, notify } = useCallApi();

  // States
  const [routes, setRoutes] = useState<RouteFormatType[]>([]);
  const [pickupList, setPickupList] = useState<PickupType[]>(pickups);
  const [routeDetailsValue, setRouteDetailsValue] = useState<
    RouteDetailsFormatType[]
  >([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [currentSelectedItem, setCurrentSelectedItem] =
    useState<RouteFormatType>();
  const [currentAction, setCurrentAction] = useState<string>("list");

  const [currentBreadcrumbItems, setCurrentBreadcrumbItems] = useState<
    Partial<BreadcrumbItemType & BreadcrumbSeparatorType>[]
  >([]);
  const [currentCardTitle, setCurrentCardTitle] = useState<string>(
    t("route-list")
  );
  const [currentCardContent, setCurrentCardContent] = useState<string>("list");

  const [form] = Form.useForm();

  // Refs
  const mapRef = useRef<L.Map | null>(null);
  const routeLinesRef = useRef<L.Polyline[]>([]);

  // Fetch pickups
  const getPickupData = async () => {
    try {
      const response = await execute(getPickupsActive(), false);
      if (response?.result && Array.isArray(response.data)) {
        const pickups = response.data.map((pickup) => ({
          ...pickup,
          category:
            pickup.category === "SCHOOL" ? "Trường học" : "Điểm đưa đón",
          status: pickup.status === "ACTIVE" ? "Hoạt động" : "Tạm dừng",
        }));
        setPickupList(pickups);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch routes
  const getRouteData = async () => {
    try {
      const response = await execute(getRoutes(), false);
      if (response?.result && Array.isArray(response.data)) {
        setRoutes(
          response.data.map((route) => ({
            ...route,
            status: route.status === "ACTIVE" ? "Hoạt động" : "Tạm dừng",
            routeDetails: route?.pickups?.map(
              (p: { pickup: PickupType; order: number }) => ({
                pickup: {
                  ...p.pickup,
                  category:
                    p.pickup.category === "SCHOOL"
                      ? "Trường học"
                      : "Điểm đưa đón",
                  status:
                    p.pickup.status === "ACTIVE" ? "Hoạt động" : "Tạm dừng",
                },
                order: p.order,
              })
            ),
          }))
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPickupData();
    getRouteData();
  }, []);

  // Filtered list
  const filteredRouteList = routes.filter((r) => {
    const matchesName = r.name
      ?.toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesStatus = statusFilter ? r.status === statusFilter : true;
    return matchesName && matchesStatus;
  });

  useEffect(() => {
    if (route?.routePickups) {
      setRouteDetailsValue(route.routePickups);
      handleGetRouteInfo;
    }
  }, [route]);

  useEffect(() => {
    if (
      (currentAction === "update" || currentAction === "detail") &&
      currentSelectedItem
    ) {
      setRouteDetailsValue(currentSelectedItem.routePickups || []);
      // set form fields so Form shows selectedRoute values
      form.setFieldsValue({
        name: currentSelectedItem.name,
        status: currentSelectedItem.status,
        total_distance: currentSelectedItem.total_distance,
        total_time: currentSelectedItem.total_time,
        start_pickup: currentSelectedItem.start_pickup,
        end_pickup: currentSelectedItem.end_pickup,
      });
    }
  }, [currentAction, currentSelectedItem]);

  useEffect(() => {
    setRouteDetailsValue(route?.routePickups || []);
  }, [route]);
  // Breadcrumb + card content
  useEffect(() => {
    const baseBreadcrumb = [
      {
        title: (
          <span onClick={() => setCurrentAction("list")}>
            <FontAwesomeIcon icon={faUserGraduate} />
            &nbsp;{t("route-manager")}
          </span>
        ),
      },
      {
        title: (
          <span onClick={() => setCurrentAction("list")}>
            {t("route-list")}
          </span>
        ),
      },
    ];

    switch (currentAction) {
      case "list":
        setCurrentBreadcrumbItems(baseBreadcrumb);
        setCurrentCardTitle(t("route-list"));
        setCurrentCardContent("list");
        break;
      case "detail":
        setCurrentBreadcrumbItems([
          ...baseBreadcrumb,
          { title: <span>{t("route-detail")}</span> },
        ]);
        setCurrentCardTitle(t("route-detail"));
        setCurrentCardContent("detail");
        break;
      case "create":
        setCurrentBreadcrumbItems([
          ...baseBreadcrumb,
          { title: <span>{t("route-create")}</span> },
        ]);
        setCurrentCardTitle(t("route-create"));
        setCurrentCardContent("create");
        break;
      case "update":
        setCurrentBreadcrumbItems([
          ...baseBreadcrumb,
          { title: <span>{t("route-update")}</span> },
        ]);
        setCurrentCardTitle(t("route-update"));
        setCurrentCardContent("update");
        break;
      case "lock":
        setCurrentBreadcrumbItems([
          ...baseBreadcrumb,
          { title: <span>{t("route-lock")}</span> },
        ]);
        setCurrentCardTitle(t("route-lock"));
        setCurrentCardContent("lock");
        break;
      case "unlock":
        console.log("Setting breadcrumb and card content for unlock");
        setCurrentBreadcrumbItems([
          ...baseBreadcrumb,
          { title: <span>{t("route-unlock")}</span> },
        ]);
        setCurrentCardTitle(t("route-unlock"));
        setCurrentCardContent("unlock");
        break;
    }
  }, [currentAction]);

  // Handlers
  const handleGetRouteInfo = ({
    distance,
    duration,
  }: HandleGetRouteInfoProps) => {
    if (distance !== undefined) form.setFieldValue("total_distance", distance);
    if (duration !== undefined) form.setFieldValue("total_time", duration);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const oldIndex = routeDetailsValue.findIndex(
      (r) => r.pickup?.id === active.id
    );
    const newIndex = routeDetailsValue.findIndex(
      (r) => r.pickup?.id === over.id
    );
    if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return;

    setRouteDetailsValue(
      arrayMove(routeDetailsValue, oldIndex, newIndex).map((item, index) => ({
        ...item,
        order: index + 1,
      }))
    );
  };

  const drawRoutePolyline = (routeDetails: RouteDetailsFormatType[]) => {
    if (!mapRef.current) return;
    routeLinesRef.current.forEach((line) => mapRef.current?.removeLayer(line));
    routeLinesRef.current = [];

    if (routeDetails.length < 2) return;

    const latlngs: L.LatLngTuple[] = routeDetails
      .filter((r) => r.pickup?.lat != null && r.pickup?.lng != null)
      .map((r) => [r.pickup!.lat!, r.pickup!.lng!] as L.LatLngTuple);

    if (latlngs.length > 1) {
      const polyline = L.polyline(latlngs, { color: "blue", weight: 4 });
      polyline.addTo(mapRef.current);
      routeLinesRef.current.push(polyline);
    }
  };

  const handleMarkerClick = (pickup: PickupType) => {
    if (mode === "detail") return;

    setRouteDetailsValue((prev) => {
      if (prev.some((r) => r.pickup?.id === pickup.id)) return prev;

      const newRouteDetail = { pickup, order: prev.length + 1 };
      const newRouteDetails = [...prev, newRouteDetail];

      drawRoutePolyline(newRouteDetails);

      Swal.fire({
        icon: "success",
        title: "Trạm đã chọn",
        html: `<b>${pickup.name}</b> đã thêm vào tuyến`,
        confirmButtonColor: "#0078ff",
      });

      return newRouteDetails;
    });
  };

  const handleSubmit = async () => {
    console.log("Creating route with routeDetailsValue:", routeDetailsValue);
    if (!routeDetailsValue.length) {
      Swal.fire({
        icon: "warning",
        title: "Chưa có trạm nào được chọn",
      });
      return;
    }

    try {
      const statusValue =
        form.getFieldValue("status") === "Hoạt động" ? "ACTIVE" : "INACTIVE";

      const firstPickupName = String(routeDetailsValue[0]?.pickup?.id);
      const lastPickupName = String(
        routeDetailsValue[routeDetailsValue.length - 1]?.pickup?.id
      );

      const routePayload = {
        name: form.getFieldValue("name") || undefined,
        start_pickup:
          form.getFieldValue("start_pickup") || firstPickupName || undefined,
        end_pickup:
          form.getFieldValue("end_pickup") || lastPickupName || undefined,
        total_distance: Math.round(
          Number(form.getFieldValue("total_distance") || 0)
        ),
        total_time: Math.round(Number(form.getFieldValue("total_time") || 0)),
        status: statusValue as "ACTIVE" | "INACTIVE",
        route_pickups: routeDetailsValue.map((routeDetail) => ({
          pickup_id: routeDetail.pickup?.id!,
          order: routeDetail.order!,
        })),
      };

      const restResponse = await execute(createRoute(routePayload), true);

      if (restResponse?.result) {
        getRouteData(); // Reload danh sách tuyến
        setCurrentAction("list"); // Quay về list
        Swal.fire({
          icon: "success",
          title: "Tạo tuyến thành công",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Có lỗi xảy ra khi tạo tuyến",
      });
    }
  };

  // Table columns
  const handleUpdateSubmit = async () => {
    console.log("Updating route with routeDetailsValue:", routeDetailsValue);
    if (!routeDetailsValue.length) {
      Swal.fire({
        icon: "warning",
        title: "Chưa có trạm nào được chọn",
      });
      return;
    }

    try {
      const statusValue =
        form.getFieldValue("status") === "Hoạt động" ? "ACTIVE" : "INACTIVE";

      const routePayload = {
        name: form.getFieldValue("name") || undefined,
        total_distance: Math.round(
          Number(form.getFieldValue("total_distance") || 0)
        ),
        total_time: Math.round(Number(form.getFieldValue("total_time") || 0)),
        status: statusValue as "ACTIVE" | "INACTIVE",
        pickups: routeDetailsValue.map((routeDetail) => ({
          pickupId: routeDetail.pickup?.id!,
          order: routeDetail.order!,
        })),
      };

      if (!currentSelectedItem?.id) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không tìm thấy ID tuyến để cập nhật",
        });
        return;
      }
      console.log("Route Payload for update:", routePayload);
      const restResponse = await execute(
        updateRoute(currentSelectedItem.id, routePayload),
        true
      );

      if (restResponse?.result) {
        getRouteData(); // reload danh sách tuyến
        setCurrentAction("list"); // về list
        Swal.fire({
          icon: "success",
          title: "Cập nhật tuyến thành công",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Có lỗi xảy ra khi cập nhật tuyến",
      });
    }
  };

  const columns: ColumnsType<RouteFormatType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: "10%",
      sorter: (a, b) => a?.id! - b?.id!,
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      width: "22%",
      sorter: (a, b) => a?.name!.localeCompare(b?.name!),
    },
    {
      title: "Trạm BĐ",
      dataIndex: "start_pickup",
      key: "start_pickup",
      width: "16%",
      sorter: (a, b) => a?.start_pickup!.localeCompare(b?.start_pickup!),
    },
    {
      title: "Trạm KT",
      dataIndex: "end_pickup",
      key: "end_pickup",
      width: "16%",
      sorter: (a, b) => a?.end_pickup!.localeCompare(b?.end_pickup!),
    },
    {
      title: "Tổng m",
      dataIndex: "total_distance",
      key: "total_distance",
      width: "8%",
      sorter: (a, b) => a?.total_distance! - b?.total_distance!,
    },
    {
      title: "Tổng s",
      dataIndex: "total_time",
      key: "total_time",
      width: "8%",
      sorter: (a, b) => a?.total_time! - b?.total_time!,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "10%",
      render: (status: string) => (
        <Tag color={status === CommonStatusValue.active ? "green" : "red"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "",
      render: (record: any) => (
        <div>
          <Button
            onClick={() => {
              setCurrentAction("detail");
              setCurrentSelectedItem(record);
            }}
          >
            <FontAwesomeIcon icon={faInfoCircle} />
          </Button>
          <Button
            onClick={() => {
              setCurrentAction("update");
              setCurrentSelectedItem(record);
            }}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </Button>
          <Button
            color="red"
            variant="filled"
            onClick={() => {
              const action =
                record.status === CommonStatusValue.active ? "lock" : "unlock";
              setCurrentAction(action);
              setCurrentSelectedItem(record);
            }}
          >
            <FontAwesomeIcon
              icon={
                record.status === CommonStatusValue.active ? faLock : faLockOpen
              }
            />
          </Button>
        </div>
      ),
      width: "10%",
    },
  ];

  // RouteActions object
  const RouteActions = {
    detail: (selectedRoute: RouteFormatType) => {
      const routeDetails = selectedRoute.routePickups; // <-- thêm dòng này

      return (
        <Form form={form} layout="vertical" initialValues={selectedRoute}>
          <Row gutter={16}>
            <Col span={16}>
              <LeafletMap
                type="detail"
                routeDetails={routeDetails}
                pickups={pickupList}
                handleGetRouteInfo={handleGetRouteInfo}
                draggableMarkers={false}
                onMarkerClick={() => {}}
              />
            </Col>
            <Col span={8}>
              <div className="pickup-list">
                <h3>Danh sách trạm</h3>
                {routeDetails?.map((item) => (
                  <Card
                    key={item.pickup?.id}
                    size="small"
                    style={{ marginBottom: 8 }}
                  >
                    {item.order}. {item.pickup?.name} - {item.pickup?.category}
                  </Card>
                ))}

                <Form.Item label="Tên tuyến" name="name">
                  <Input disabled />
                </Form.Item>

                <Form.Item label="Trạng thái" name="status">
                  <Input disabled />
                </Form.Item>

                <Form.Item label="Tổng quãng đường (m)" name="total_distance">
                  <Input disabled />
                </Form.Item>

                <Form.Item label="Thời gian dự tính (s)" name="total_time">
                  <Input disabled />
                </Form.Item>
              </div>
            </Col>
          </Row>
        </Form>
      );
    },

    update: (selectedRoute: RouteFormatType) => {
      return (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateSubmit}
          initialValues={selectedRoute}
        >
          <Row gutter={16}>
            <Col span={16}>
              <LeafletMap
                type="update"
                routeDetails={routeDetailsValue}
                pickups={pickupList}
                handleGetRouteInfo={handleGetRouteInfo}
                draggableMarkers
                onMarkerClick={handleMarkerClick}
              />
            </Col>

            <Col span={8}>
              <div className="pickup-list">
                <h3>Danh sách trạm đã chọn</h3>

                <DndContext
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={routeDetailsValue
                      .filter(
                        (
                          r
                        ): r is RouteDetailsFormatType & {
                          pickup: PickupType & { id: number };
                        } => r.pickup?.id !== undefined
                      )
                      .map((r) => r.pickup.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {routeDetailsValue
                      .filter(
                        (
                          r
                        ): r is RouteDetailsFormatType & {
                          pickup: PickupType & { id: number };
                        } => r.pickup?.id !== undefined
                      )
                      .map((item) => (
                        <SortableItem key={item.pickup.id} id={item.pickup.id}>
                          <Card size="small" style={{ marginBottom: 8 }}>
                            {item.order}. {item.pickup.name} -{" "}
                            {item.pickup.category}
                          </Card>
                        </SortableItem>
                      ))}
                  </SortableContext>
                </DndContext>

                <Form.Item
                  label="Tên tuyến"
                  name="name"
                  rules={[{ required: true, message: "Nhập tên tuyến" }]}
                >
                  <Input placeholder="Nhập tên tuyến" />
                </Form.Item>

                <Form.Item
                  label="Trạng thái"
                  name="status"
                  rules={[{ required: true, message: "Chọn trạng thái" }]}
                >
                  <Select
                    options={[
                      {
                        label: CommonStatusValue.active,
                        value: CommonStatusValue.active,
                      },
                      {
                        label: CommonStatusValue.inactive,
                        value: CommonStatusValue.inactive,
                      },
                    ]}
                  />
                </Form.Item>

                <Form.Item label="Tổng quãng đường (m)" name="total_distance">
                  <Input disabled />
                </Form.Item>

                <Form.Item label="Thời gian dự tính (s)" name="total_time">
                  <Input disabled />
                </Form.Item>

                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginTop: 16 }}
                  block
                >
                  Cập nhật tuyến
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      );
    },

    create: () => (
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={16}>
          <Col span={16}>
            <LeafletMap
              type="create"
              routeDetails={routeDetailsValue}
              pickups={pickupList}
              handleGetRouteInfo={handleGetRouteInfo}
              draggableMarkers
              onMarkerClick={handleMarkerClick}
            />
          </Col>
          <Col span={8}>
            <div className="pickup-list">
              <h3>Danh sách trạm đã chọn</h3>
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={routeDetailsValue.map((r) => r.pickup?.id!)}
                  strategy={verticalListSortingStrategy}
                >
                  {routeDetailsValue.map((item) => (
                    <SortableItem key={item.pickup?.id} id={item.pickup?.id!}>
                      <Card size="small" style={{ marginBottom: 8 }}>
                        {item.pickup?.name} - {item.pickup?.category}
                      </Card>
                    </SortableItem>
                  ))}
                </SortableContext>
              </DndContext>

              {/* Thêm Form.Item nếu cần nhập tên, trạng thái */}
              <Form.Item
                label="Tên tuyến"
                name="name"
                rules={[{ required: true, message: "Nhập tên tuyến" }]}
              >
                <Input placeholder="Nhập tên tuyến" />
              </Form.Item>

              <Form.Item
                label="Trạng thái"
                name="status"
                rules={[{ required: true, message: "Chọn trạng thái" }]}
              >
                <Select
                  options={[
                    {
                      label: CommonStatusValue.active,
                      value: CommonStatusValue.active,
                    },
                    {
                      label: CommonStatusValue.inactive,
                      value: CommonStatusValue.inactive,
                    },
                  ]}
                />
              </Form.Item>

              <Form.Item label="Tổng quãng đường (m)" name="total_distance">
                <Input disabled />
              </Form.Item>

              <Form.Item label="Thời gian dự tính (s)" name="total_time">
                <Input disabled />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                style={{ marginTop: 16 }}
                block
              >
                Tạo tuyến
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    ),

    lock: (selectedRoute: RouteFormatType) => {
      const handleLockRoute = async () => {
        const restResponse = await execute(
          updateRoute(selectedRoute.id!, {
            status:
              selectedRoute.status === CommonStatusValue.active
                ? "INACTIVE"
                : "ACTIVE",
          }),
          true
        );

        notify(
          restResponse!,
          selectedRoute.status === CommonStatusValue.active
            ? "Khoá tuyến đường thành công"
            : "Mở khoá tuyến đường thành công"
        );

        if (restResponse?.result) {
          getRouteData();
          setCurrentAction("list");
        }
      };

      return (
        <Alert
          message={`Tuyến đường: #${selectedRoute?.id} - ${selectedRoute?.name}`}
          showIcon
          icon={
            <FontAwesomeIcon
              icon={
                selectedRoute?.status === CommonStatusValue.active
                  ? faLock
                  : faLockOpen
              }
            />
          }
          description={
            "Bạn có chắc chắn muốn" +
            (selectedRoute?.status === CommonStatusValue.active
              ? " khoá "
              : " mở khoá ") +
            "tuyến đường này? Hành động không thể hoàn tác!"
          }
          type="error"
          action={
            <Button color="danger" variant="solid" onClick={handleLockRoute}>
              Xác nhận
            </Button>
          }
        />
      );
    },

    unlock: (selectedRoute: RouteFormatType) => {
      const handleUnlockRoute = async () => {
        const restResponse = await execute(
          updateRoute(selectedRoute.id!, {
            status:
              selectedRoute.status === CommonStatusValue.active
                ? "INACTIVE"
                : "ACTIVE",
          }),
          true
        );

        notify(
          restResponse!,
          selectedRoute.status === CommonStatusValue.active
            ? "Khoá tuyến đường thành công"
            : "Mở khoá tuyến đường thành công"
        );

        if (restResponse?.result) {
          getRouteData();
          setCurrentAction("list");
        }
      };

      return (
        <Alert
          message={`Tuyến đường: #${selectedRoute?.id} - ${selectedRoute?.name}`}
          showIcon
          icon={
            <FontAwesomeIcon
              icon={
                selectedRoute?.status === CommonStatusValue.active
                  ? faLock
                  : faLockOpen
              }
            />
          }
          description={
            "Bạn có chắc chắn muốn" +
            (selectedRoute?.status === CommonStatusValue.active
              ? " khoá "
              : " mở khoá ") +
            "tuyến đường này? Hành động không thể hoàn tác!"
          }
          type="error"
          action={
            <Button color="danger" variant="solid" onClick={handleUnlockRoute}>
              Xác nhận
            </Button>
          }
        />
      );
    },
  };

  return (
    <div className="admin-layout__main-content">
      <Breadcrumb
        items={currentBreadcrumbItems}
        className="admin-layout__main-breadcrumb"
      />
      <Card title={currentCardTitle} className="admin-layout__main-card">
        {/* LIST VIEW */}
        {currentCardContent === "list" && (
          <div className="route-data">
            <div className="admin-layout__main-filter">
              <div className="left">
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="Tìm theo tên tuyến đường"
                  className="filter-find"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <Select
                  allowClear
                  placeholder="Chọn Trạng thái"
                  options={[
                    {
                      label: CommonStatusValue.active,
                      value: CommonStatusValue.active,
                    },
                    {
                      label: CommonStatusValue.inactive,
                      value: CommonStatusValue.inactive,
                    },
                  ]}
                  className="filter-select"
                  value={statusFilter}
                  onChange={(value) => setStatusFilter(value)}
                />
                <Button
                  color="blue"
                  variant="filled"
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    setSearchText("");
                    setStatusFilter(undefined);
                  }}
                  className="filter-reset"
                >
                  Làm mới
                </Button>
              </div>
              <div className="right">
                <Button
                  type="primary"
                  icon={<FontAwesomeIcon icon={faPlus} />}
                  onClick={() => setCurrentAction("create")}
                >
                  {t("route-create")}
                </Button>
              </div>
            </div>

            <LeafletMap
              id="map-routes"
              type="detail"
              routes={filteredRouteList}
            />

            <CustomTableActions<RouteFormatType>
              columns={columns}
              data={filteredRouteList || []}
              rowKey={(record) => String(record?.id)}
              loading={loading}
              defaultPageSize={10}
              className="admin-layout__main-table table-data routes"
            />
          </div>
        )}
        {currentCardContent !== "list" &&
          currentCardContent !== "create" &&
          currentSelectedItem && (
            <div className="route-action-form">
              {RouteActions[currentCardContent as keyof typeof RouteActions]?.(
                currentSelectedItem
              )}
            </div>
          )}

        {/* CREATE */}
        {currentCardContent === "create" && RouteActions.create()}
      </Card>
    </div>
  );
};

export default RouteForm;
