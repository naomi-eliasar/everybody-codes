import { useEffect, useRef } from 'react';
import leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import cameraPng from './security-camera-map-pin.png';

export default function CameraMap({groupedCameras, selectedCamera}) {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const layerControlRef = useRef(null);
    const markerRefs = useRef({});

    //Initialize map
    useEffect(() => {
        if (!mapContainerRef.current) return;

        const map = leaflet.map(mapContainerRef.current).setView([52.0914, 5.1115], 13);
        mapRef.current = map;

        leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };       
    }, []);

    //Set the camera markers on the map
    useEffect(() => {
        if (!mapRef.current) return;

        const cameraIcon = leaflet.icon({
            iconUrl: cameraPng,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        });

        // Create layer groups for each camera group
        const layerGroups = Object.fromEntries(
            Object.keys(groupedCameras).map(key => [key, leaflet.layerGroup()])
        );

        // Add markers to each layer/camera group
        Object.entries(groupedCameras).forEach(([group, cameras]) => {
            const layer = layerGroups[group];
            cameras.forEach(camera => {
                if (typeof camera.lat !== 'number' || typeof camera.lon !== 'number') return;
                const marker = leaflet.marker([camera.lat, camera.lon], { icon: cameraIcon });
                marker.bindPopup(`<b>${camera.name || 'Camera'}</b><br>Lat: ${camera.lat}, Lon: ${camera.lon}`);
                markerRefs.current[camera.name] = marker;
                layer.addLayer(marker);
            });
            layer.addTo(mapRef.current);
        });

        //Set the layer control with the camera groups
        layerControlRef.current = leaflet.control.layers(null, layerGroups, { collapsed: false }).addTo(mapRef.current);

        return () => {
            if (mapRef.current && layerControlRef.current) {
                mapRef.current.removeControl(layerControlRef.current);
                layerControlRef.current = null;
            }
            Object.values(layerGroups).forEach(layer => {  
                if (mapRef.current && layer) {
                    mapRef.current.removeLayer(layer);
                }
            });
        };
    }, [groupedCameras]);

    //Open the popup and center the map on the selected camera from the list
    useEffect(() => {
        if (!mapRef.current || !selectedCamera) return;
        const marker = markerRefs.current[selectedCamera.name];
        if (marker) {
            marker.openPopup();
            mapRef.current.setView(marker.getLatLng(), 15, { animate: true });
        }
    }, [selectedCamera]);

    return (
        <div className='bg-[#12121C] rounded p-4'>
            <div ref={mapContainerRef} className='leaflet-container h-80 md:h-96'></div>
        </div>
    );
}