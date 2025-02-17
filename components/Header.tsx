import { ClipWeaveIcon } from "./ClipWeaveIcon";

export const Header = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 py-4">
          <ClipWeaveIcon className="w-8 h-8" />
          <div>
            <h1 className="font-bold text-xl">ClipWeave</h1>
            <p className="text-sm text-muted-foreground">
              Seamlessly merge and edit your audio and video clips
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}; 