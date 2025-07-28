import React from 'react';
import SpinnerIcon from './icons/SpinnerIcon';
import WallpaperIcon from './icons/WallpaperIcon';

interface ImageDisplayProps {
  isLoading: boolean;
  error: string | null;
  imageUrl: string | null;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ isLoading, error, imageUrl }) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-violet-400">
          <SpinnerIcon className="w-16 h-16" />
          <p className="mt-4 text-lg font-medium">Generating your masterpiece...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-red-400 p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="mt-4 text-lg font-semibold">Generation Failed</p>
          <p className="mt-2 text-sm text-slate-400 max-w-md">{error}</p>
        </div>
      );
    }

    if (imageUrl) {
      return (
        <img src={imageUrl} alt="Generated minimalist wallpaper" className="w-full h-full object-cover" />
      );
    }

    // Initial state (This part will not be visible in the new UI logic, but kept for component integrity)
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-600">
        <WallpaperIcon className="w-24 h-24" />
        <p className="mt-4 text-lg">Your wallpaper will appear here</p>
      </div>
    );
  };

  return (
    <div className="aspect-w-16 aspect-h-9 w-full bg-gray-950/60 rounded-2xl overflow-hidden shadow-2xl shadow-black/30 border border-gray-800 backdrop-blur-xl transition-all duration-500">
      {renderContent()}
    </div>
  );
};

export default ImageDisplay;