export default function CameraList({ cameras, onSelectCamera }) {
    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {Object.entries(cameras).map(([group, cameras]) => (
          <div key={group} className='p-4 bg-[#12121C] rounded text-black flex flex-col gap-4'>
            <h2 className='text-lg font-bold bg-[#F1CAA4] p-2 rounded text-center'>Camera's {group}</h2>
            <div className='flex flex-col gap-2 '>
              {cameras.length > 0 ? (
                cameras.map(camera => (
                  <button key={camera.name} className='p-2 bg-[#F3A154] odd:bg-[#F2B67C] rounded text-start' onClick={() => onSelectCamera(camera)}>
                    {camera.name} ({camera.lat}, {camera.lon})
                  </button>
                ))
              ) : (
                <p className="bg-[#F2B67C] rounded p-2 italic">Er zijn geen cameras in deze groep.</p>
              )}
            </div>
          </div>
        ))}
      </div>         
    );
}