# DICOM Viewer

A web-based DICOM Viewer built with React, TypeScript, and Cornerstone3D (version 2.0.beta), allowing users to view, navigate, and interact with DICOM medical images. Features include drag-and-drop file loading, image navigation (Previous/Next), and interactive tools (Zoom, Pan, Window Level) with user-friendly feedback via toast notifications. This is a template for a simple Next.js project with TypeScript, ESLint, Prettier, utilizing the [Cornerstone3D](https://github.com/cornerstonejs/cornerstone3D-beta) library for rendering.

## Features

- **Drag-and-Drop File Loading**: Upload DICOM (`.dcm`) files by dragging and dropping them into the app.
- **Image Navigation**: Navigate through multiple DICOM images using Previous and Next buttons.
- **Interactive Tools**:
  - **Zoom**: Click and drag up to zoom in, down to zoom out.
  - **Pan**: Click and drag to move the image within the viewport.
  - **Window Level**: Click and drag left/right to adjust contrast, up/down to adjust brightness.
- **User Feedback**: Toast notifications and button highlighting to indicate active tools.
- **Metadata Display**: View patient ID and study date extracted from DICOM files.
- **Responsive UI**: Built with Tailwind CSS and Framer Motion for smooth animations and a modern glassmorphism design.

## Getting Started

There are two routes:

1. `/` which shows a volume viewport - to make sure the Cornerstone3D is working.

## Prerequisites

Before running the application locally, ensure you have the following installed:

- **Node.js** (v16 or higher): [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** (optional): [Yarn Installation](https://yarnpkg.com/getting-started/install)

## Installation and Running Locally

Follow these steps to set up and run the DICOM Viewer on your local machine:

1. **Clone the Repository**:  
   git clone https://github.com/EjiroOsiephri/DICOM-Viewer.git

cd DICOM-Viewer

2. **Install Dependencies**:  
   Install the required Node.js packages using npm:

npm install
npm run dev

Alternatively, if you prefer Yarn:

yarn dev

This will start the app on `http://localhost:3000` (or another port if 3000 is in use). Open this URL in your browser to view the app.

4. **Test with a DICOM File**:

- The app initially loads pre-loaded DICOM images from a public dataset.
- To test with your own DICOM file:
  - Download a sample `.dcm` file (e.g., from [DICOM Library](https://www.dicomlibrary.com/)).
  - Drag and drop the `.dcm` file into the drop zone in the app.
- The viewport should update to display the new image, replacing any existing images.

5. **Interact with the App**:

- Use the "Previous" and "Next" buttons to navigate between images (if multiple images are loaded).
- Use the Zoom, Pan, and Window Level buttons to interact with the image:
  - **Zoom**: Click and drag up to zoom in, down to zoom out.
  - **Pan**: Click and drag to move the image.
  - **Window Level**: Click and drag left/right to adjust contrast, up/down to adjust brightness.
- Check the console (F12 > Console) for logs if you encounter issues.

## Libraries and Tools Used

The DICOM Viewer was built using the following libraries and tools:

- **React**: JavaScript library for building user interfaces. [Link](https://reactjs.org/)
- **TypeScript**: Adds static typing to JavaScript for better code reliability. [Link](https://www.typescriptlang.org/)
- **Next.js**: React framework for server-side rendering and static site generation (used implicitly with `"use client"` directive). [Link](https://nextjs.org/)
- **Cornerstone3D (v2.0.beta)**: Core library for rendering and interacting with DICOM images.
  - `@cornerstonejs/core`: Core rendering engine. [Link](https://www.cornerstonejs.org/)
  - `@cornerstonejs/tools`: Provides interactive tools like Zoom, Pan, and WindowLevel. [Link](https://www.cornerstonejs.org/)
  - `@cornerstonejs/dicom-image-loader`: Loads DICOM images for rendering. [Link](https://www.cornerstonejs.org/)
- **dicom-parser**: Parses DICOM files to extract metadata (e.g., patient ID, study date). [Link](https://github.com/cornerstonejs/dicom-parser)
- **Framer Motion**: Animation library for smooth UI transitions and effects (e.g., button animations, toast notifications). [Link](https://www.framer.com/motion/)
- **react-dropzone**: Handles drag-and-drop file uploads. [Link](https://react-dropzone.js.org/)
- **Tailwind CSS**: Utility-first CSS framework for styling the UI with a modern glassmorphism design. [Link](https://tailwindcss.com/)
- **Vite** (optional, if used instead of Next.js default setup): Build tool for fast development and production builds. [Link](https://vitejs.dev/)
- **Node.js & npm**: Runtime environment and package manager for JavaScript. [Link](https://nodejs.org/)
- **ESLint**: Linting tool for identifying and fixing code issues. [Link](https://eslint.org/)
- **Prettier**: Code formatter for consistent code style. [Link](https://prettier.io/)

## Project Structure

Here’s a high-level overview of the key files in the project:

- **`src/components/DicomViewer.tsx`**: Main component that sets up the DICOM viewer, renders the viewport, and handles image navigation and file loading.
- **`src/components/ImageControls.tsx`**: Component for interactive tools (Zoom, Pan, Window Level) with toast notifications and active tool highlighting.
- **`src/components/FileDropZone.tsx`**: Drag-and-drop component for uploading DICOM files with success feedback.
- **`src/components/MetaDataDisplay.tsx`**: Displays DICOM metadata (patient ID, study date).
- **`src/lib/createImageIdsAndCacheMetaData.ts`**: Utility to fetch pre-loaded DICOM image IDs.
- **`src/lib/cornerStoneSetup.ts`**: Initializes `cornerstone.js` for rendering DICOM images.

## Troubleshooting

- **Viewport is Blank**:
  - Ensure a valid `.dcm` file is loaded (drag and drop a sample file).
  - Check the console for errors (e.g., CORS issues with pre-loaded images or parsing errors).
  - Verify the `wadoRsRoot` URL in `DicomViewer.tsx` is accessible.
- **Tools Don’t Work**:
  - Check the console for errors like "Tool [name] not added to toolGroup".
  - Ensure the viewport element is receiving mouse events (no overlapping elements with `pointer-events` blocking).
- **CORS Errors**:
  - If pre-loaded images fail to load, the `wadoRsRoot` URL might be inaccessible. Test with a local `.dcm` file instead.
  - For local files, ensure you’re running the app locally (`npm run dev`) to avoid CORS issues with `URL.createObjectURL`.

## Future Improvements

- Add support for multi-frame DICOM files.
- Implement a reset button to clear the viewport and loaded images.
- Add keyboard shortcuts for navigation and tool activation.
- Integrate a toast library (e.g., `react-hot-toast`) for more polished notifications.
- Add loading spinners during image loading for better UX.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
