// Example: Using the global notification system in any component
// This can be used in any route/component throughout the application

import { useNotifications } from "components/ui/useNotifications";

export function TestNotifications() {
  const { addError, addWarning, addInfo, addSuccess } = useNotifications();

  return (
    <div class="space-y-2 p-4">
      <h3 class="text-lg font-semibold">Test Notifications</h3>

      <div class="flex flex-wrap gap-2">
        <button
          onClick={() => addError("Test Error", "This is a test error message")}
          class="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
        >
          Error
        </button>

        <button
          onClick={() =>
            addWarning("Test Warning", "This is a test warning message")
          }
          class="rounded bg-yellow-500 px-3 py-1 text-gray-900 hover:bg-yellow-600"
        >
          Warning
        </button>

        <button
          onClick={() => addInfo("Test Info", "This is a test info message")}
          class="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
        >
          Info
        </button>

        <button
          onClick={() =>
            addSuccess("Test Success", "This is a test success message")
          }
          class="rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600"
        >
          Success
        </button>
      </div>
    </div>
  );
}
