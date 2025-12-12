import { createSignal, onCleanup } from "solid-js";

export interface NotificationItem {
  id: string;
  type: "error" | "warning" | "info" | "success";
  title: string;
  message: string;
  timestamp: number;
  autoDismiss?: boolean;
}

const [notifications, setNotifications] = createSignal<NotificationItem[]>([]);

// Auto-dismiss timer tracking
const timers = new Map<string, ReturnType<typeof setTimeout>>();

export const useNotifications = () => {
  const addNotification = (
    type: NotificationItem["type"],
    title: string,
    message: string,
    autoDismiss: boolean = type === "info" || type === "success",
  ) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const notification: NotificationItem = {
      id,
      type,
      title,
      message,
      timestamp: Date.now(),
      autoDismiss,
    };

    setNotifications((prev) => [...prev, notification]);

    // Set up auto-dismiss timer
    if (autoDismiss) {
      const timer = setTimeout(() => {
        removeNotification(id);
      }, 2000); // 2 seconds
      timers.set(id, timer);
    }

    return id;
  };

  const removeNotification = (id: string) => {
    // Clear any existing timer
    const timer = timers.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.delete(id);
    }

    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAllNotifications = () => {
    // Clear all timers
    timers.forEach((timer) => clearTimeout(timer));
    timers.clear();

    setNotifications([]);
  };

  // Convenience methods
  const addError = (title: string, message: string) =>
    addNotification("error", title, message, false);
  const addWarning = (title: string, message: string) =>
    addNotification("warning", title, message, false);
  const addInfo = (title: string, message: string) =>
    addNotification("info", title, message, true);
  const addSuccess = (title: string, message: string) =>
    addNotification("success", title, message, true);

  // Cleanup on unmount
  onCleanup(() => {
    timers.forEach((timer) => clearTimeout(timer));
    timers.clear();
  });

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    addError,
    addWarning,
    addInfo,
    addSuccess,
  };
};
