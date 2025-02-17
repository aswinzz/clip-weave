"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

interface MediaFile {
  file: File;
  type: "video" | "audio";
  url: string;
  duration?: number;
  startTime?: number;
  endTime?: number;
}

interface TimelineProps {
  mediaFiles: MediaFile[];
  onTimeUpdate: (type: "video" | "audio", startTime: number, endTime: number) => void;
  duration: number;
}

export function Timeline({ mediaFiles, onTimeUpdate, duration }: TimelineProps) {
  const [videoTrim, setVideoTrim] = useState([0, duration]);
  const [audioTrim, setAudioTrim] = useState([0, duration]);
  const [audioOffset, setAudioOffset] = useState(0);

  const handleVideoTrimChange = (values: number[]) => {
    setVideoTrim(values);
    onTimeUpdate("video", values[0], values[1]);
  };

  const handleAudioTrimChange = (values: number[]) => {
    setAudioTrim(values);
    onTimeUpdate("audio", values[0], values[1]);
  };

  return (
    <Card className="p-4 mb-4">
      <div className="space-y-6">
        {mediaFiles.map((media) => (
          <div key={media.file.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {media.type === "video" ? "Video" : "Audio"}: {media.file.name}
              </span>
              <span className="text-sm text-muted-foreground">
                {media.type === "video" 
                  ? `${videoTrim[0].toFixed(1)}s - ${videoTrim[1].toFixed(1)}s`
                  : `${audioTrim[0].toFixed(1)}s - ${audioTrim[1].toFixed(1)}s`}
              </span>
            </div>
            
            <Slider
              defaultValue={media.type === "video" ? videoTrim : audioTrim}
              max={duration}
              step={0.1}
              onValueChange={media.type === "video" ? handleVideoTrimChange : handleAudioTrimChange}
              className="w-full"
            />

            {media.type === "audio" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Audio Offset</span>
                  <span className="text-sm text-muted-foreground">
                    {audioOffset.toFixed(1)}s
                  </span>
                </div>
                <Slider
                  defaultValue={[audioOffset]}
                  min={-duration}
                  max={duration}
                  step={0.1}
                  onValueChange={([value]) => setAudioOffset(value)}
                  className="w-full"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
} 