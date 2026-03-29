import { useEffect, useState } from 'react';
import CameraList from './Components/CameraList';
import CameraMap from './Components/CameraMap/CameraMap';

function App() {
  const [groupedCameras, setGroupedCameras] = useState({
    '0-600': [],
    '600-700': [],
    '700-800': [],
    '800+': []
  });

  function cameraNumber(camera) {
    const match = camera.name.match(/UTR-CM-(\d{1,})/i);
    return match ? Number(match[1]) : null;
  }

  function groupCameras(cameras) {
    const groups = {
      '0-600': [],
      '600-700': [],
      '700-800': [],
      '800+': []
    }

    cameras.forEach(camera => {
      const number = cameraNumber(camera);
      if (number !== null) {
        if (number < 600) groups['0-600'].push(camera);
        else if (number < 700) groups['600-700'].push(camera);
        else if (number < 800) groups['700-800'].push(camera);
        else groups['800+'].push(camera);
      }
    })
    return groups;
  }

  useEffect(() => {
    fetch('http://localhost:5000/')
      .then(response => {
        if (!response.ok) throw new Error(`API error ${response.status}`);
        return response.json();
      })
      .then(data => {
        const cameraList = Array.isArray(data) ? data : [];
        setGroupedCameras(groupCameras(cameraList));
      })
      .catch(error => {
        console.error('Error fetching cameras:', error);
        setGroupedCameras({
          '0-600': [],
          '600-700': [],
          '700-800': [],
          '800+': []
        });
      });
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4">
      <CameraMap groupedCameras={groupedCameras} />
      <CameraList cameras={groupedCameras} />    
    </div>
  );
}

export default App;
