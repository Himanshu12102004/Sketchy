import React, { useState } from 'react';
import SVG from '../../CanvasLogic/svgComputation/calculatePoint';
import { imageReceiver } from '../../CanvasLogic/main';

function SideBar() {
  const [droppedFiles, setDroppedFiles] = useState<File[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setDroppedFiles(Array.from(files));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    setDroppedFiles(Array.from(files));
  };

  const handleUpload = () => {
    if (droppedFiles.length > 0) {
      imageReceiver(droppedFiles[0]);
    } else {
      alert('Please select or drop a file first.');
    }
  };

  return (
    <div className="w-full h-full bg-gray-100 p-4 border-gray-300 flex flex-col justify-center items-center">
      <p className="text-gray-600 mb-4 text-center">
        Upload any SVG that you draw:
      </p>

      <div
        className="w-full h-64 bg-gray-200 border-2 border-dashed border-gray-400 flex flex-col justify-center items-center"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <label
          htmlFor="fileInput"
          className="cursor-pointer text-white bg-blue-500 py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition duration-200"
        >
          Browse File
        </label>

        <input
          id="fileInput"
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        {droppedFiles.length > 0 && (
          <ul className="space-y-2 mt-4">
            {droppedFiles.map((file, index) => (
              <li key={index} className="text-gray-800">
                {file.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={handleUpload}
        className="mt-4 px-6 py-3 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 transition duration-200"
      >
        Upload
      </button>
    </div>
  );
}

export default SideBar;
