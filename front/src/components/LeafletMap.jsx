import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { useState } from 'react';

function LeafletMap({ geoJson }) {
    const [center, setCenter] = useState([48.8566, 2.3522]); // Paris, France

/*
    return geoJson && (
        <MapGL
            width="100%"
            height="100%"
            mapboxApiAccessToken={'pk.eyJ1IjoiYWxleHZ3ZWI2OSIsImEiOiJja2w4anpxNmQwMGhpMnBueWI1NXkxZzc1In0.ojk7iMMsfaSVEoCBtzi05g'}
            mapStyle={'mapbox://styles/mapbox/streets-v11'}
        >
        </MapGL>
    );
*/
}

export default LeafletMap;
