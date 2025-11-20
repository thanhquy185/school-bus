import { useEffect, useState } from "react";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Badge, Calendar, Card, ConfigProvider } from "antd";
import dayjs, { Dayjs } from "dayjs";
import viVN from "antd/locale/vi_VN";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(isBetween);

const DriverSchedulePage = () => {
  // Dữ liệu (truy vấn dữ liệu từ đây)
  const demoData = [
    {
      id: 3,
      startDate: "20/11/2025",
      endDate: "22/11/2025",
      startTime: "07:00:00",
      endTime: "09:00:00",
      status: "ACTIVE",
      driver: {
        id: 1,
        avatar:
          "https://firebasestorage.googleapis.com/v0/b/school-bus-cnpm.firebasestorage.app/o/drivers%2F1763513996235_8870864d1be091bec8f1.jpg?alt=media&token=bc8467f5-7afe-48ad-b997-27a264c225c4",
        full_name: "abcdef",
        phone: "1234567890",
      },
      bus: {
        id: 1,
        license_plate: "50A-00000",
        capacity: 45,
      },
      route: {
        id: 1,
        name: "Tuyến Trạm Chợ Tân Phước → Trạm Hội trường Thành uỷ",
        startPickup: "Trạm Chợ Tân Phước",
        endPickup: "Trạm Hội trường Thành uỷ",
        totalDistance: 4484,
        totalTime: 427,
        pickups: [
          {
            pickup: {
              id: 1,
              name: "Trạm Chợ Tân Phước",
              category: "PICKUP",
              lat: 10.770959636564,
              lng: 106.6504561901093,
              status: "ACTIVE",
            },
            order: 1,
          },
          {
            pickup: {
              id: 4,
              name: "Trạm Chùa Bửu Đà",
              category: "PICKUP",
              lat: 10.78123804660808,
              lng: 106.6751030087471,
              status: "ACTIVE",
            },
            order: 2,
          },
          {
            pickup: {
              id: 3,
              name: "Trạm Hội trường Thành uỷ",
              category: "PICKUP",
              lat: 10.78009187851693,
              lng: 106.6825273633003,
              status: "ACTIVE",
            },
            order: 3,
          },
        ],
      },
    },
    {
      id: 10,
      startDate: "20/11/2025",
      endDate: "20/12/2025",
      startTime: "10:00:00",
      endTime: "12:00:00",
      status: "ACTIVE",
      driver: {
        id: 1,
        avatar:
          "https://firebasestorage.googleapis.com/v0/b/school-bus-cnpm.firebasestorage.app/o/drivers%2F1763513996235_8870864d1be091bec8f1.jpg?alt=media&token=bc8467f5-7afe-48ad-b997-27a264c225c4",
        full_name: "abcdef",
        phone: "1234567890",
      },
      bus: {
        id: 1,
        license_plate: "50A-00000",
        capacity: 45,
      },
      route: {
        id: 1,
        name: "Tuyến Trạm Chợ Tân Phước → Trạm Hội trường Thành uỷ",
        startPickup: "Trạm Chợ Tân Phước",
        endPickup: "Trạm Hội trường Thành uỷ",
        totalDistance: 4484,
        totalTime: 427,
        pickups: [
          {
            pickup: {
              id: 1,
              name: "Trạm Chợ Tân Phước",
              category: "PICKUP",
              lat: 10.770959636564,
              lng: 106.6504561901093,
              status: "ACTIVE",
            },
            order: 1,
          },
          {
            pickup: {
              id: 4,
              name: "Trạm Chùa Bửu Đà",
              category: "PICKUP",
              lat: 10.78123804660808,
              lng: 106.6751030087471,
              status: "ACTIVE",
            },
            order: 2,
          },
          {
            pickup: {
              id: 3,
              name: "Trạm Hội trường Thành uỷ",
              category: "PICKUP",
              lat: 10.78009187851693,
              lng: 106.6825273633003,
              status: "ACTIVE",
            },
            order: 3,
          },
        ],
      },
    },
    {
      id: 12,
      startDate: "19/11/2025",
      endDate: "23/11/2025",
      startTime: "07:00:00",
      endTime: "12:00:00",
      status: "ACTIVE",
      driver: {
        id: 1,
        avatar:
          "https://firebasestorage.googleapis.com/v0/b/school-bus-cnpm.firebasestorage.app/o/drivers%2F1763513996235_8870864d1be091bec8f1.jpg?alt=media&token=bc8467f5-7afe-48ad-b997-27a264c225c4",
        full_name: "abcdef",
        phone: "1234567890",
      },
      bus: {
        id: 1,
        license_plate: "50A-00000",
        capacity: 45,
      },
      route: {
        id: 3,
        name: "Tuyến Trạm Chợ Tân Phước → Trạm Nhà thờ Đắc Lộ",
        startPickup: "Trạm Chợ Tân Phước",
        endPickup: "Trạm Nhà thờ Đắc Lộ",
        totalDistance: 3776,
        totalTime: 325,
        pickups: [
          {
            pickup: {
              id: 1,
              name: "Trạm Chợ Tân Phước",
              category: "PICKUP",
              lat: 10.770959636564,
              lng: 106.6504561901093,
              status: "ACTIVE",
            },
            order: 1,
          },
          {
            pickup: {
              id: 2,
              name: "Trạm Nhà thờ Đắc Lộ",
              category: "PICKUP",
              lat: 10.7949811840504,
              lng: 106.6493028402329,
              status: "ACTIVE",
            },
            order: 2,
          },
        ],
      },
    },
  ];

  // Giá trị liên quan đến lịch
  const [value, setValue] = useState(() => dayjs());
  const [selectedValue, setSelectedValue] = useState(() => dayjs());
  const [calendarMode, setCalendarMode] = useState<"month" | "year">("month");
  const [todaySchedules, setTodaySchedules] = useState<any[]>([]);

  //
  const onSelect = (newValue: Dayjs) => {
    setValue(newValue);

    if (calendarMode === "year") return;

    setSelectedValue(newValue);

    // Lấy ra danh sách lịch làm việc của ngày được chọn
    const schedules = demoData.filter((item) => {
      const start = dayjs(item.startDate, "DD/MM/YYYY");
      const end = dayjs(item.endDate, "DD/MM/YYYY");
      return (
        newValue.isSame(start, "day") ||
        newValue.isSame(end, "day") ||
        (newValue.isAfter(start, "day") && newValue.isBefore(end, "day"))
      );
    });
    setTodaySchedules(schedules);
  };
  //
  const onPanelChange = (value: Dayjs, mode: "month" | "year") => {
    setCalendarMode(mode);
  };
  // Tuỳ chỉnh từng ô ngày trong lịch
  const dayCellRender = (current: Dayjs, schedules: any[]) => {
    const items = schedules.filter((item) => {
      const start = dayjs(item.startDate, "DD/MM/YYYY");
      const end = dayjs(item.endDate, "DD/MM/YYYY");
      return (
        current.isSame(start, "day") ||
        current.isSame(end, "day") ||
        (current.isAfter(start, "day") && current.isBefore(end, "day"))
      );
    });

    if (!items.length) return null;

    return (
      <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
        {items.map((item) => (
          <li key={item.id} style={{ marginBottom: 4 }}>
            <Badge
              status="warning"
              text={`${item.startTime.slice(0, 5)} - ${item.endTime.slice(
                0,
                5
              )}`}
            />
          </li>
        ))}
      </ul>
    );
  };
  // Hàm thống kê số lịch cho từng tháng trong năm
  const getMonthSummary = (month: number, year: number) => {
    const schedules = demoData.filter((item) => {
      const start = dayjs(item.startDate, "DD/MM/YYYY");
      const end = dayjs(item.endDate, "DD/MM/YYYY");
      const monthStart = dayjs(`${year}-${month + 1}-01`);
      const monthEnd = monthStart.endOf("month");

      return (
        start.isSame(monthStart, "month") ||
        end.isSame(monthStart, "month") ||
        (start.isBefore(monthEnd, "day") && end.isAfter(monthStart, "day"))
      );
    });

    const totalDays = new Set<number>();
    let totalHours = 0;
    const routes = new Set<string>();

    schedules.forEach((item) => {
      const start = dayjs(item.startDate, "DD/MM/YYYY");
      const end = dayjs(item.endDate, "DD/MM/YYYY");

      // Xác định ngày rơi vào tháng hiện tại
      const monthStart = dayjs(`${year}-${month + 1}-01`);
      const monthEnd = monthStart.endOf("month");
      const itemStart = start.isBefore(monthStart) ? monthStart : start;
      const itemEnd = end.isAfter(monthEnd) ? monthEnd : end;

      for (
        let d = itemStart;
        d.isSameOrBefore(itemEnd, "day");
        d = d.add(1, "day")
      ) {
        totalDays.add(d.date() + d.month() * 100); // key unique cho từng ngày
      }

      // Tổng số giờ (tính giờ chênh lệch)
      const startTime = dayjs(item.startTime, "HH:mm:ss");
      const endTime = dayjs(item.endTime, "HH:mm:ss");
      totalHours += endTime.diff(startTime, "hour", true); // giờ thập phân

      routes.add(item.route.name);
    });

    return {
      totalDays: totalDays.size,
      totalHours: totalHours.toFixed(0),
      totalRoutes: routes.size,
    };
  };
  // Hàm render cho từng ô tháng
  const monthCellRender = (current: Dayjs) => {
    const summary = getMonthSummary(current.month(), current.year());
    if (!summary.totalDays) return null;

    return (
      <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
        <li>
          {/* <Badge status="success" text={`📅 ${summary.totalDays} ngày làm`} /> */}
          📅 {summary.totalDays} ngày làm
        </li>
        <li>
          {/* <Badge status="success" text={`🕒 ${summary.totalHours} giờ`} /> */}
          🕒 {summary.totalHours} giờ
        </li>
        <li>
          {/* <Badge status="success" text={`🚍 ${summary.totalRoutes} tuyến`} /> */}
          🚍 {summary.totalRoutes} tuyến
        </li>
      </ul>
    );
  };

  useEffect(() => {
    // Lấy ra danh sách lịch làm việc của ngày hôm này
    const currentDate = dayjs();
    const schedules = demoData.filter((item) => {
      const start = dayjs(item.startDate, "DD/MM/YYYY");
      const end = dayjs(item.endDate, "DD/MM/YYYY");
      return (
        currentDate.isSame(start, "day") ||
        currentDate.isSame(end, "day") ||
        (currentDate.isAfter(start, "day") && currentDate.isBefore(end, "day"))
      );
    });
    setTodaySchedules(schedules);
  }, []);

  return (
    <div className="client-layout__main parent">
      <h2 className="client-layout__title">
        <span>
          <FontAwesomeIcon icon={faCalendarDays} />
          <strong>Lịch làm việc</strong>
        </span>
      </h2>
      <Card title="Thông tin lịch làm việc">
        {calendarMode !== "year" && (
          <>
            <div>
              {todaySchedules.length > 0 ? (
                <Alert
                  type="info"
                  message={
                    <p
                      style={{
                        marginBottom: 10,
                        color: "#1890ff",
                        fontSize: 17,
                        fontWeight: 700,
                      }}
                    >
                      {`Lịch làm việc ngày ${selectedValue.format(
                        "DD/MM/YYYY"
                      )}`}
                    </p>
                  }
                  description={
                    <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
                      {todaySchedules.map((item) => (
                        <Alert
                          type="warning"
                          message={
                            <p style={{ fontSize: 14, fontWeight: 500 }}>
                              {item.route.name}
                            </p>
                          }
                          description={
                            <div style={{ fontSize: 14 }}>
                              <p>
                                🕒 {item.startTime} - {item.endTime}
                              </p>
                              <p>
                                🚍 {item.bus.license_plate} |{" "}
                                {item.bus.capacity} ghế
                              </p>
                            </div>
                          }
                          style={{ padding: 14, marginTop: 6 }}
                        ></Alert>
                      ))}
                    </ul>
                  }
                />
              ) : (
                <Alert
                  type="info"
                  message={
                    <p
                      style={{
                        color: "#1890ff",
                        fontSize: 17,
                        fontWeight: 700,
                      }}
                    >
                      {`Ngày ${selectedValue.format(
                        "DD/MM/YYYY"
                      )} không có lịch làm việc`}
                    </p>
                  }
                />
              )}
            </div>
          </>
        )}
        <ConfigProvider
          locale={viVN}
          theme={{ token: { colorPrimary: "#1890ff" } }}
        >
          <Calendar
            value={value}
            onSelect={onSelect}
            onPanelChange={onPanelChange}
            mode={calendarMode}
            cellRender={(current) =>
              calendarMode === "month"
                ? dayCellRender(current, demoData)
                : monthCellRender(current)
            }
          />
        </ConfigProvider>
      </Card>
    </div>
  );
};

export default DriverSchedulePage;
