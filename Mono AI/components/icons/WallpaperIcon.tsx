
import React from 'react';

const WallpaperIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M4.5 3.75a3 3 0 00-3 3v10.5a3 3 0 003 3h15a3 3 0 003-3V6.75a3 3 0 00-3-3h-15z" clipRule="evenodd" />
    <path fill="#fff" fillOpacity="0.2" d="M8.25 12a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0z" />
    <path fill="#fff" fillOpacity="0.4" d="M16.5 6.75a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
  </svg>
);

export default WallpaperIcon;
