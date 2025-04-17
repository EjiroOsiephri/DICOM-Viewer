import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import {
  useDropzone,
  type FileRejection,
  type DropEvent,
} from "react-dropzone";

interface Props {
  onDrop: (acceptedFiles: File[]) => void;
}

export default function FileDropZone({ onDrop }: Props) {
  const [droppedFiles, setDroppedFiles] = useState<File[]>([]); // State to store dropped files

  const onDropHandler = useCallback(
    (
      acceptedFiles: File[],
      fileRejections: FileRejection[],
      event: DropEvent
    ) => {
      console.log("Files dropped:", acceptedFiles); // Log dropped files for debugging
      if (acceptedFiles.length > 0) {
        setDroppedFiles(acceptedFiles); // Update state with dropped files
        onDrop(acceptedFiles); // Pass files to parent component
      }
      if (fileRejections.length > 0) {
        console.warn("Files rejected:", fileRejections); // Log rejected files
      }
    },
    [onDrop]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropHandler,
    accept: {
      "application/dicom": [".dcm"],
    },
    multiple: true, // Allow multiple files for better usability
    onDragEnter: () => console.log("Drag enter"), // Debug drag events
    onDragOver: () => console.log("Drag over"),
    onDragLeave: () => console.log("Drag leave"),
  });

  // Type assertion to ensure compatibility with HTML input attributes
  const inputProps =
    getInputProps() as React.InputHTMLAttributes<HTMLInputElement>;

  return (
    <div className="space-y-2">
      <motion.div
        {...getRootProps({ onDragStart: undefined })}
        className={`border-2 border-dashed border-gray-600 p-4 rounded-lg text-center transition-colors backdrop-blur-sm ${
          isDragActive ? "bg-blue-900/50 border-blue-400" : "bg-gray-700/50"
        }`}
        whileHover={{ borderColor: "#60A5FA" }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300 }}
        onAnimationStart={() => {}} // Explicitly handle onAnimationStart
      >
        <input {...inputProps} />
        <p className="text-gray-300 text-sm">
          {isDragActive
            ? "Drop the DICOM file here!"
            : "Drag & drop a DICOM file, or click to select"}
        </p>
      </motion.div>

      {/* Display dropped file names with animation */}
      {droppedFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-3 bg-gray-800/80 backdrop-blur-sm rounded-lg text-gray-200 text-sm"
        >
          <p className="font-semibold text-blue-400">Successfully Dropped:</p>
          <ul className="list-disc list-inside">
            {droppedFiles.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
}
