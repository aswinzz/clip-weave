export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        Privacy Policy
      </h1>
      
      <div className="prose prose-gray max-w-none">
        <h2 className="text-xl font-semibold mt-6 mb-4">Data Collection</h2>
        <p className="mb-4">
          ClipWeave is designed with privacy in mind. We do not collect, store, or transmit any of your media files or personal information.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-4">Local Processing</h2>
        <p className="mb-4">
          All media processing happens locally in your browser using WebAssembly technology. Your files never leave your device.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-4">Analytics</h2>
        <p className="mb-4">
          We use Vercel Analytics to collect anonymous usage data to improve our service. This includes basic metrics like page views and does not include any personal information.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-4">Cookies</h2>
        <p className="mb-4">
          ClipWeave does not use cookies for tracking. Any local storage used is purely for application functionality.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-4">Contact</h2>
        <p className="mb-4">
          For any privacy concerns, please contact us through our website.
        </p>
      </div>
    </div>
  );
} 