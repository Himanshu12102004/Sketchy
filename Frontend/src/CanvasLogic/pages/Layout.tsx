import React, { useEffect, useState } from 'react';
import CanvasParent from '../../components/Canvas/CanvasParent';
import SideBar from '../../components/sideBar/SideBar';
import { CaretDown, CaretLeft, CaretRight, CaretUp } from 'phosphor-react';
import Overlay from '../../components/overlay/overlay';

const MemoizedCanvasParent = React.memo(CanvasParent);
function Layout() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(
    window.innerWidth < 750 || window.innerHeight < 750
  );
  const [showOverlay, setShowOverlay] = useState(true);
  const [overlayHead, setOverlayHead] = useState('Please Wait!');
  const [isErr, setIsErr] = useState(false);
  const [overlaySubHead, setOverlaySubHead] = useState(
    'We are processing your image.'
  );
  const handleImageUpload = () => {
    setOverlayHead('Please Wait!');
    setOverlaySubHead('We are processing your image.');
    setIsErr(false);
    setShowOverlay(true);
  };
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 750 || window.innerHeight < 750);
    };

    const handleSvgError = () => {
      setIsErr(true);
      setOverlayHead('Error!');
      setOverlaySubHead('Some error occured while processing your image.');
      setTimeout(() => {
        setShowOverlay(false);
      }, 1000);
    };

    const handleReadyToGo = () => {
      setShowOverlay(false);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('svgError', handleSvgError);
    window.addEventListener('readyToGo', handleReadyToGo);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('svgError', handleSvgError);
      window.removeEventListener('readyToGo', handleReadyToGo);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
    const resizeEvent = new CustomEvent('sidebar');
    window.dispatchEvent(resizeEvent);
  };

  return (
    <div className={`flex ${isSmallScreen ? 'flex-col' : ''}  h-screen`}>
      {isSmallScreen && (
        <div onClick={toggleSidebar} className="absolute top-1 right-1 b z-30">
          <img src="settings.svg" alt="settings" />
        </div>
      )}
      <div
        id="canvas_parent"
        className={`transition-all duration-200 ${
          isSidebarVisible
            ? isSmallScreen
              ? 'h-1/3'
              : 'w-3/4'
            : isSmallScreen
            ? 'h-full'
            : 'w-full'
        } relative`}
      >
        {showOverlay && (
          <Overlay head={overlayHead} subHead={overlaySubHead} isErr={isErr} />
        )}{' '}
        <MemoizedCanvasParent />
        <button
          onClick={toggleSidebar}
          className={`absolute ${
            isSmallScreen ? 'left-1/2' : 'top-1/2'
          } transform ${
            isSmallScreen ? '-translate-x-1/2' : '-translate-y-1/2 '
          } z-10 bg-gray-700  ${isSmallScreen ? 'px-4' : 'py-4'} ${
            isSmallScreen
              ? 'rounded-tl-3xl rounded-tr-3xl'
              : 'rounded-tl-3xl rounded-bl-3xl'
          } text-white transition-all duration-200 ${
            isSmallScreen ? 'bottom-0' : 'right-0'
          }`}
        >
          {isSidebarVisible ? (
            isSmallScreen ? (
              <CaretDown size={32} />
            ) : (
              <CaretRight size={32} />
            )
          ) : isSmallScreen ? (
            <CaretUp size={32} />
          ) : (
            <CaretLeft size={32} />
          )}
        </button>
        <div
          className={`absolute ${isSmallScreen ? 'bottom-0' : 'top-0'} right-0 
            ${isSmallScreen ? 'h-4 w-full' : 'h-full w-4'} bg-gray-700 z-0 ${
            isSmallScreen
              ? 'rounded-tl-3xl rounded-tr-3xl'
              : 'rounded-tl-3xl rounded-bl-3xl'
          } transition-all duration-200 `}
        ></div>
      </div>
      <div
        className={`transition-all duration-200 bg-gray-100 ${
          isSidebarVisible
            ? isSmallScreen
              ? 'h-2/3'
              : 'w-1/4'
            : isSmallScreen
            ? 'h-0'
            : 'w-0'
        } overflow-hidden`}
      >
        <SideBar imageUploadShowOverlay={handleImageUpload} />
      </div>
    </div>
  );
}

export default Layout;
