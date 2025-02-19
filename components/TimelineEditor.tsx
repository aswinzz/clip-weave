"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { ZoomIn, ZoomOut, Scissors } from "lucide-react"
import { Button } from "@/components/ui/button"


export interface MediaFile {
    file: File;
    type: "video" | "audio";
    url: string;
    duration?: number;
    startTime?: number;
    endTime?: number;
    segments?: { start: number; end: number }[];
  }
  

interface TimelineEditorProps {
  mediaFiles: MediaFile[];
  onSeek: (time: number, type: "video" | "audio") => void;
  onCut: (type: "video" | "audio", segment: { start: number; end: number }) => void;
  isProcessing: boolean;
}

const TimelineEditor: React.FC<TimelineEditorProps> = ({ mediaFiles, onSeek, onCut, isProcessing }) => {
  const [zoom, setZoom] = useState(1)
  const [videoTime, setVideoTime] = useState(0)
  const [audioTime, setAudioTime] = useState(0)
  const [videoInPoint, setVideoInPoint] = useState<number | null>(null)
  const [videoOutPoint, setVideoOutPoint] = useState<number | null>(null)
  const [audioInPoint, setAudioInPoint] = useState<number | null>(null)
  const [audioOutPoint, setAudioOutPoint] = useState<number | null>(null)

  const mediaFile = mediaFiles[0];
  const type = mediaFile.type;
  
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Track video playback
  useEffect(() => {
    const video = document.querySelector('video')
    if (video) {
      videoRef.current = video
      const updateVideoTime = () => setVideoTime(video.currentTime)
      video.addEventListener('timeupdate', updateVideoTime)
      return () => video.removeEventListener('timeupdate', updateVideoTime)
    }
  }, [mediaFiles])

  // Track audio playback
  useEffect(() => {
    const audio = document.querySelector('audio')
    if (audio) {
      audioRef.current = audio
      const updateAudioTime = () => setAudioTime(audio.currentTime)
      audio.addEventListener('timeupdate', updateAudioTime)
      return () => audio.removeEventListener('timeupdate', updateAudioTime)
    }
  }, [mediaFiles])

  const handleCut = (type: "video" | "audio") => {
    if (type === "video" && videoInPoint !== null && videoOutPoint !== null) {
      onCut("video", { start: videoInPoint, end: videoOutPoint });
      setVideoInPoint(null);
      setVideoOutPoint(null);
    } else if (type === "audio" && audioInPoint !== null && audioOutPoint !== null) {
      onCut("audio", { start: audioInPoint, end: audioOutPoint });
      setAudioInPoint(null);
      setAudioOutPoint(null);
    }
  }

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>, type: "video" | "audio") => {
    const timeline = e.currentTarget;
    const rect = timeline.getBoundingClientRect();
    const scrollContainer = timeline.parentElement;
    const scrollOffset = scrollContainer ? scrollContainer.scrollLeft : 0;
    
    // Calculate position considering scroll and zoom
    const clickX = e.clientX - rect.left + scrollOffset;
    const clickPosition = clickX / rect.width; // Use original width for position
    
    const file = mediaFile;
    if (!file?.duration) return;
    
    const newTime = clickPosition * file.duration;
    const roundedTime = Math.round(newTime * 100) / 100; // Round to 2 decimal places
    
    if (type === "video") {
      if (videoInPoint === null) {
        setVideoInPoint(roundedTime);
        onSeek(roundedTime, type);
      } else if (videoOutPoint === null) {
        if (roundedTime > videoInPoint) {
          setVideoOutPoint(roundedTime);
          onSeek(roundedTime, type);
        }
      } else {
        setVideoInPoint(roundedTime);
        setVideoOutPoint(null);
        onSeek(roundedTime, type);
      }
    } else {
      if (audioInPoint === null) {
        setAudioInPoint(roundedTime);
        onSeek(roundedTime, type);
      } else if (audioOutPoint === null) {
        if (roundedTime > audioInPoint) {
          setAudioOutPoint(roundedTime);
          onSeek(roundedTime, type);
        }
      } else {
        setAudioInPoint(roundedTime);
        setAudioOutPoint(null);
        onSeek(roundedTime, type);
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    const milliseconds = Math.floor((time % 1) * 100)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`
  }

  const renderTimeline = (type: "video" | "audio") => {
    const file = mediaFile;
    const currentTime = type === "video" ? videoTime : audioTime;
    const inPoint = type === "video" ? videoInPoint : audioInPoint;
    const outPoint = type === "video" ? videoOutPoint : audioOutPoint;
    
    if (!file?.duration) return null;

    return (
      <div className="w-full bg-white rounded-lg shadow-lg p-4 border border-indigo-100">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setZoom(z => Math.max(z - 0.1, 0.5))}
              className="border-indigo-200 hover:bg-indigo-50"
            >
              <ZoomOut className="h-4 w-4 text-indigo-500" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setZoom(z => Math.min(z + 0.1, 2))} 
              className="ml-2 border-indigo-200 hover:bg-indigo-50"
            >
              <ZoomIn className="h-4 w-4 text-indigo-500" />
            </Button>
          </div>
          <span className="text-sm text-gray-600">
            {formatTime(type === "video" ? videoTime : audioTime)} / 
            {formatTime(mediaFile.duration || 0)}
          </span>
        </div>

        <div className="relative h-20 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-md">
          <div
            className="relative h-full w-full"
            style={{ 
              width: `${100 * zoom}%`,
              minWidth: '100%'
            }}
            onClick={(e) => handleTimelineClick(e, type)}
          >
            <div
              className={`absolute top-0 ${
                type === "video" 
                  ? "bg-gradient-to-r from-indigo-200/20 to-purple-200/20" 
                  : "bg-gradient-to-r from-purple-200/20 to-pink-200/20"
              } h-full w-full`}
            />

            {inPoint !== null && outPoint !== null && (
              <div
                className="absolute top-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 h-full"
                style={{
                  left: `${(inPoint / file.duration) * 100}%`,
                  width: `${((outPoint - inPoint) / file.duration) * 100}%`
                }}
              />
            )}

            <div 
              className="absolute top-0 w-0.5 h-full bg-primary" 
              style={{ left: `${(currentTime / file.duration) * 100}%` }} 
            />

            {inPoint !== null && (
              <div 
                className="absolute top-0 w-0.5 h-full bg-yellow-500" 
                style={{ left: `${(inPoint / file.duration) * 100}%` }} 
              >
                <span className="absolute top-0 left-2 text-xs bg-yellow-500 px-1 rounded">
                  {formatTime(inPoint)}
                </span>
              </div>
            )}
            {outPoint !== null && (
              <div 
                className="absolute top-0 w-0.5 h-full bg-yellow-500" 
                style={{ left: `${(outPoint / file.duration) * 100}%` }} 
              >
                <span className="absolute top-0 left-2 text-xs bg-yellow-500 px-1 rounded">
                  {formatTime(outPoint)}
                </span>
              </div>
            )}

            {[...Array(Math.ceil(6 * zoom))].map((_, i) => (
              <div 
                key={i} 
                className="absolute bottom-0 w-px h-2 bg-muted-foreground" 
                style={{ left: `${(i * 20) / zoom}%` }} 
              >
                <span className="absolute bottom-3 text-xs transform -translate-x-1/2 whitespace-nowrap bg-white/80 px-1 rounded">
                  {formatTime((i * (file.duration || 0)) / (5 * zoom))}
                </span>
              </div>
            ))}
          </div>
        </div>

        {inPoint !== null && outPoint !== null && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleCut(type)}
            disabled={isProcessing}
            className="w-full border-indigo-200 hover:bg-indigo-50 text-indigo-600"
          >
            {isProcessing ? (
              "Processing..."
            ) : (
              <>
                <Scissors className="h-4 w-4 mr-2" />
                Cut {formatTime(outPoint - inPoint)} from timeline
              </>
            )}
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="w-full bg-background rounded-lg shadow-lg p-4">
      {renderTimeline(type)}
    </div>
  )
}

export default TimelineEditor

