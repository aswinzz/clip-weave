"use client";
import React, { useCallback, useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetchFile } from "@ffmpeg/util";
import TimelineEditor from "@/components/TimelineEditor";
import { useFFmpeg } from "@/hooks/useFFmpeg";
import { PlayCircle, PauseCircle, Volume2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { Header } from "@/components/Header";
import { MediaFile } from "@/components/TimelineEditor";

export default function ToolPage() {
  const { ffmpeg, isLoaded: isFFmpegLoaded } = useFFmpeg();
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [processingMedia, setProcessingMedia] = useState<"video" | "audio" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add effect to track media play state
  useEffect(() => {
    const video = document.querySelector('video');
    const audio = document.querySelector('audio');

    const handleVideoPlay = () => setIsVideoPlaying(true);
    const handleVideoPause = () => setIsVideoPlaying(false);
    const handleAudioPlay = () => setIsAudioPlaying(true);
    const handleAudioPause = () => setIsAudioPlaying(false);

    video?.addEventListener('play', handleVideoPlay);
    video?.addEventListener('pause', handleVideoPause);
    audio?.addEventListener('play', handleAudioPlay);
    audio?.addEventListener('pause', handleAudioPause);

    return () => {
      video?.removeEventListener('play', handleVideoPlay);
      video?.removeEventListener('pause', handleVideoPause);
      audio?.removeEventListener('play', handleAudioPlay);
      audio?.removeEventListener('pause', handleAudioPause);
    };
  }, [mediaFiles]);

  // Add handleFileSelect function
  const handleFileSelect = useCallback(async (files: FileList) => {
    const newMediaFiles = await Promise.all(
      Array.from(files).map(async (file) => {
        const type = file.type.startsWith("video") ? "video" : "audio";
        const url = URL.createObjectURL(file);
        
        // Create media element to get duration
        const element = document.createElement(type);
        element.src = url;
        
        return new Promise<MediaFile>((resolve) => {
          element.onloadedmetadata = () => {
            resolve({
              file,
              type,
              url,
              duration: element.duration,
              startTime: 0,
              endTime: element.duration,
              segments: [],
            });
          };
        });
      })
    );

    setMediaFiles((prev) => [...prev, ...newMediaFiles]);
  }, []);

  // Update handleDrop to use handleFileSelect
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  // Add handleClick for the button
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file merge
  const handleMerge = async () => {
    if (!ffmpeg || !isFFmpegLoaded) {
      console.error("FFmpeg not ready");
      return;
    }

    if (mediaFiles.length === 0) {
      console.error("No files to process");
      return;
    }

    setIsProcessing(true);

    try {
      // Case 1: Single media file (video or audio)
      if (mediaFiles.length === 1) {
        const media = mediaFiles[0];
        
        try {
          // Generate unique filenames
          const timestamp = Date.now();
          const inputExt = media.file.name.split('.').pop() || (media.type === 'video' ? 'mp4' : 'mp3');
          const inputFile = `input_${timestamp}.${inputExt}`;
          const outputFile = `output_${timestamp}.${inputExt}`;

          // Write input file with a fresh buffer
          console.log("Writing input file...");
          const inputBuffer = await fetchFile(media.file);
          await ffmpeg.writeFile(inputFile, inputBuffer);

          if (media.segments && media.segments.length > 0) {
            if (media.type === 'video') {
              // Video processing command
              const command = [
                '-i', inputFile,
                '-vf', `select='not(between(t,${media.segments[0].start},${media.segments[0].end}))',setpts=N/FRAME_RATE/TB`,
                '-af', `aselect='not(between(t,${media.segments[0].start},${media.segments[0].end}))',asetpts=N/SR/TB`,
                '-c:v', 'libx264',
                '-c:a', 'aac',
                '-preset', 'ultrafast',
                outputFile
              ];

              console.log("Executing video processing command:", command.join(' '));
              await ffmpeg.exec(command);
            } else {
              // Audio processing command
              const command = [
                '-i', inputFile,
                '-filter_complex',
                `[0:a]atrim=start=0:end=${media.segments[0].start},asetpts=PTS-STARTPTS[a1];` +
                `[0:a]atrim=start=${media.segments[0].end}:end=${media.duration},asetpts=PTS-STARTPTS[a2];` +
                `[a1][a2]concat=n=2:v=0:a=1[outa]`,
                '-map', '[outa]',
                '-c:a', 'libmp3lame',
                '-b:a', '192k',
                outputFile
              ];

              console.log("Executing audio processing command:", command.join(' '));
              await ffmpeg.exec(command);
            }
          } else {
            // No cuts, just copy
            await ffmpeg.exec([
              '-i', inputFile,
              '-c', 'copy',
              outputFile
            ]);
          }

          // Read the output file
          console.log("Reading output file...");
          const data = await ffmpeg.readFile(outputFile);

          // Clean up files
          try {
            await ffmpeg.deleteFile(inputFile);
            await ffmpeg.deleteFile(outputFile);
          } catch (e) {
            console.warn("Failed to delete temporary files:", e);
          }

          if (!data || data.length === 0) {
            throw new Error("Generated file is empty");
          }

          const blob = new Blob([data], { 
            type: media.type === 'video' ? 'video/mp4' : 'audio/mpeg' 
          });

          // Create download
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `processed_${media.file.name}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

        } catch (error) {
          console.error("Error processing file:", error);
          throw error;
        }
      } 
      // Case 2: Video and Audio merge
      else if (mediaFiles.length === 2) {
        try {
          console.log("Starting merge process...");
          
          const videoFile = mediaFiles.find((m) => m.type === "video");
          const audioFile = mediaFiles.find((m) => m.type === "audio");

          if (!videoFile || !audioFile) {
            throw new Error("Missing video or audio file");
          }

          // Create unique filenames with proper extensions
          const timestamp = Date.now();
          const inputVideo = `input_video_${timestamp}.mp4`;
          const processedVideo = `processed_video_${timestamp}.mp4`;
          const inputAudio = `input_audio_${timestamp}.mp3`;
          const processedAudio = `processed_audio_${timestamp}.aac`;
          const outputFile = `output_${timestamp}.mp4`;

          // Write input files
          console.log("Writing input files...");
          const videoBuffer = await fetchFile(videoFile.file);
          const audioBuffer = await fetchFile(audioFile.file);
          await ffmpeg.writeFile(inputVideo, videoBuffer);
          await ffmpeg.writeFile(inputAudio, audioBuffer);

          // Process video if it has cuts
          if (videoFile.segments && videoFile.segments.length > 0) {
            console.log("Processing video cuts...");
            const videoCommand = [
              '-i', inputVideo,
              '-vf', `select='not(between(t,${videoFile.segments[0].start},${videoFile.segments[0].end}))',setpts=N/FRAME_RATE/TB`,
              '-af', `aselect='not(between(t,${videoFile.segments[0].start},${videoFile.segments[0].end}))',asetpts=N/SR/TB`,
              '-c:v', 'libx264',
              '-c:a', 'aac',
              '-preset', 'ultrafast',
              processedVideo
            ];
            await ffmpeg.exec(videoCommand);
            await ffmpeg.deleteFile(inputVideo);
          } else {
            // No cuts, just rename
            await ffmpeg.exec(['-i', inputVideo, '-c', 'copy', processedVideo]);
            await ffmpeg.deleteFile(inputVideo);
          }

          // Process audio if it has cuts
          if (audioFile.segments && audioFile.segments.length > 0) {
            console.log("Processing audio cuts...");
            const audioCommand = [
              '-i', inputAudio,
              '-filter_complex',
              `[0:a]atrim=start=0:end=${audioFile.segments[0].start},asetpts=PTS-STARTPTS[a1];` +
              `[0:a]atrim=start=${audioFile.segments[0].end}:end=${audioFile.duration},asetpts=PTS-STARTPTS[a2];` +
              `[a1][a2]concat=n=2:v=0:a=1[outa]`,
              '-map', '[outa]',
              '-c:a', 'aac',
              '-b:a', '192k',
              processedAudio
            ];
            await ffmpeg.exec(audioCommand);
            await ffmpeg.deleteFile(inputAudio);
          } else {
            // No cuts, just convert to AAC
            await ffmpeg.exec([
              '-i', inputAudio,
              '-c:a', 'aac',
              '-b:a', '192k',
              processedAudio
            ]);
            await ffmpeg.deleteFile(inputAudio);
          }

          // Merge processed files
          console.log("Merging processed files...");
          const command = [
            '-i', processedVideo,
            '-i', processedAudio,
            '-c:v', 'copy',
            '-c:a', 'copy',
            '-map', '0:v:0',
            '-map', '1:a:0',
            outputFile
          ];

          console.log("Executing merge command:", command.join(" "));
          await ffmpeg.exec(command);

          // Read the output
          console.log("Reading output file...");
          const data = await ffmpeg.readFile(outputFile);

          // Clean up all files
          const filesToClean = [processedVideo, processedAudio, outputFile];
          for (const file of filesToClean) {
            try {
              await ffmpeg.deleteFile(file);
            } catch (e) {
              console.warn(`Failed to delete ${file}:`, e);
            }
          }

          if (!data || data.length === 0) {
            throw new Error("Generated file is empty");
          }

          const blob = new Blob([data], { type: 'video/mp4' });
          console.log("Output file size:", blob.size, "bytes");

          // Create download
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `merged_${timestamp}.mp4`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          console.log("Merge completed successfully");

        } catch (error) {
          console.error("Error during merge:", error);
          throw error;
        }
      }

    } catch (error) {
      console.error("Error during processing:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = useCallback(() => {
    // Clean up existing media URLs
    mediaFiles.forEach(media => URL.revokeObjectURL(media.url));
    // Reset all states
    setMediaFiles([]);
    setIsProcessing(false);
    setIsVideoPlaying(false);
    setIsAudioPlaying(false);
  }, [mediaFiles]);

  // Update the handleCut function to properly handle media duration
  const handleCut = useCallback(async (type: "video" | "audio", segment: { start: number; end: number }) => {
    const media = mediaFiles.find(m => m.type === type);
    if (!media || !media.duration) return;

    try {
      if (!ffmpeg || !isFFmpegLoaded) {
        console.error("FFmpeg not ready");
        return;
      }

      setIsProcessing(true);
      setProcessingMedia(type);

      // Generate unique filenames with proper extensions
      const inputExt = media.file.name.split('.').pop() || (type === 'video' ? 'mp4' : 'mp3');
      const inputFileName = `input_${Date.now()}.${inputExt}`;
      const outputFileName = `output_${Date.now()}.${inputExt}`;

      console.log("Writing input file...");
      const fileData = await fetchFile(media.file);
      await ffmpeg.writeFile(inputFileName, fileData);

      // Log file info
      console.log("Input file details:", {
        name: inputFileName,
        size: fileData.length,
        type: media.file.type
      });

      // Video cutting with a single filter
      if (type === 'video') {
        const concatCommand = [
          '-i', inputFileName,
          '-vf', `select='not(between(t,${segment.start},${segment.end}))',setpts=N/FRAME_RATE/TB`,
          '-af', `aselect='not(between(t,${segment.start},${segment.end}))',asetpts=N/SR/TB`,
          '-c:v', 'libx264',
          '-c:a', 'aac',
          '-preset', 'ultrafast',
          outputFileName
        ];

        console.log("Executing video cut command:", concatCommand.join(' '));
        await ffmpeg.exec(concatCommand);
      } else {
        // Audio-only case - keep parts before and after the cut
        const cutAudioCommand = [
          '-i', inputFileName,
          '-filter_complex',
          `[0:a]atrim=start=0:end=${segment.start},asetpts=PTS-STARTPTS[a1];` +
          `[0:a]atrim=start=${segment.end}:end=${media.duration},asetpts=PTS-STARTPTS[a2];` +
          `[a1][a2]concat=n=2:v=0:a=1[outa]`,
          '-map', '[outa]',
          '-c:a', 'libmp3lame',
          '-b:a', '192k',
          '-y',
          outputFileName
        ];

        console.log("Executing FFmpeg command:", cutAudioCommand.join(' '));
        await ffmpeg.exec(cutAudioCommand);
      }

      console.log("Reading output file...");
      const data = await ffmpeg.readFile(outputFileName);
      
      // Clean up FFmpeg files
      await ffmpeg.deleteFile(inputFileName);
      await ffmpeg.deleteFile(outputFileName);

      if (!data || data.length === 0) {
        throw new Error("Generated file is empty");
      }

      const blob = new Blob(
        [data], 
        { type: type === 'video' ? 'video/mp4' : 'audio/mpeg' }
      );

      if (blob.size === 0) {
        throw new Error("Generated blob is empty");
      }

      console.log("Generated file size:", blob.size, "bytes");
      const newUrl = URL.createObjectURL(blob);

      // Update mediaFiles with the new version
      setMediaFiles(prev => prev.map(m => {
        if (m.type === type) {
          URL.revokeObjectURL(m.url);
          const newDuration = (m.duration || 0) - (segment.end - segment.start);
          return {
            ...m,
            url: newUrl,
            segments: [...(m.segments || []), segment],
            duration: newDuration,
            // Update end time to reflect new duration
            endTime: newDuration
          };
        }
        return m;
      }));

      // Update the media element and set its duration
      const element = document.querySelector(type === 'video' ? 'video' : 'audio') as HTMLMediaElement;
      if (element) {
        element.src = newUrl;
        element.currentTime = 0;
        // Wait for metadata to load to ensure duration is set
        await new Promise<void>((resolve) => {
          element.onloadedmetadata = () => {
            resolve();
          };
        });
      }

    } catch (error) {
      console.error('Error applying cuts:', error);
      console.error('Error details:', error instanceof Error ? error.message : error);
      console.error('Full error object:', error);
    } finally {
      setIsProcessing(false);
      setProcessingMedia(null);
    }
  }, [ffmpeg, isFFmpegLoaded, mediaFiles]);

  // Sort media files to ensure video comes before audio
  const sortedMediaFiles = [...mediaFiles].sort((a) => 
    a.type === "video" ? -1 : 1
  );

  // Update the button section
  const getButtonText = () => {
    if (!isFFmpegLoaded) return "Loading FFmpeg...";
    if (isProcessing) return "Processing...";
    if (mediaFiles.length === 2) return "Merge Files";
    return "Process File";
  };

  return (
    <>
      <Header />
      <div className="container mx-auto p-4">
        {mediaFiles.length === 0 ? (
          <Card
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-dashed border-2 border-indigo-200 p-8 text-center mb-4 bg-gradient-to-b from-indigo-50/50 to-purple-50/50"
          >
            <CardContent className="flex flex-col items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*,audio/*"
                multiple
                className="hidden"
                onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
              />
              <div className="p-4 rounded-lg">
                <p className="mb-2 text-lg font-semibold text-indigo-700">
                  Drag and drop video/audio files here
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Supports .mp4, .webm, .mp3, .wav, .aac
                </p>
                <div className="border-t border-indigo-100 pt-4">
                  <Button 
                    onClick={handleClick}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all"
                  >
                    Select Files
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Media Preview */}
            {sortedMediaFiles.map((media, index) => (
              <Card key={index} className="p-4 border-indigo-100 bg-gradient-to-r from-indigo-50/30 via-transparent to-purple-50/30">
                {media.type === "video" ? (
                  <div className="space-y-4">
                    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                      <video
                        src={media.url}
                        className="w-full h-full"
                        playsInline
                        controls={false}
                      />
                      {processingMedia === "video" && (
                        <LoadingOverlay message="Processing video cut..." />
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-2 flex justify-between items-center bg-gradient-to-t from-black/80 to-transparent">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:text-white/80"
                          onClick={() => {
                            const video = document.querySelector('video');
                            if (video?.paused) video.play();
                            else video?.pause();
                          }}
                        >
                          {isVideoPlaying ? (
                            <PauseCircle className="h-6 w-6" />
                          ) : (
                            <PlayCircle className="h-6 w-6" />
                          )}
                        </Button>
                        <div className="flex items-center gap-2 text-white">
                          <Volume2 className="h-4 w-4" />
                          <Slider
                            className="w-24"
                            defaultValue={[100]}
                            max={100}
                            step={1}
                            onValueChange={([value]) => {
                              const video = document.querySelector('video');
                              if (video) video.volume = value / 100;
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    {/* Video Timeline */}
                    <TimelineEditor
                      mediaFiles={[media]}
                      onSeek={(time, type) => {
                        if (type === "video") {
                          const video = document.querySelector('video');
                          if (video) video.currentTime = time;
                        } else {
                          const audio = document.querySelector('audio');
                          if (audio) audio.currentTime = time;
                        }
                      }}
                      onCut={handleCut}
                      isProcessing={isProcessing}
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                      <audio
                        src={media.url}
                        className="hidden"
                        controls={false}
                      />
                      {processingMedia === "audio" && (
                        <LoadingOverlay message="Processing audio cut..." />
                      )}
                      <div className="absolute inset-0 p-2 flex justify-between items-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const audio = document.querySelector('audio');
                            if (audio?.paused) audio.play();
                            else audio?.pause();
                          }}
                        >
                          {isAudioPlaying ? (
                            <PauseCircle className="h-6 w-6" />
                          ) : (
                            <PlayCircle className="h-6 w-6" />
                          )}
                        </Button>
                        <div className="flex items-center gap-2">
                          <Volume2 className="h-4 w-4" />
                          <Slider
                            className="w-24"
                            defaultValue={[100]}
                            max={100}
                            step={1}
                            onValueChange={([value]) => {
                              const audio = document.querySelector('audio');
                              if (audio) audio.volume = value / 100;
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    {/* Audio Timeline */}
                    <TimelineEditor
                      mediaFiles={[media]}
                      onSeek={(time, type) => {
                        if (type === "video") {
                          const video = document.querySelector('video');
                          if (video) video.currentTime = time;
                        } else {
                          const audio = document.querySelector('audio');
                          if (audio) audio.currentTime = time;
                        }
                      }}
                      onCut={handleCut}
                      isProcessing={isProcessing}
                    />
                  </div>
                )}
                <p className="mt-2 text-sm text-gray-600">{media.file.name}</p>
              </Card>
            ))}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={handleMerge}
                disabled={!isFFmpegLoaded || isProcessing}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all"
              >
                {getButtonText()}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={isProcessing}
                className="w-24 border-indigo-200 hover:bg-indigo-50 transition-all"
              >
                Restart
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}