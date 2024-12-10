import React, { useState } from 'react';

function SingleImage(props: {
  url: string;
  index: number;
  onImageSelect: (url: string) => void;
}) {
  const { index, url } = props;
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div key={index} className="w-full h-full relative cursor-pointer">
      {isLoading && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg"
          style={{ height: 150, width: 150 }}
        >
          <div className="loader">Loading...</div>
        </div>
      )}
      <img
        onClick={() => {
          props.onImageSelect(url);
        }}
        src={url}
        alt={`Uploaded Image ${index + 1}`}
        className={`w-full h-full object-cover rounded-lg transition-opacity ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}

export default SingleImage;
