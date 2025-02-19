export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        Terms of Service
      </h1>
      
      <div className="prose prose-gray max-w-none">
        <h2 className="text-xl font-semibold mt-6 mb-4">1. Introduction</h2>
        <p className="mb-4">
          By using ClipWeave, you agree to these terms. ClipWeave is a browser-based tool for editing media files.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-4">2. Service Description</h2>
        <p className="mb-4">
          ClipWeave provides media editing capabilities directly in your browser. All processing is done locally on your device.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-4">3. User Responsibilities</h2>
        <p className="mb-4">
          You are responsible for any media files you edit using ClipWeave. Ensure you have the rights to edit and use these files.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-4">4. Privacy & Data</h2>
        <p className="mb-4">
          ClipWeave processes all files locally in your browser. We do not store or transmit your media files to any servers.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-4">5. Limitations</h2>
        <p className="mb-4">
          ClipWeave is provided "as is" without any warranties. We are not responsible for any data loss or issues arising from using the service.
        </p>
      </div>
    </div>
  );
} 