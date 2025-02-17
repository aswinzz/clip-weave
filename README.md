# ClipWeave

ClipWeave is a browser-based audio and video editing tool that allows you to seamlessly merge and edit media files directly in your browser. No downloads, no installations, and no data ever leaves your device.

![ClipWeave Screenshot](public/screenshot.png)

## Features

- 🎥 **Video Editing**: Cut and trim video files with frame-perfect accuracy
- 🎵 **Audio Editing**: Edit audio files with precise control
- 🔄 **Seamless Merging**: Combine video and audio files effortlessly
- 🔒 **100% Private**: All processing happens locally in your browser
- 🌐 **Browser-Based**: No downloads or installations required
- ⚡ **Fast Processing**: Powered by WebAssembly for native-like performance
- 💾 **Multiple Formats**: Supports MP4, WebM, MP3, WAV, and AAC
- 🎨 **Modern UI**: Clean, intuitive interface with responsive design

## How It Works

ClipWeave uses FFmpeg.wasm (WebAssembly version of FFmpeg) to handle media processing directly in your browser:

1. **File Selection**: Upload or drag & drop your media files
2. **Timeline Editing**: Use the interactive timeline to:
   - Cut unwanted sections
   - Set in/out points
   - Preview changes in real-time
3. **Processing**: Choose to either:
   - Process individual files with cuts
   - Merge video and audio files together
4. **Download**: Get your edited file instantly

## Local Development Setup

### Prerequisites

- Node.js 18.x or higher
- pnpm (recommended) or npm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/clipweave.git
cd clipweave
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

4. Open your browser and navigate to `http://localhost:3000` to access the tool.




## Technical Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Media Processing**: FFmpeg.wasm
- **Deployment**: Vercel
- **Analytics**: Vercel Analytics

## Browser Support

ClipWeave works best in modern browsers that support WebAssembly:
- Chrome/Edge (Recommended)
- Firefox
- Safari

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Credits

- FFmpeg.wasm for the WebAssembly build of FFmpeg
- Shadcn for the beautiful UI components
- Vercel for hosting and deployment

## Author

Made with ❤️ by [Aswin VB](https://aswinvb.com)
