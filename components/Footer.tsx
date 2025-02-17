export const Footer = () => {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ClipWeave. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Made with ❤️ by</span>
            <a 
              href="https://aswinvb.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-500 hover:text-indigo-600 transition-colors"
            >
              Aswin VB
            </a>
          </div>
          <p className="text-sm text-muted-foreground">
            Built with FFmpeg and Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}; 