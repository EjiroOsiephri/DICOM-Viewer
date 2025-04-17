import { motion } from "framer-motion";

interface Metadata {
  patientId: string;
  studyDate: string;
}

export default function MetadataDisplay({
  metadata,
}: {
  metadata: Metadata | null;
}) {
  if (!metadata) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 bg-gray-800 rounded-lg shadow-lg text-gray-200"
    >
      <h3 className="font-bold text-lg mb-2">Metadata</h3>
      <p>Patient ID: {metadata.patientId || "N/A"}</p>
      <p>Study Date: {metadata.studyDate || "N/A"}</p>
    </motion.div>
  );
}
