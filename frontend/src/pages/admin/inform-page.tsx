import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Breadcrumb,
  Card,
  Button,
  Select,
  Alert,
  DatePicker,
  List,
} from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import type { InformFormatType } from "../../common/types";
import useCallApi from "../../api/useCall";
import { getInforms } from "../../services/inform-service";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

// Inform Page
const InformPage = () => {
  const { execute, notify, loading } = useCallApi();
  const { t } = useTranslation();

  // Dữ liệu về thông báo
  const [informs, setInforms] = useState<InformFormatType[]>();
  const getInformData = async () => {
    try {
      const response = await execute(getInforms(), false);

      if (response && response.result) {
        if (Array.isArray(response.data)) {
          setInforms(response.data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getInformData();
  }, []);

  // Lọc dữ liệu
  const [rangeFilter, setRangeFilter] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const filteredInforms = informs?.filter((inform) => {
    const matchesTime = rangeFilter
      ? dayjs(inform.at, "DD/MM/YYYY HH:mm:ss").isBetween(
          rangeFilter[0],
          rangeFilter[1],
          null,
          "[]"
        )
      : true;

    const matchesType = typeFilter ? inform.type === typeFilter : true;

    return matchesTime && matchesType;
  });

  return (
    <>
      <div className="admin-layout__main-content">
        <Breadcrumb
          items={[
            {
              title: (
                <span>
                  <FontAwesomeIcon icon={faMessage} />
                  &nbsp;{t("inform-manager")}
                </span>
              ),
            },
            {
              title: <span>{t("inform-list")}</span>,
            },
          ]}
          className="admin-layout__main-breadcrumb"
        />
        <Card title={t("inform-list")} className="admin-layout__main-card">
          <div className="inform-data">
            <div className="admin-layout__main-filter">
              <div className="left">
                <DatePicker.RangePicker
                  showTime
                  allowClear
                  format="DD/MM/YYYY HH:mm:ss"
                  placeholder={["Thời gian bắt đầu", "Thời gian kết thúc"]}
                  className="filter-time"
                  value={rangeFilter}
                  onChange={(value) => setRangeFilter(value)}
                />
                <Select
                  allowClear
                  placeholder="Chọn Loại thông báo"
                  options={[
                    { label: "Thông tin", value: "INFO" },
                    { label: "Thành công", value: "SUCCESS" },
                    { label: "Cảnh báo", value: "WARNING" },
                    { label: "Lỗi", value: "ERROR" },
                  ]}
                  className="filter-select"
                  value={typeFilter}
                  onChange={(value) => setTypeFilter(value)}
                />
                <Button
                  color="blue"
                  variant="filled"
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    setRangeFilter(null);
                    setTypeFilter(undefined);
                  }}
                  className="filter-reset"
                >
                  Làm mới
                </Button>
              </div>
            </div>
            <div className="admin-layout__main-informs">
              <List
                itemLayout="vertical"
                dataSource={filteredInforms?.sort(
                  (a, b) => b.at?.localeCompare(a.at!)!
                )}
                pagination={{
                  pageSize: 5,
                  // showSizeChanger: true,
                  // pageSizeOptions: [5, 10, 20, 30, 40, 50],
                }}
                renderItem={(inform) => (
                  <List.Item key={inform.id} style={{ padding: 0 }}>
                    <Alert
                      type={
                        inform.type?.toLowerCase() as
                          | "info"
                          | "success"
                          | "warning"
                          | "error"
                          | undefined
                      }
                      className="inform"
                      message={
                        <>
                          <p className="title">
                            <img
                              src={`/src/assets/images/others/inform-${inform?.type}-icon.png`}
                              alt=""
                            />
                            <span>{inform?.message}</span>
                          </p>
                          <Button
                            variant="solid"
                            color={
                              inform?.type === "INFO"
                                ? "blue"
                                : inform?.type === "SUCCESS"
                                ? "green"
                                : inform?.type === "WARNING"
                                ? "orange"
                                : "red"
                            }
                          >
                            {inform?.at}
                          </Button>
                        </>
                      }
                      description={
                        <>
                          <p className="description">
                            {inform?.description} vào lúc{" "}
                            {inform?.at?.split(" ")[1]}
                          </p>
                          <div className="infos">
                            <div className="row">
                              <div className="info">
                                <div className="header">
                                  <img
                                    src="https://cdn-icons-png.flaticon.com/512/854/854894.png"
                                    alt=""
                                  />
                                  <h4>Tuyến đường</h4>
                                </div>
                                <p>Tuyến đường #{inform?.route?.id}</p>
                              </div>
                              <div className="info">
                                <div className="header">
                                  <img
                                    src="https://cdn-icons-png.flaticon.com/512/1068/1068580.png"
                                    alt=""
                                  />
                                  <h4>Xe buýt</h4>
                                </div>
                                <p>
                                  {inform?.bus?.license_plate
                                    ? inform?.bus?.license_plate
                                    : "Xe buýt không có biển số xe"}
                                </p>
                              </div>
                              <div className="info">
                                <div className="header">
                                  <img
                                    src="https://cdn-icons-png.flaticon.com/512/2684/2684225.png"
                                    alt=""
                                  />
                                  <h4>Tài xế</h4>
                                </div>
                                <p>
                                  {inform?.driver?.full_name
                                    ? inform?.driver?.full_name
                                    : "Tài xế không có họ tên"}
                                </p>
                              </div>
                            </div>
                            <div className="info">
                              <div className="header">
                                <img
                                  src="/src/assets/images/others/way-icon.png"
                                  alt=""
                                />
                                <h4>Hành trình</h4>
                              </div>
                              <p>
                                {inform?.route?.routePickups?.map(
                                  (routePickup) => (
                                    <>
                                      {routePickup?.pickup?.name}{" "}
                                      {routePickup?.order ===
                                      inform?.route?.routePickups?.length
                                        ? ""
                                        : "→"}
                                    </>
                                  )
                                )}
                              </p>
                              <p className="current-location">
                                <img
                                  src="/src/assets/images/others/pin-icon.png"
                                  alt=""
                                />
                                <b>Vị trí hiện tại:</b> Cầu ABC
                              </p>
                            </div>
                          </div>
                        </>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default InformPage;
