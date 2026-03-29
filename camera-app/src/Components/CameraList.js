export default function CameraList({ cameras }) {
    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {Object.entries(cameras).map(([group, cameras]) => (
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
    );
}