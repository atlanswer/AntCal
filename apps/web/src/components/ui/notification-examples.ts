// Example of how to use the global notification system in any component

import { useNotifications } from "components/ui/useNotifications";

export function exampleUsage() {
  const { addError, addWarning, addInfo, addSuccess } = useNotifications();

  // Error notification (manual dismiss)
  addError("Upload Failed", "File format is not supported");

  // Warning notification (manual dismiss)
  addWarning("Large File", "This file may take longer to process");

  // Info notification (auto-dismiss after 2 seconds)
  addInfo("Processing", "Your file is being processed");

  // Success notification (auto-dismiss after 2 seconds)
  addSuccess("Complete", "File uploaded successfully");
}
