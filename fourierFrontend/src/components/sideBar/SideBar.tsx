import React, { useEffect, useState } from 'react';
import { imageReceiver } from '../../CanvasLogic/main';
import VectorList from '../vectorList/VectorList';
import Welcome from '../welocme/Welcome';
import Settings from '../entireDrawingSettings/Settings';
// import CustomSlider from '../slider/slider';
function SideBar() {
  const defaultImage = 'default.svg'; // Path to your default image
  const [droppedFiles, setDroppedFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string>(defaultImage);
  const [imageNumber, setImageNumber] = useState(0);
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setDroppedFiles(fileArray);
      setPreviewUrl(URL.createObjectURL(fileArray[0]));
      setImageNumber(1 + imageNumber);
    }
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    const fileArray = Array.from(files);
    setDroppedFiles(fileArray);
    setPreviewUrl(URL.createObjectURL(fileArray[0]));
  };
  useEffect(() => {
    if (droppedFiles.length > 0) handleUpload();
  }, [droppedFiles]);
  const handleUpload = () => {
    if (droppedFiles.length > 0) {
      imageReceiver(droppedFiles[0]);
    } else {
      alert('Please select or drop a file first.');
    }
  };
  return (
    <div
      className="px-5 h-screen overflow-y-auto bg-gray-100 text-gray-700"
      style={{ fontFamily: 'Roboto, sans-serif' }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Welcome />
      <div className="w-full pt-3">
        <hr />
        <div className="text-lg font-medium mb-2 pt-2 pb-1">
          Selected Image:
        </div>
        <div className="flex justify-center items-center h-52 border border-gray-300 bg-white rounded-md">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Selected"
              className="h-full object-contain"
            />
          ) : (
            <p className="text-gray-500">No image selected</p>
          )}
        </div>
        <div className="mt-4">
          <p className="mb-2 text-sm text-center text-gray-500">
            Drag and drop an image or select one to start drawing.
          </p>
          <div className="flex flex-col items-center pb-2">
            <label
              htmlFor="fileInput"
              className="cursor-pointer text-white bg-blue-500 py-2 px-3 rounded-md shadow-md hover:bg-blue-600 transition duration-200 text-center mb-2 text-sm"
            >
              Browse File and Draw
            </label>
          </div>
          <input
            id="fileInput"
            type="file"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        <hr />
        {/* <CustomSlider
          min={0}
          max={1}
          defaultValue={0.2}
          onChange={(n) => {
            console.log(n);
          }}
        ></CustomSlider> */}
        <Settings />
        <VectorList imageNumber={imageNumber} />
      </div>
    </div>
  );
}

export default SideBar;
