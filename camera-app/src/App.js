import { useEffect, useState } from 'react';

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
    <div className="p-4">
      <div className='grid grid-cols-4 gap-4'>
        {Object.entries(groupedCameras).map(([group, cameras]) => (
          <div key={group} className='p-4 bg-emerald-500 rounded text-black flex flex-col gap-4'>
            <h2 className='text-lg font-bold bg-emerald-200 p-2 rounded'>Camera's: {group}</h2>
            <div className='flex flex-col gap-2 '>
              {cameras.length > 0 ? (
                cameras.map(camera => (
                  <div key={camera.name} className='p-2 bg-emerald-300 odd:bg-emerald-400 rounded'>
                    {camera.name} ({camera.lat}, {camera.lon})
                  </div>
                ))
              ) : (
                <p>Er zijn geen cameras in deze groep.</p>
              )}
            </div>
          </div>
        ))}
      </div>      

    </div>
  );
}

export default App;
