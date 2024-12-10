import React from 'react';

export default function Overlay() {
  return (
    <div
      className="fixed inset-0 bg-black backdrop-blur-md flex flex-col items-center justify-center z-50"
      style={{ display: window.innerWidth < 70 ? 'flex' : 'none' }}
    >
      <video
        className="z-10 w-1/3 h-1/3 object-cover mb-4"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="SadFace.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="relative text-center text-white">
        <h1 className="text-2xl md:text-4xl font-bold mb-4">
          Browser Window Too Small
        </h1>
        <p className="text-lg md:text-xl">
          Please open this website on a PC for the best experience.
        </p>
      </div>
    </div>
  );
}