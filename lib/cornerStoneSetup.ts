import { init as csRenderInit } from "@cornerstonejs/core";
import {
  init as csToolsInit,
  addTool,
  PanTool,
  ZoomTool,
  WindowLevelTool,
} from "@cornerstonejs/tools";
import { init as dicomImageLoaderInit } from "@cornerstonejs/dicom-image-loader";

export const initializeCornerstone = async () => {
  if (typeof window === "undefined") return;

  await csRenderInit();
  await csToolsInit();
  dicomImageLoaderInit({ maxWebWorkers: 1 });

  // Add tools for zoom, pan, and window leveling
  addTool(PanTool);
  addTool(ZoomTool);
  addTool(WindowLevelTool);
};
