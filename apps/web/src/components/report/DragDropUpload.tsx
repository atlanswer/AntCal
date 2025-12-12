import { createSignal, onMount, onCleanup } from "solid-js";
import type { JSX } from "solid-js";
import { useNotifications } from "components/ui/useNotifications";

interface DragDropUploadProps {
  accept?: string[];
  multiple?: boolean;
  onFilesDrop: (files: File[]) => void;
  maxSize?: number; // in bytes
  maxFiles?: number;
}

export default function DragDropUpload(
  props: DragDropUploadProps,
): JSX.Element {
  const [isDragging, setIsDragging] = createSignal(false);
  const [fileInputRef, setFileInputRef] = createSignal<HTMLInputElement>();
  const [uploadedFiles, setUploadedFiles] = createSignal<File[]>([]);
  const { addError, addSuccess } = useNotifications();

  const defaultAccept = ["application/json"];
  const defaultMaxSize = 10 * 1024 * 1024; // 10MB
  const defaultMaxFiles = 10;

  const accept = () => props.accept || defaultAccept;
  const maxSize = () => props.maxSize || defaultMaxSize;
  const maxFiles = () => props.maxFiles || defaultMaxFiles;

  const validateFile = (file: File): boolean => {
    // Check file type
    if (accept().length > 0 && !accept().includes(file.type)) {
      addError(
        "Invalid File Type",
        `File ${file.name} is not a supported JSON file. Please upload JSON files only.`,
      );
      return false;
    }

    // Check file size
    if (file.size > maxSize()) {
      addError(
        "File Too Large",
        `File ${file.name} exceeds the maximum size of ${Math.round(maxSize() / 1024 / 1024)}MB.`,
      );
      return false;
    }

    return true;
  };

  const validateFiles = (files: FileList | File[]): File[] => {
    const fileArray = Array.from(files);

    // Check file count
    if (!props.multiple && fileArray.length > 1) {
      addError(
        "Multiple Files Detected",
        "Please upload only one file at a time.",
      );
      return [];
    }

    if (props.multiple && fileArray.length > maxFiles()) {
      addError(
        "Too Many Files",
        `Maximum ${maxFiles()} files allowed. Please select fewer files.`,
      );
      return [];
    }

    // Validate each file
    const validFiles: File[] = [];
    for (const file of fileArray) {
      if (validateFile(file)) {
        validFiles.push(file);
      }
    }

    return validFiles;
  };

  const handleFiles = (files: FileList | File[]) => {
    const validFiles = validateFiles(files);

    if (validFiles.length > 0) {
      setUploadedFiles((prev) =>
        props.multiple ? [...prev, ...validFiles] : validFiles,
      );
      props.onFilesDrop(validFiles);

      // Show success notification
      if (validFiles.length === 1) {
        addSuccess(
          "File Uploaded",
          `Successfully uploaded ${validFiles[0]?.name || "unknown file"}`,
        );
      } else {
        addSuccess(
          "Files Uploaded",
          `Successfully uploaded ${validFiles.length} files`,
        );
      }
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleFileInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      handleFiles(target.files);
    }
  };

  const openFileDialog = () => {
    fileInputRef()?.click();
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAllFiles = () => {
    setUploadedFiles([]);
  };

  // Set up drag and drop event listeners
  onMount(() => {
    const dragCounter = createSignal(0);

    const handleGlobalDragEnter = (e: DragEvent) => {
      e.preventDefault();
      dragCounter[1]((prev) => prev + 1);
      setIsDragging(true);
    };

    const handleGlobalDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounter[1]((prev) => prev - 1);
      if (dragCounter[0]() === 0) {
        setIsDragging(false);
      }
    };

    const handleGlobalDrop = (e: DragEvent) => {
      e.preventDefault();
      dragCounter[1](0);
      setIsDragging(false);

      if (e.dataTransfer?.files) {
        handleFiles(e.dataTransfer.files);
      }
    };

    // Add global event listeners
    document.addEventListener("dragenter", handleGlobalDragEnter);
    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("dragleave", handleGlobalDragLeave);
    document.addEventListener("drop", handleGlobalDrop);

    onCleanup(() => {
      document.removeEventListener("dragenter", handleGlobalDragEnter);
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("dragleave", handleGlobalDragLeave);
      document.removeEventListener("drop", handleGlobalDrop);
    });
  });

  return (
    <div class="w-full">
      {/* Hidden file input */}
      <input
        ref={setFileInputRef}
        type="file"
        accept={accept().join(",")}
        multiple={props.multiple}
        onChange={handleFileInput}
        class="hidden"
      />

      {/* Drag and drop area */}
      <div
        class="relative cursor-pointer rounded-lg border-2 border-dashed bg-neutral-300 p-8 text-center transition-colors"
        classList={{
          "border-sky-500 bg-sky-50": isDragging(),
          "border-neutral-300 hover:border-sky-400 hover:bg-neutral-100":
            !isDragging(),
        }}
        onClick={openFileDialog}
      >
        <div class="space-y-4">
          {/* Upload icon */}
          <div class="flex justify-center">
            <svg
              class="h-12 w-12"
              classList={{
                "text-sky-500": isDragging(),
                "text-gray-400": !isDragging(),
              }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          {/* Upload text */}
          <div>
            <p class="text-lg font-medium text-gray-900">
              {isDragging() ? "Drop files here" : "Upload JSON Files"}
            </p>
            <p class="text-sm text-gray-500">
              Drag and drop JSON files here, or click to select files
            </p>
            {props.multiple && (
              <p class="text-xs text-gray-400">
                Up to {maxFiles()} files, max{" "}
                {Math.round(maxSize() / 1024 / 1024)}MB each
              </p>
            )}
          </div>

          {/* Browse button */}
          <button
            type="button"
            class="inline-flex cursor-pointer items-center rounded-md border border-transparent bg-sky-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none"
          >
            Browse Files
          </button>
        </div>
      </div>

      {/* File list */}
      {uploadedFiles().length > 0 && (
        <div class="mt-4 space-y-2">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-medium text-gray-900">
              Uploaded Files ({uploadedFiles().length})
            </h3>
            {props.multiple && (
              <button
                type="button"
                onClick={clearAllFiles}
                class="text-sm text-red-600 hover:text-red-800"
              >
                Clear All
              </button>
            )}
          </div>

          <div class="space-y-2">
            {uploadedFiles().map((file, index) => (
              <div class="flex items-center justify-between rounded-md bg-gray-50 p-3">
                <div class="flex items-center space-x-3">
                  <svg
                    class="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{file.name}</p>
                    <p class="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  class="rounded p-1 text-red-600 hover:bg-red-50 hover:text-red-800"
                >
                  <svg
                    class="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
