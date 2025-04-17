import dynamic from "next/dynamic";

const DicomViewer = dynamic(() => import("../components/DicomViewer"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <DicomViewer />
    </main>
  );
}
