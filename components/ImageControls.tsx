import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  ToolGroupManager,
  Enums as csToolsEnums,
  ZoomTool,
  PanTool,
  WindowLevelTool,
} from "@cornerstonejs/tools";

const { MouseBindings } = csToolsEnums;

interface Props {
  toolGroupId: string;
}

export default function ImageControls({ toolGroupId }: Props) {
  const [activeTool, setActiveTool] = useState<string | null>(
    ZoomTool.toolName
  ); // Default to Zoom
  const [showToast, setShowToast] = useState<string | null>(null);
  const toolGroup = ToolGroupManager.getToolGroup(toolGroupId);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleZoom = () => {
    if (typeof window === "undefined" || !toolGroup) {
      console.error("ToolGroup not ready for Zoom activation");
      return;
    }
    toolGroup.setToolActive(ZoomTool.toolName, {
      bindings: [{ mouseButton: MouseBindings.Primary }],
    });
    setActiveTool(ZoomTool.toolName);
    setShowToast("Zoom tool activated");
    console.log("Zoom tool activated");
  };

  const handlePan = () => {
    if (typeof window === "undefined" || !toolGroup) {
      console.error("ToolGroup not ready for Pan activation");
      return;
    }
    toolGroup.setToolActive(PanTool.toolName, {
      bindings: [{ mouseButton: MouseBindings.Primary }],
    });
    setActiveTool(PanTool.toolName);
    setShowToast("Pan tool activated");
    console.log("Pan tool activated");
  };

  const handleWindowLevel = () => {
    if (typeof window === "undefined" || !toolGroup) {
      console.error("ToolGroup not ready for WindowLevel activation");
      return;
    }
    toolGroup.setToolActive(WindowLevelTool.toolName, {
      bindings: [{ mouseButton: MouseBindings.Primary }],
    });
    setActiveTool(WindowLevelTool.toolName);
    setShowToast("Window Level tool activated");
    console.log("Window Level tool activated");
  };

  const buttonVariants = {
    hover: { scale: 1.1, backgroundColor: "#60A5FA" },
    tap: { scale: 0.95 },
    active: { backgroundColor: "#3B82F6" },
  };

  const toastVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="relative flex flex-col gap-3 p-4 bg-gray-900 rounded-lg shadow-lg">
      {showToast && (
        <motion.div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm shadow-lg"
          variants={toastVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          {showToast}
        </motion.div>
      )}

      <div className="flex gap-3">
        <motion.button
          onClick={handleZoom}
          className={`p-3 text-white rounded-lg shadow-md ${
            activeTool === ZoomTool.toolName ? "bg-blue-700" : "bg-blue-600"
          }`}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          animate={activeTool === ZoomTool.toolName ? "active" : ""}
          transition={{ type: "spring", stiffness: 300 }}
        >
          Zoom
        </motion.button>
        <motion.button
          onClick={handlePan}
          className={`p-3 text-white rounded-lg shadow-md ${
            activeTool === PanTool.toolName ? "bg-blue-700" : "bg-blue-600"
          }`}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          animate={activeTool === PanTool.toolName ? "active" : ""}
          transition={{ type: "spring", stiffness: 300 }}
        >
          Pan
        </motion.button>
        <motion.button
          onClick={handleWindowLevel}
          className={`p-3 text-white rounded-lg shadow-md ${
            activeTool === WindowLevelTool.toolName
              ? "bg-blue-700"
              : "bg-blue-600"
          }`}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          animate={activeTool === WindowLevelTool.toolName ? "active" : ""}
          transition={{ type: "spring", stiffness: 300 }}
        >
          Window Level
        </motion.button>
      </div>
    </div>
  );
}
