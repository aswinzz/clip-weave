import { useState, useEffect } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

export function useFFmpeg() {
  const [ffmpeg, setFFmpeg] = useState<FFmpeg | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    let ffmpegInstance: FFmpeg | null = null;
    let urls: string[] = [];

    const initFFmpeg = async () => {
      try {
        console.log("Initializing FFmpeg instance...");
        ffmpegInstance = new FFmpeg();
        if (!mounted) return;

        setFFmpeg(ffmpegInstance);

        console.log("Fetching FFmpeg assets...");
        const coreURL = await toBlobURL("/ffmpeg/ffmpeg-core.js", "text/javascript");
        const wasmURL = await toBlobURL("/ffmpeg/ffmpeg-core.wasm", "application/wasm");
        urls = [coreURL, wasmURL];

        console.log("Core URL:", coreURL);
        console.log("WASM URL:", wasmURL);

        if (!mounted) return;

        ffmpegInstance.on('log', ({ message }) => {
          console.log("FFmpeg Log:", message);
        });
        console.log("Starting FFmpeg loading...");
        await ffmpegInstance.load({
          coreURL,
          wasmURL,
        });

        console.log("✅ FFmpeg successfully loaded!");
        if (mounted) {
          setIsLoaded(true);
        }

        // ✅ Extra Debugging: Check if FFmpeg responds
        try {
          const versionResult = await ffmpegInstance.exec(["-version"]);
          console.log("FFmpeg Version:", versionResult);
        } catch (versionError) {
          console.error("⚠️ FFmpeg version check failed:", versionError);
          setIsLoaded(false);
        }
      } catch (error) {
        console.error("❌ Error during FFmpeg loading:", error);
        if (mounted) {
          setIsLoaded(false);
        }
      }
    };

    initFFmpeg();

    return () => {
      console.log("Unmounting FFmpeg...");
      mounted = false;
      if (ffmpegInstance) {
        ffmpegInstance.terminate();
      }
      urls.forEach(URL.revokeObjectURL);
    };
  }, []);

  return { ffmpeg, isLoaded };
}
