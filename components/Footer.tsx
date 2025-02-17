export const Footer = () => {
  return (
    <footer className="border-t mt-8">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ClipWeave. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with FFmpeg and Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}; 