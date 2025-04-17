"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RenderingEngine, Enums, Types } from "@cornerstonejs/core";
import {
  ToolGroupManager,
  Enums as csToolsEnums,
  ZoomTool,
  PanTool,
  WindowLevelTool,
} from "@cornerstonejs/tools";
import cornerstoneDICOMImageLoader from "@cornerstonejs/dicom-image-loader";
import dicomParser from "dicom-parser";
import createImageIdsAndCacheMetaData from "../lib/createImageIdsAndCacheMetaData";
import { initializeCornerstone } from "../lib/cornerStoneSetup";
import ImageControls from "./ImageControls";
import MetadataDisplay from "../components/MetaDataDisplay";
import FileDropZone from "./FileDropZone";

const { ViewportType } = Enums;
const { MouseBindings } = csToolsEnums;

const toolGroupId = "ToolGroup_DicomViewer";
const viewportId = "DICOM_VIEWPORT";

export default function DicomViewer() {
  const [imageIds, setImageIds] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [metadata, setMetadata] = useState<{
    patientId: string;
    studyDate: string;
  } | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);
  const renderingEngineRef = useRef<RenderingEngine | null>(null);
  const running = useRef(false);

  useEffect(() => {
    const setup = async () => {
      if (running.current || typeof window === "undefined") return;
      running.current = true;

      try {
        await initializeCornerstone();

        const preLoadedImageIds = await createImageIdsAndCacheMetaData({
          StudyInstanceUID:
            "1.3.6.1.4.1.14519.5.2.1.7009.2403.334240657131972136850343327463",
          SeriesInstanceUID:
            "1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561",
          wadoRsRoot: "https://d3t6nz73ql33tx.cloudfront.net/dicomweb",
        });

        setImageIds(preLoadedImageIds);

        const meta = cornerstoneDICOMImageLoader.wadors.metaDataManager.get(
          preLoadedImageIds[0]
        );
        if (meta) {
          setMetadata({
            patientId: meta["00100020"]?.Value?.[0] || "N/A",
            studyDate: meta["00080020"]?.Value?.[0] || "N/A",
          });
        }

        const renderingEngineId = "dicomRenderingEngine";
        renderingEngineRef.current = new RenderingEngine(renderingEngineId);

        const viewportInput = {
          viewportId,
          type: ViewportType.STACK,
          element: elementRef.current!,
          defaultOptions: {
            orientation: Enums.OrientationAxis.AXIAL,
          },
        };

        renderingEngineRef.current.enableElement(viewportInput);

        const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
        if (toolGroup) {
          // Add tools to the tool group
          toolGroup.addTool(ZoomTool.toolName);
          toolGroup.addTool(PanTool.toolName);
          toolGroup.addTool(WindowLevelTool.toolName);

          // Set initial active tool
          toolGroup.setToolActive(ZoomTool.toolName, {
            bindings: [{ mouseButton: MouseBindings.Primary }],
          });

          toolGroup.addViewport(viewportId, renderingEngineId);
          console.log("ToolGroup setup complete:", toolGroup);
        } else {
          console.error("Failed to create ToolGroup");
        }

        const viewport = renderingEngineRef.current.getViewport(
          viewportId
        ) as Types.IStackViewport;
        await viewport.setStack(preLoadedImageIds, 0);
        viewport.render();
      } catch (error) {
        console.error("Error during setup:", error);
      }
    };

    setup();

    return () => {
      renderingEngineRef.current?.destroy();
    };
  }, []);

  const handleFileDrop = async (files: File[]) => {
    if (typeof window === "undefined" || !renderingEngineRef.current) return;
    if (files.length === 0) {
      console.error("No files dropped or files were rejected");
      return;
    }

    const newImageIds: string[] = [];
    for (const file of files) {
      const imageId = `wadouri:${URL.createObjectURL(file)}`;
      newImageIds.push(imageId);

      try {
        const arrayBuffer = await file.arrayBuffer();
        const byteArray = new Uint8Array(arrayBuffer);
        const dataSet = dicomParser.parseDicom(byteArray);

        const dicomMetaData: { [key: string]: any } = {};
        for (const tag in dataSet.elements) {
          const element = dataSet.elements[tag];
          dicomMetaData[tag] = {
            Value: element.items
              ? element.items.map((item: any) => item.dataSet.string(tag))
              : [dataSet.string(tag)],
            vr: element.vr || "UN",
          };
        }

        cornerstoneDICOMImageLoader.wadors.metaDataManager.add(
          imageId,
          dicomMetaData
        );

        if (newImageIds.length === 1) {
          const meta =
            cornerstoneDICOMImageLoader.wadors.metaDataManager.get(imageId);
          if (meta) {
            setMetadata({
              patientId: meta["00100020"]?.Value?.[0] || "N/A",
              studyDate: meta["00080020"]?.Value?.[0] || "N/A",
            });
          }
        }
      } catch (error) {
        console.error("Error processing file:", file.name, error);
      }
    }

    setImageIds(newImageIds);
    setCurrentIndex(0);

    try {
      const viewport = renderingEngineRef.current.getViewport(
        viewportId
      ) as Types.IStackViewport;
      await viewport.setStack(newImageIds, 0);
      viewport.render();
    } catch (error) {
      console.error("Error updating viewport with new stack:", error);
    }
  };

  const handleNext = () => {
    if (currentIndex < imageIds.length - 1) {
      setCurrentIndex(currentIndex + 1);
      const viewport = renderingEngineRef.current?.getViewport(
        viewportId
      ) as Types.IStackViewport;
      viewport?.setImageIdIndex(currentIndex + 1);
      viewport?.render();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      const viewport = renderingEngineRef.current?.getViewport(
        viewportId
      ) as Types.IStackViewport;
      viewport?.setImageIdIndex(currentIndex - 1);
      viewport?.render();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200 flex"
    >
      {/* Sidebar */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
        className="w-80 p-6 bg-gray-800/90 backdrop-blur-md border-r border-gray-700 flex flex-col space-y-6"
      >
        <h2 className="text-xl font-semibold text-blue-400">DICOM Viewer</h2>

        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <FileDropZone onDrop={handleFileDrop} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <ImageControls toolGroupId={toolGroupId} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col space-y-3"
        >
          <div className="flex items-center justify-between text-sm bg-gray-700/50 p-2 rounded-lg">
            <span>
              Frame: {currentIndex + 1} / {imageIds.length}
            </span>
          </div>
          <div className="flex space-x-3">
            <motion.button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex-1 p-3 bg-blue-600 text-white rounded-lg disabled:opacity-50 shadow-md"
              whileHover={{ scale: 1.05, backgroundColor: "#60A5FA" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Previous
            </motion.button>
            <motion.button
              onClick={handleNext}
              disabled={currentIndex === imageIds.length - 1}
              className="flex-1 p-3 bg-blue-600 text-white rounded-lg disabled:opacity-50 shadow-md"
              whileHover={{ scale: 1.05, backgroundColor: "#60A5FA" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Next
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <MetadataDisplay metadata={metadata} />
        </motion.div>
      </motion.div>

      <motion.div
        className="flex-1 p-6 flex items-center justify-center"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 120 }}
      >
        <motion.div
          className="relative bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <div ref={elementRef} className="w-[800px] h-[600px] rounded-xl" />
          <motion.div
            className="absolute top-4 left-4 bg-gray-900/80 backdrop-blur-sm p-3 rounded-lg text-sm font-medium text-gray-300 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            Frame: {currentIndex + 1} / {imageIds.length}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
