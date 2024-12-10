import { useEffect, useState } from 'react';
import Overlay from './components/overlay/overlay';
import Layout from './CanvasLogic/pages/Layout';

const App: React.FC = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(
    window.innerWidth < 750 || window.innerHeight < 750
  );

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 750 || window.innerHeight < 750);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      {isSmallScreen && <Overlay />}
      <Layout />
    </div>
  );
};

export default App;
