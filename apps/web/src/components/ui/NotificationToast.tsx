import { onMount } from "solid-js";
import type { JSX } from "solid-js";
import type { NotificationItem } from "./useNotifications";

interface NotificationToastProps {
  notification: NotificationItem;
  onClose: (id: string) => void;
}

export default function NotificationToast(
  props: NotificationToastProps,
): JSX.Element {
  const getNotificationStyles = (type: NotificationItem["type"]) => {
    switch (type) {
      case "error":
        return "bg-red-500 text-white border-red-600";
      case "warning":
        return "bg-yellow-500 text-gray-900 border-yellow-600";
      case "info":
        return "bg-blue-500 text-white border-blue-600";
      case "success":
        return "bg-green-500 text-white border-green-600";
      default:
        return "bg-gray-500 text-white border-gray-600";
    }
  };

  const getNotificationIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "error":
        return (
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
        );
      case "warning":
        return (
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        );
      case "info":
        return (
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
        );
      case "success":
        return (
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  let notificationRef: HTMLDivElement | undefined;

  // Animation on mount
  onMount(() => {
    if (notificationRef) {
      notificationRef.style.opacity = "0";
      notificationRef.style.transform = "translateX(100%)";

      // Trigger animation
      requestAnimationFrame(() => {
        notificationRef.style.transition = "all 0.3s ease-out";
        notificationRef.style.opacity = "1";
        notificationRef.style.transform = "translateX(0)";
      });
    }
  });

  const handleClose = () => {
    if (notificationRef) {
      notificationRef.style.transition = "all 0.3s ease-in";
      notificationRef.style.opacity = "0";
      notificationRef.style.transform = "translateX(100%)";

      setTimeout(() => {
        props.onClose(props.notification.id);
      }, 300);
    } else {
      props.onClose(props.notification.id);
    }
  };

  return (
    <div
      ref={notificationRef!}
      class="flex max-w-md min-w-80 items-start gap-3 rounded-lg border p-4 shadow-lg"
      classList={{
        [getNotificationStyles(props.notification.type)]: true,
      }}
    >
      <div class="flex-shrink-0">
        {getNotificationIcon(props.notification.type)}
      </div>

      <div class="min-w-0 flex-1">
        <h4 class="text-sm font-semibold">{props.notification.title}</h4>
        <p class="mt-1 text-sm opacity-90">{props.notification.message}</p>
      </div>

      <button
        type="button"
        onClick={handleClose}
        class="hover:bg-opacity-10 flex-shrink-0 rounded p-1 transition-colors hover:bg-black"
        aria-label="Close notification"
      >
        <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
