import {
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { ImageIcon, PlusIcon, Trash2Icon, UploadCloudIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/classnames.utils";

type ImageDimensionLimits = {
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
};

type ImageUploadCopy = {
  title?: ReactNode;
  description?: ReactNode;
  browse?: ReactNode;
  addMore?: ReactNode;
  remove?: string;
  invalidType?: string;
  tooManyFiles?: string;
  minWidth?: string;
  minHeight?: string;
  maxWidth?: string;
  maxHeight?: string;
};

type ImageUploadProps = {
  value: File[];
  onValueChange: (files: File[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  accept?: string;
  disabled?: boolean;
  className?: string;
  limits?: ImageDimensionLimits;
  copy?: ImageUploadCopy;
};

type PreviewImage = {
  id: string;
  file: File;
  url: string;
};

const DEFAULT_COPY = {
  title: "Drop images here",
  description: "PNG, JPG, or WebP",
  browse: "Choose image",
  addMore: "Add more",
  remove: "Remove image",
  invalidType: "Only image files are supported.",
  tooManyFiles: "Too many images selected.",
  minWidth: "Image is narrower than the required width.",
  minHeight: "Image is shorter than the required height.",
  maxWidth: "Image is wider than the allowed width.",
  maxHeight: "Image is taller than the allowed height.",
} satisfies Required<ImageUploadCopy>;

async function getImageDimensions(file: File) {
  const url = URL.createObjectURL(file);

  try {
    const image = new Image();
    const loadedImage = await new Promise<HTMLImageElement>(
      (resolve, reject) => {
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = url;
      },
    );

    return {
      width: loadedImage.naturalWidth,
      height: loadedImage.naturalHeight,
    };
  } finally {
    URL.revokeObjectURL(url);
  }
}

function hasDimensionLimits(limits?: ImageDimensionLimits) {
  return (
    limits?.minWidth !== undefined ||
    limits?.minHeight !== undefined ||
    limits?.maxWidth !== undefined ||
    limits?.maxHeight !== undefined
  );
}

async function validateImageFile(
  file: File,
  limits: ImageDimensionLimits | undefined,
  copy: Required<ImageUploadCopy>,
) {
  if (!file.type.startsWith("image/")) {
    return copy.invalidType;
  }

  if (!hasDimensionLimits(limits)) {
    return null;
  }

  const dimensions = await getImageDimensions(file);

  if (limits?.minWidth !== undefined && dimensions.width < limits.minWidth) {
    return copy.minWidth;
  }

  if (limits?.minHeight !== undefined && dimensions.height < limits.minHeight) {
    return copy.minHeight;
  }

  if (limits?.maxWidth !== undefined && dimensions.width > limits.maxWidth) {
    return copy.maxWidth;
  }

  if (limits?.maxHeight !== undefined && dimensions.height > limits.maxHeight) {
    return copy.maxHeight;
  }

  return null;
}

function ImageUpload({
  value,
  onValueChange,
  multiple = false,
  maxFiles,
  accept = "image/*",
  disabled = false,
  className,
  limits,
  copy,
}: ImageUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resolvedCopy = { ...DEFAULT_COPY, ...copy };
  const fileLimit = multiple ? maxFiles : 1;

  const previews = useMemo(
    () =>
      value.map((file, index) => ({
        id: `${file.name}-${file.lastModified}-${index}`,
        file,
        url: URL.createObjectURL(file),
      })),
    [value],
  );

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);

  async function addFiles(nextFileList: FileList | File[]) {
    const incomingFiles = Array.from(nextFileList);

    if (incomingFiles.length === 0 || disabled) {
      return;
    }

    const filesForMode = multiple ? incomingFiles : incomingFiles.slice(0, 1);
    const nextFiles = multiple ? [...value, ...filesForMode] : filesForMode;

    if (fileLimit !== undefined && nextFiles.length > fileLimit) {
      setError(resolvedCopy.tooManyFiles);
      return;
    }

    const validFiles: File[] = [];

    for (const file of filesForMode) {
      const validationError = await validateImageFile(
        file,
        limits,
        resolvedCopy,
      );

      if (validationError !== null) {
        setError(validationError);
        return;
      }

      validFiles.push(file);
    }

    setError(null);
    onValueChange(multiple ? [...value, ...validFiles] : validFiles);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    void addFiles(event.target.files ?? []);
    event.target.value = "";
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();

    if (!disabled) {
      setIsDragging(true);
    }
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    void addFiles(event.dataTransfer.files);
  }

  function removeFile(fileToRemove: PreviewImage) {
    setError(null);
    onValueChange(value.filter((file) => file !== fileToRemove.file));
  }

  return (
    <div className={cn("flex min-w-0 flex-col gap-3", className)}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        aria-disabled={disabled}
        className={cn(
          "flex min-h-44 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-input/20 px-4 py-6 text-center transition-colors",
          "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
          isDragging && "border-primary bg-primary/5",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleInputChange}
          className="sr-only"
          aria-hidden="true"
          tabIndex={-1}
        />
        <span className="flex size-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          <UploadCloudIcon className="size-5" />
        </span>
        <span className="flex flex-col gap-1">
          <span className="text-sm font-medium text-foreground">
            {resolvedCopy.title}
          </span>
          <span className="text-sm text-muted-foreground">
            {resolvedCopy.description}
          </span>
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={(event) => {
            event.stopPropagation();
            inputRef.current?.click();
          }}
        >
          {value.length > 0 && multiple ? (
            <PlusIcon data-icon="inline-start" />
          ) : (
            <ImageIcon data-icon="inline-start" />
          )}
          {value.length > 0 && multiple
            ? resolvedCopy.addMore
            : resolvedCopy.browse}
        </Button>
      </div>

      {error !== null && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {previews.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {previews.map((preview) => (
            <li
              key={preview.id}
              className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
            >
              <img
                src={preview.url}
                alt={preview.file.name}
                className="size-full object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon-sm"
                aria-label={`${resolvedCopy.remove}: ${preview.file.name}`}
                className="absolute top-2 right-2 opacity-90 shadow-sm"
                onClick={() => removeFile(preview)}
              >
                <Trash2Icon />
              </Button>
              <span className="absolute inset-x-0 bottom-0 truncate bg-background/90 px-2 py-1 text-xs text-foreground">
                {preview.file.name}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export { ImageUpload };
export type { ImageDimensionLimits, ImageUploadProps };
