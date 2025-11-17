import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRoute,
  faClock,
  faBus,
  faLocationDot,
  faCircleCheck,
  faCircleXmark,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

type JourneyStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

type JourneyInfo = {
  routeName: string;
  busPlate: string;
  driverName: string;
  startTime: string;
  endTime: string;
  status: JourneyStatus;
  currentLocation: string;
  stops: {
    id: number;
    name: string;
    time: string;
    status: "COMPLETED" | "IN_PROGRESS" | "PENDING" | "SKIPPED";
  }[];
};

interface RouteInfoTabProps {
  journeyInfo: JourneyInfo;
}

const RouteInfoTab = ({ journeyInfo }: RouteInfoTabProps) => {
  const getStatusText = (status: JourneyStatus) => {
    switch (status) {
      case "IN_PROGRESS":
        return "Đang di chuyển";
      case "COMPLETED":
        return "Hoàn thành";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return "Chưa bắt đầu";
    }
  };

  const getStopIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <FontAwesomeIcon icon={faCircleCheck} className="text-[#52c41a]" />;
      case "IN_PROGRESS":
        return <FontAwesomeIcon icon={faSpinner} className="text-[#1677ff] animate-spin" />;
      case "SKIPPED":
        return <FontAwesomeIcon icon={faCircleXmark} className="text-[#ff4d4f]" />;
      default:
        return <FontAwesomeIcon icon={faLocationDot} className="text-gray-400" />;
    }
  };

  return (
    <div className="h-[620px] overflow-auto bg-red-500">
      {/* Route info content - tạm thời để màu đỏ như SCSS */}
      <div className="p-6 text-white">
        <h3 className="text-2xl font-bold mb-4">Thông tin tuyến đường</h3>
        
        {/* Journey Summary */}
        <div className="bg-white/10 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faRoute} className="text-3xl" />
              <div>
                <p className="text-sm opacity-80">Tuyến đường</p>
                <p className="font-semibold text-lg">{journeyInfo.routeName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faBus} className="text-3xl" />
              <div>
                <p className="text-sm opacity-80">Xe buýt</p>
                <p className="font-semibold text-lg">{journeyInfo.busPlate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faClock} className="text-3xl" />
              <div>
                <p className="text-sm opacity-80">Thời gian</p>
                <p className="font-semibold text-lg">
                  {journeyInfo.startTime} - {journeyInfo.endTime}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded bg-white/20 text-sm font-medium">
                {getStatusText(journeyInfo.status)}
              </div>
            </div>
          </div>
        </div>

        {/* Stops Timeline */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Các trạm dừng</h4>
          <div className="space-y-4">
            {journeyInfo.stops.map((stop, index) => (
              <div
                key={stop.id}
                className="flex items-start gap-4 p-4 rounded-lg bg-white/10"
              >
                <div className="flex flex-col items-center">
                  <div className="text-2xl">{getStopIcon(stop.status)}</div>
                  {index < journeyInfo.stops.length - 1 && (
                    <div className="w-0.5 h-12 mt-2 bg-white/30" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-lg">{stop.name}</p>
                  <p className="text-sm opacity-80 mt-1">
                    <FontAwesomeIcon icon={faClock} className="mr-1" />
                    {stop.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteInfoTab;
