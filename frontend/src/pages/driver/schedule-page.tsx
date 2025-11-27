import { useEffect, useState } from "react";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import {
  CarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  RobotOutlined,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Badge, Button, Calendar, Card, ConfigProvider } from "antd";
import dayjs, { Dayjs } from "dayjs";
import viVN from "antd/locale/vi_VN";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isBetween from "dayjs/plugin/isBetween";
import type { ScheduleFormatType } from "../../common/types";
import useCallApi from "../../api/useCall";
import { getSchedules } from "../../services/driver-service";
import { createActive } from "../../services/active-service";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(isBetween);

const checkActiveStatus = (
  schedule: ScheduleFormatType,
  dateValue: Dayjs,
  statusValue: string
) => {
  return schedule.actives?.some(
    (active) =>
      dayjs(active.start_at, "DD/MM/YYYY").isSame(dateValue, "day") &&
      active.status === statusValue
  );
};

const DriverSchedulePage = () => {
  const { execute, notify } = useCallApi();

  // Dữ liệu lịch làm việc của tài xế
  const [driverSchedules, setDriverSchedules] =
    useState<ScheduleFormatType[]>();
  const getDriverSchedules = async () => {
    const response = await execute(getSchedules(), false);
    const data = response?.data;
    setDriverSchedules(data);
  };
  useEffect(() => {
    getDriverSchedules();
  }, []);

  // Giá trị liên quan đến lịch
  const [value, setValue] = useState(() => dayjs());
  const [selectedValue, setSelectedValue] = useState(() => dayjs());
  const [calendarMode, setCalendarMode] = useState<"month" | "year">("month");
  const [todaySchedules, setTodaySchedules] = useState<any[]>([]);
  const isToday = selectedValue.isSame(dayjs(), "day");
  // const isToday = true;

  //
  const parseDaysOfWeek = (str: string) => {
    if (!str) return [];
    return str.split("|").map(Number);
  };
  //
  const isScheduleOnDay = (
    schedule: ScheduleFormatType,
    currentDate: Dayjs
  ) => {
    const start = dayjs(schedule.start_date, "DD/MM/YYYY");
    const end = dayjs(schedule.end_date, "DD/MM/YYYY");
    const days = parseDaysOfWeek(schedule.days_of_week!);

    const inRange =
      currentDate.isSame(start, "day") ||
      currentDate.isSame(end, "day") ||
      (currentDate.isAfter(start, "day") && currentDate.isBefore(end, "day"));

    const matchDay =
      days.length === 0 ? true : days.includes(currentDate.day());

    return inRange && matchDay;
  };
  //
  const onSelect = (newValue: Dayjs) => {
    setValue(newValue);

    if (calendarMode === "year") return;

    setSelectedValue(newValue);

    // Lấy ra danh sách Lịch làm việc của ngày được chọn
    const schedules = driverSchedules?.filter((item) => {
      return isScheduleOnDay(item, newValue);
    });
    setTodaySchedules(schedules!);
  };
  //
  const onPanelChange = (value: Dayjs, mode: "month" | "year") => {
    setCalendarMode(mode);
  };
  // Tuỳ chỉnh từng ô ngày trong lịch
  const dayCellRender = (
    currentDate: Dayjs,
    schedules: ScheduleFormatType[]
  ) => {
    const items = schedules?.filter((item) => {
      return isScheduleOnDay(item, currentDate);
    });

    if (!items?.length) return null;

    return (
      <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
        {items.map((item) => (
          <li key={item.id} style={{ marginBottom: 4 }}>
            <Badge
              status={
                checkActiveStatus(item, currentDate, "SUCCESS")
                  ? "success"
                  : checkActiveStatus(item, currentDate, "ACTIVE")
                  ? "warning"
                  : checkActiveStatus(item, currentDate, "CANCELED")
                  ? "error"
                  : "default"
              }
              text={`${item.start_time?.slice(0, 5)} - ${item.end_time?.slice(
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
    const monthStart = dayjs(`${year}-${month + 1}-01`);
    const monthEnd = monthStart.endOf("month");

    const schedules = driverSchedules?.filter((item) => {
      const start = dayjs(item.start_date, "DD/MM/YYYY");
      const end = dayjs(item.end_date, "DD/MM/YYYY");

      // kiểm tra schedule có giao với tháng này không
      return (
        start.isSame(monthStart, "month") ||
        end.isSame(monthStart, "month") ||
        (start.isBefore(monthEnd, "day") && end.isAfter(monthStart, "day"))
      );
    });

    const totalDays = new Set<number>();
    let totalHours = 0;
    const routes = new Set<string>();

    schedules?.forEach((schedule) => {
      const start = dayjs(schedule.start_date, "DD/MM/YYYY");
      const end = dayjs(schedule.end_date, "DD/MM/YYYY");
      const days = parseDaysOfWeek(schedule.days_of_week || "");

      const itemStart = start.isBefore(monthStart) ? monthStart : start;
      const itemEnd = end.isAfter(monthEnd) ? monthEnd : end;

      // Tính dailyHours của schedule này (1 phiên)
      const sTime = dayjs(schedule.start_time, "HH:mm:ss");
      const eTime = dayjs(schedule.end_time, "HH:mm:ss");
      const dailyHours = eTime.diff(sTime, "minute") / 60; // chính xác tuyệt đối

      // Lặp từng ngày trong khoảng
      for (
        let d = itemStart;
        d.isSameOrBefore(itemEnd, "day");
        d = d.add(1, "day")
      ) {
        const matchDay = days.length === 0 ? true : days.includes(d.day());

        if (matchDay) {
          // Thêm ngày làm
          totalDays.add(d.date() + d.month() * 100);

          // Cộng giờ cho ngày này
          totalHours += dailyHours;

          // Ghi nhận tuyến
          routes.add(schedule?.route?.name!);
        }
      }
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
    if (!driverSchedules) return;

    // Lấy ra danh sách Lịch làm việc của ngày hôm này
    const currentDate = dayjs();
    setValue(currentDate);
    setSelectedValue(currentDate);
    const schedules = driverSchedules?.filter((item) => {
      return isScheduleOnDay(item, currentDate);
    });
    setTodaySchedules(schedules!);
  }, [driverSchedules]);

  return (
    <div className="client-layout__main">
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
              {todaySchedules?.length > 0 ? (
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
                      {todaySchedules.map((schedule: ScheduleFormatType) => (
                        <Alert
                          type={
                            checkActiveStatus(
                              schedule,
                              selectedValue,
                              "SUCCESS"
                            )
                              ? "success"
                              : checkActiveStatus(
                                  schedule,
                                  selectedValue,
                                  "ACTIVE"
                                )
                              ? "warning"
                              : checkActiveStatus(
                                  schedule,
                                  selectedValue,
                                  "CANCELED"
                                )
                              ? "error"
                              : undefined
                          }
                          message={
                            <p style={{ fontSize: 14, fontWeight: 500 }}>
                              {schedule.route?.name}
                            </p>
                          }
                          description={
                            <div style={{ fontSize: 14 }}>
                              <p>
                                🕒 {schedule.start_time} - {schedule.end_time}
                              </p>
                              <p>
                                🚍 {schedule.bus?.license_plate} |{" "}
                                {schedule.bus?.capacity} ghế
                              </p>
                            </div>
                          }
                          action={
                            isToday &&
                            !schedule.actives?.some((active) =>
                              dayjs(active.start_at, "DD/MM/YYYY").isSame(
                                selectedValue,
                                "day"
                              )
                            ) &&
                            !driverSchedules?.some((schedule) => {
                              return schedule?.actives?.some(
                                (active) => active.status === "ACTIVE"
                              );
                            })
                              ? [
                                  <Button
                                    variant="solid"
                                    color="green"
                                    icon={<CarOutlined />}
                                    style={{ marginRight: 6 }}
                                    onClick={async () => {
                                      const restResponse = await execute(
                                        createActive({
                                          schedule_id: schedule.id!,
                                          start_at: dayjs().format(
                                            "DD/MM/YYYY HH:mm:ss"
                                          ),
                                          status: "ACTIVE",
                                        }),
                                        true
                                      );
                                      notify(
                                        restResponse!,
                                        "Xác nhận làm việc thành công"
                                      );
                                      if (restResponse?.result) {
                                        getDriverSchedules();
                                      }
                                    }}
                                  >
                                    Làm việc
                                  </Button>,
                                  <Button
                                    variant="solid"
                                    color="red"
                                    icon={<RobotOutlined />}
                                    onClick={async () => {
                                      const restResponse = await execute(
                                        createActive({
                                          schedule_id: schedule.id!,
                                          start_at: dayjs().format(
                                            "DD/MM/YYYY HH:mm:ss"
                                          ),
                                          end_at: dayjs().format(
                                            "DD/MM/YYYY HH:mm:ss"
                                          ),
                                          // start_at: `${selectedValue.format(
                                          //   "DD/MM/YYYY"
                                          // )} 00:00:00`,
                                          // end_at: `${selectedValue.format(
                                          //   "DD/MM/YYYY"
                                          // )} 00:00:00`,
                                          status: "CANCELED",
                                        }),
                                        true
                                      );
                                      notify(
                                        restResponse!,
                                        "Xác nhận huỷ làm thành công"
                                      );
                                      if (restResponse?.result) {
                                        getDriverSchedules();
                                      }
                                    }}
                                  >
                                    Huỷ làm
                                  </Button>,
                                ]
                              : isToday &&
                                checkActiveStatus(
                                  schedule,
                                  selectedValue,
                                  "SUCCESS"
                                )
                              ? [
                                  <Button
                                    variant="solid"
                                    color="green"
                                    icon={<CheckCircleOutlined />}
                                  >
                                    Đã hoàn thành
                                  </Button>,
                                ]
                              : isToday &&
                                checkActiveStatus(
                                  schedule,
                                  selectedValue,
                                  "ACTIVE"
                                )
                              ? [
                                  <Button
                                    variant="solid"
                                    color="orange"
                                    icon={<ClockCircleOutlined />}
                                  >
                                    Đang làm việc
                                  </Button>,
                                ]
                              : isToday &&
                                checkActiveStatus(
                                  schedule,
                                  selectedValue,
                                  "CANCELED"
                                )
                              ? [
                                  <Button
                                    variant="solid"
                                    color="red"
                                    icon={<CloseCircleOutlined />}
                                  >
                                    Đã huỷ làm
                                  </Button>,
                                ]
                              : []
                          }
                          style={{ padding: 14, marginTop: 6 }}
                          className="driver-schedule-alert"
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
                      )} không có Lịch làm việc`}
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
                ? dayCellRender(current, driverSchedules!)
                : monthCellRender(current)
            }
          />
        </ConfigProvider>
      </Card>
    </div>
  );
};

export default DriverSchedulePage;
