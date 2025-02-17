import { Loader2 } from "lucide-react";

export const LoadingOverlay = ({ message = "Processing..." }: { message?: string }) => {
  return (
    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
      <div className="text-white flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="text-sm">{message}</span>
      </div>
    </div>
  );
}; 