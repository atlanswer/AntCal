import ArrowUpOnSquare from "components/icons/ArrowUpOnSquare";
import ArrowUpOnSquareStack from "components/icons/ArrowUpOnSquareStack";
import DocumentChartBar from "components/icons/DocumentChartBar";
import { useNotifications } from "components/ui/useNotifications";
import { createSignal, For, onCleanup, onMount, Show } from "solid-js";

export interface FileUploadProps {
  /** File types to accept by extension, e.g., [".fld", ".json"] */
  accept?: string[];
  /** MIME types to accept as fallback */
  acceptMime?: string[];
  /** Whether multiple files can be uploaded */
  multiple?: boolean;
  /** Maximum file size in bytes (default: 10MB) */
  maxSize?: number;
  /** Maximum number of files allowed (default: 10) */
  maxFiles?: number;
  /** Callback when files are successfully uploaded and validated */
  onFilesDrop: (files: File[]) => void;
  /** Drag drop text override */
  dragDropText?: string;
  /** Button text override */
  buttonText?: string;
  /** Custom class for the upload area */
  uploadAreaClass?: string;
  /** Whether to hide uploaded files after successful upload */
  hideFilesAfterUpload?: boolean;
  /** Use compact mode (smaller UI) */
  compactMode?: boolean;
  /** Show currently uploaded file info */
  showCurrentFile?: boolean;
  /** Name of currently uploaded file */
  currentFileName?: string;
  /** Size of currently uploaded file */
  currentFileSize?: number;
  /** Whether to show file list (for multiple files) */
  showFileList?: boolean;
}

export default function FileUpload(props: FileUploadProps) {
  const [isDragging, setIsDragging] = createSignal(false);
  const [fileInputRef, setFileInputRef] = createSignal<HTMLInputElement>();
  const [uploadedFiles, setUploadedFiles] = createSignal<File[]>([]);
  const { addError } = useNotifications();

  const defaultAccept = props.accept || [".csv"];
  const defaultMime = props.acceptMime || [
    "text/plain",
    "application/octet-stream",
  ];
  const defaultMaxSize = props.maxSize || 10 * 1024 * 1024; // 10MB
  const defaultMaxFiles = props.maxFiles || 10;

  const accept = () => {
    const extensions = defaultAccept
      .map((ext) => ext.replace(/^\./, ""))
      .join(",");
    return extensions ? `.${extensions}` : "*/*";
  };

  const maxSize = () => defaultMaxSize;
  const maxFiles = () => defaultMaxFiles;

  const validateFile = (file: File): boolean => {
    // Check file extension
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    if (props.accept && !props.accept.includes(fileExtension)) {
      addError(
        "Invalid File Type",
        `Expected ${props.accept.join(", ")}, got ${fileExtension}`,
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

    // MIME type check (optional, for browsers that provide it)
    if (file.type && file.type !== "" && !defaultMime.includes(file.type)) {
      addError("Invalid File Type", `File type ${file.type} not supported`);
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
        props.hideFilesAfterUpload ? []
        : props.multiple ? [...prev, ...validFiles]
        : validFiles,
      );
      props.onFilesDrop(validFiles);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleGlobalDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer?.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      handleFiles(target.files);
      // Reset input value to allow re-selecting the same file
      target.value = "";
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

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div class="w-full">
      {/* Hidden file input */}
      <input
        ref={setFileInputRef}
        type="file"
        accept={accept()}
        multiple={props.multiple}
        onChange={handleFileInput}
        class="hidden"
      />

      <Show
        when={props.compactMode && props.currentFileName}
        fallback={
          <div
            class={`relative rounded-lg border-2 border-dashed bg-neutral-100 p-8 text-center transition-colors ${
              props.uploadAreaClass || ""
            }`}
            classList={{
              "border-sky-500 bg-sky-50": isDragging(),
              "border-neutral-300 hover:border-sky-400 hover:bg-neutral-300":
                !isDragging(),
            }}
            onClick={openFileDialog}
          >
            <div class="space-y-4">
              {/* Upload icon */}
              <div class="flex justify-center">
                <Show
                  when={props.multiple}
                  fallback={
                    <ArrowUpOnSquare
                      classList={{
                        "text-sky-500": isDragging(),
                        "text-gray-400": !isDragging(),
                      }}
                    />
                  }
                >
                  <ArrowUpOnSquareStack
                    classList={{
                      "text-sky-500": isDragging(),
                      "text-gray-400": !isDragging(),
                    }}
                  />
                </Show>
              </div>

              {/* Upload text */}
              <div>
                <p class="text-lg font-medium text-gray-900">
                  <Show
                    when={isDragging()}
                    fallback={props.dragDropText || "Upload Files"}
                  >
                    Drop files here
                  </Show>
                </p>
                <p class="text-sm text-gray-500">
                  Drag and drop {props.accept?.join(", ") || "files"} here, or
                  click to select files
                </p>
                <Show when={props.multiple}>
                  <p class="text-xs text-gray-400">
                    Up to {maxFiles()} files, max{" "}
                    {Math.round(maxSize() / 1024 / 1024)} MB each
                  </p>
                </Show>
              </div>

              {/* Browse button */}
              <button
                type="button"
                class="inline-flex cursor-pointer items-center rounded-md border border-transparent bg-sky-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-700 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none"
              >
                {props.buttonText || "Browse Files"}
              </button>
            </div>
          </div>
        }
      >
        <div
          class="relative flex items-center gap-3 rounded-lg border-2 border-dashed bg-neutral-100 p-4 transition-colors"
          classList={{
            "border-sky-500 bg-sky-50": isDragging(),
            "border-neutral-300 hover:border-sky-400 hover:bg-neutral-300":
              !isDragging(),
          }}
          onClick={openFileDialog}
        >
          {/* Left: File Section */}
          <div class="min-w-0 flex-1">
            {/* Current File Info */}
            <div class="mb-1 flex items-center space-x-2">
              <DocumentChartBar
                classList={{
                  "text-gray-400": true,
                  "shrink-0": true,
                }}
              />
              <div class="min-w-0">
                <p class="truncate text-sm font-medium text-gray-900">
                  Current: <code>{props.currentFileName}</code>
                  {props.currentFileSize && (
                    <span class="ml-1 text-xs text-gray-500">
                      ({formatFileSize(props.currentFileSize)})
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Uploaded Files List */}
            <Show when={props.showFileList && uploadedFiles().length > 0}>
              <div class="space-y-1">
                <div class="flex items-center justify-between text-xs text-gray-600">
                  <span>Uploaded ({uploadedFiles().length})</span>
                  <Show when={props.multiple}>
                    <button
                      type="button"
                      onClick={clearAllFiles}
                      class="text-red-600 hover:text-red-800"
                    >
                      Clear All
                    </button>
                  </Show>
                </div>
                <div class="max-h-24 space-y-1 overflow-y-auto">
                  <For each={uploadedFiles()}>
                    {(file, index) => (
                      <div class="flex items-center space-x-1 rounded bg-gray-50 p-1">
                        <DocumentChartBar
                          classList={{
                            "text-gray-400": true,
                            "shrink-0": true,
                          }}
                        />
                        <div class="min-w-0 flex-1">
                          <p class="truncate text-xs font-medium text-gray-900">
                            <code>{file.name}</code>
                          </p>
                          <p class="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index())}
                          class="shrink-0 rounded p-0.5 text-red-600 hover:bg-red-50 hover:text-red-800"
                        >
                          <svg
                            class="h-3 w-3"
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
                    )}
                  </For>
                </div>
              </div>
            </Show>
          </div>

          {/* Right: Upload Section */}
          <div class="shrink-0">
            <button
              type="button"
              class="inline-flex cursor-pointer items-center justify-center rounded-md border border-transparent bg-sky-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-sky-700 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none"
            >
              {props.buttonText || "Upload"}
            </button>
          </div>
        </div>
      </Show>

      {/* File list */}
      <Show
        when={
          props.showFileList && uploadedFiles().length > 0 && !props.compactMode
        }
      >
        <div class="mt-4 space-y-2">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-medium text-gray-900">
              Uploaded Files ({uploadedFiles().length})
            </h3>
            <Show when={props.multiple}>
              <button
                type="button"
                onClick={clearAllFiles}
                class="text-sm text-red-600 hover:text-red-800"
              >
                Clear All
              </button>
            </Show>
          </div>

          <div class="space-y-2">
            <For each={uploadedFiles()}>
              {(file, index) => (
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.707.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <div>
                      <p class="text-sm font-medium text-gray-900">
                        <code>{file.name}</code>
                      </p>
                      <p class="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFile(index())}
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
              )}
            </For>
          </div>
        </div>
      </Show>
    </div>
  );
}
