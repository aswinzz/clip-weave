import Link from "next/link";
import { ClipWeaveIcon } from "@/components/ClipWeaveIcon";

export const Header = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <ClipWeaveIcon className="h-6 w-6 text-indigo-500" />
          <span className="font-semibold text-lg bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            ClipWeave
          </span>
        </Link>
      </div>
    </header>
  );
}; 