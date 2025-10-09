import { useRef, useState } from "react";
import { FileText } from "lucide-react";
import { Label } from "@/components/ui/label";

interface FileUploadBoxProps {
  label: string;
  accept?: string;
  maxSizeMB?: number;
  onFileSelect?: (file: File | null) => void;
  selectedFile?: File | null;  // Thêm prop selectedFile từ parent
  onRemove?: () => void;  // Thêm callback remove
}

export default function FileUploadBox({
  label,
  accept = ".pdf,.doc,.docx",
  maxSizeMB = 10,
  onFileSelect,
  selectedFile,  // Nhận từ parent
  onRemove,  // Nhận từ parent
}: FileUploadBoxProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File must be smaller than ${maxSizeMB}MB`);
        onFileSelect?.(null);
      } else {
        setError(null);
        onFileSelect?.(file);
      }
    }
  };

  const handleRemove = () => {
    onRemove?.();  // Gọi callback từ parent
  };

  // Sử dụng selectedFile từ prop thay vì state internal
  const fileToDisplay = selectedFile;

  return (
    <div>
      <Label>{label}</Label>
      <div
        onClick={handleClick}
        className={`mt-2 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          error ? "border-red-500" : "border-border hover:border-primary"
        }`}
      >
        {fileToDisplay ? (
          <>
            <FileText className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium text-primary">
              {fileToDisplay.name}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {(fileToDisplay.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="text-xs text-red-500 underline mt-2"
            >
              Remove file
            </button>
          </>
        ) : (
          <>
            <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Upload {label}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {accept.replaceAll(".", "").toUpperCase()} up to {maxSizeMB}MB
            </p>
          </>
        )}
      </div>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

      <input
        type="file"
        accept={accept}
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}