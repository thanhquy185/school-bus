type NotificationType = {
  id: number;
  type: "blue" | "orange" | "green" | "red";
  title: string;
  description: string;
  image: string;
};

interface NotificationTabProps {
  notifications: NotificationType[];
}

const NotificationTab = ({ notifications }: NotificationTabProps) => {
  const getNotificationBgColor = (type: string) => {
    switch (type) {
      case "blue":
        return "bg-[#1677ff]";
      case "orange":
        return "bg-[#faad14]";
      case "green":
        return "bg-[#52c41a]";
      case "red":
        return "bg-[#ff4d4f]";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="h-[620px] overflow-auto">
      {/* notification-tags container */}
      <div className="flex flex-col gap-2.5">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`w-full p-4 rounded ${getNotificationBgColor(notif.type)}`}
          >
            {/* title */}
            <div className="flex items-center gap-1.5 text-white text-[18px] font-semibold mb-1.5">
              <img
                src={notif.image}
                alt={notif.type}
                className="w-5 h-5 object-contain"
              />
              <span>{notif.title}</span>
            </div>
            {/* description */}
            <p className="text-white text-[16px] mt-1.5">{notif.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationTab;
