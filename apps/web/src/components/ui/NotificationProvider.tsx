import { useNotifications } from "./useNotifications";
import NotificationSystem from "./NotificationSystem";

export default function NotificationProvider() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <NotificationSystem
      notifications={notifications}
      onClose={removeNotification}
    />
  );
}
