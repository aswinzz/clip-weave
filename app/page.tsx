import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { FeaturesSection } from "@/components/ui/features-section";
import { Scissors, GitMerge, Lock, Sparkles, Globe, Ban } from "lucide-react";
import { ClipWeaveIcon } from "@/components/ClipWeaveIcon";


export default function LandingPage() {
  const features = [
    {
      icon: <Scissors className="h-6 w-6 text-indigo-400" />,
      title: "Cut with Precision",
      description: "Trim your audio and video files with frame-perfect accuracy"
    },
    {
      icon: <GitMerge className="h-6 w-6 text-purple-400" />,
      title: "Seamless Merging",
      description: "Combine audio and video files effortlessly"
    },
    {
      icon: <Lock className="h-6 w-6 text-pink-400" />,
      title: "100% Private",
      description: "All processing happens in your browser - no data ever leaves your device"
    },
    {
      icon: <Globe className="h-6 w-6 text-indigo-400" />,
      title: "Browser-Based",
      description: "No downloads or installations required - works instantly in your browser"
    },
    {
      icon: <Sparkles className="h-6 w-6 text-purple-400" />,
      title: "Completely Free",
      description: "No hidden costs, subscriptions, or premium features - everything is free"
    },
    {
      icon: <Ban className="h-6 w-6 text-pink-400" />,
      title: "No Watermarks",
      description: "Your content remains clean and professional - no watermarks added"
    }
  ];

  return (
    <>
      <div className="relative w-full min-h-[40rem] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-purple-50">
        <BackgroundBeams className="opacity-20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-8">
            <div className="flex flex-col items-center gap-2">
              <ClipWeaveIcon className="w-12 h-12 text-indigo-500" />
              <div className="text-xl font-semibold text-indigo-500">
                ClipWeave
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-7xl font-bold">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                  Edit Media with Ease
                </span>
              </h1>
              <p className="text-lg md:text-xl text-black-400 max-w-lg mx-auto">
                Cut, merge, and perfect your media files
                <span className="text-indigo-400"> directly in your browser</span>
              </p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <Link href="/tool">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium px-8 h-12 rounded-full hover:from-indigo-600 hover:to-purple-600 transition-all border-0 shadow-lg hover:shadow-indigo-500/25"
                >
                  Start Editing
                </Button>
              </Link>
              <span className="text-sm text-gray-500">No signup required • 100% free</span>
            </div>

            {/* <div className="flex flex-wrap justify-center gap-3 mt-12">
              <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-sm px-4 py-1 rounded-full text-sm text-indigo-300 flex items-center gap-2 border border-indigo-500/20">
                <Lock className="w-4 h-4" />
                <span>100% Private</span>
              </div>
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm px-4 py-1 rounded-full text-sm text-purple-300 flex items-center gap-2 border border-purple-500/20">
                <Globe className="w-4 h-4" />
                <span>Browser-Based</span>
              </div>
              <div className="bg-gradient-to-r from-pink-500/10 to-indigo-500/10 backdrop-blur-sm px-4 py-1 rounded-full text-sm text-pink-300 flex items-center gap-2 border border-pink-500/20">
                <Sparkles className="w-4 h-4" />
                <span>No Watermarks</span>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <div className="relative z-10 bg-gradient-to-b from-purple-50 to-pink-50">
        <FeaturesSection features={features} />
      </div>

      <div className="w-full pt-20 pb-20 p-4 relative bg-gradient-to-r from-indigo-50/50 via-transparent to-purple-50/50">
        {/* <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 via-transparent to-purple-50/50 rounded-3xl" /> */}
        <div className="relative">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-10">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              How It Works
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg border border-indigo-100 bg-gradient-to-b from-white to-indigo-50/50 hover:shadow-lg hover:shadow-indigo-100 transition-all">
              <div className="text-lg font-semibold mb-2 text-indigo-600">1. Upload</div>
              <p className="text-gray-600">
                Drag and drop your files or click to select. Supports MP4, WebM, MP3, WAV, and more.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-purple-100 bg-gradient-to-b from-white to-purple-50/50 hover:shadow-lg hover:shadow-purple-100 transition-all">
              <div className="text-lg font-semibold mb-2 text-purple-600">2. Edit</div>
              <p className="text-gray-600">
                Use the intuitive timeline to cut unwanted sections or merge audio with video.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-pink-100 bg-gradient-to-b from-white to-pink-50/50 hover:shadow-lg hover:shadow-pink-100 transition-all">
              <div className="text-lg font-semibold mb-2 text-pink-600">3. Download</div>
              <p className="text-gray-600">
                Get your edited file instantly. No quality loss, no watermarks, no restrictions.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center p-4 pt-20 pb-20 bg-gradient-to-b from-pink-50 to-indigo-50">
        <h2 className="text-2xl md:text-4xl font-bold mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            Ready to Start?
          </span>
        </h2>
        <p className="text-gray-600 mb-8 max-w-lg mx-auto">
          Join thousands of users who trust ClipWeave for their media editing needs.
          No account required.
        </p>
        <Link href="/tool">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium px-8 h-12 rounded-full hover:from-indigo-600 hover:to-purple-600 transition-all border-0 shadow-lg hover:shadow-indigo-500/25"
          >
            Try ClipWeave Now
          </Button>
        </Link>
      </div>
    </>
  );
}
