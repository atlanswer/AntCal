import { For, createSignal, onMount } from "solid-js";
import type { JSX } from "solid-js";
import type { NotificationItem } from "./useNotifications";
import NotificationToast from "./NotificationToast";

interface NotificationSystemProps {
  notifications: () => NotificationItem[];
  onClose: (id: string) => void;
}

export default function NotificationSystem(
  props: NotificationSystemProps,
): JSX.Element {
  const [isVisible, setIsVisible] = createSignal(false);

  onMount(() => {
    // Trigger mount animation
    setIsVisible(true);
  });

  return (
    <div
      class="pointer-events-none fixed top-4 right-4 z-50 flex flex-col gap-2 transition-opacity duration-300"
      classList={{
        "opacity-100": isVisible(),
        "opacity-0": !isVisible(),
      }}
    >
      <For each={props.notifications()}>
        {(notification) => (
          <div class="pointer-events-auto">
            <NotificationToast
              notification={notification}
              onClose={props.onClose}
            />
          </div>
        )}
      </For>
    </div>
  );
}
