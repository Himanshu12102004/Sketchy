import React, { useState } from 'react';
import CanvasParent from '../../components/Canvas/CanvasParent';
import SideBar from '../../components/sideBar/SideBar';
import {
  CaretDoubleLeft,
  CaretDoubleRight,
  CaretLeft,
  CaretRight,
} from 'phosphor-react';

const MemoizedCanvasParent = React.memo(CanvasParent);

function Layout() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);

    const resizeEvent = new CustomEvent('sidebar');
    window.dispatchEvent(resizeEvent);
  };

  return (
    <div className="flex h-screen">
      <div
        id="canvas_parent"
        className={`transition-all duration-200 ${
          isSidebarVisible ? 'w-4/5' : 'w-full'
        } relative`}
      >
        <MemoizedCanvasParent />
        <button
          onClick={toggleSidebar}
          className={`absolute top-1/2 transform -translate-y-1/2 z-10 bg-gray-700 rounded-tl-3xl pt-4 pb-4 rounded-bl-3xl text-white transition-all duration-200 ${
            isSidebarVisible ? 'right-0' : 'right-0'
          }`}
        >
          {isSidebarVisible ? (
            <CaretRight size={32} />
          ) : (
            <CaretLeft size={32} />
          )}
        </button>
        <div
          className={`absolute top-0 right-0 h-full w-3 bg-gray-700 z-0 rounded-tl-3xl rounded-bl-3xl transition-all duration-200 `}
        ></div>
      </div>
      <div
        className={`transition-all duration-200 bg-gray-100 ${
          isSidebarVisible ? 'w-1/5' : 'w-0'
        } overflow-hidden`}
      >
        <SideBar />
      </div>
    </div>
  );
}

export default Layout;
