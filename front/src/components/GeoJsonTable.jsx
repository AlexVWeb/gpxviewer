import { Table, TableBody, TableRow, TableCell } from '@mui/material';
import L from 'leaflet';
export function GeoJsonTable({ geoJson }) {
    if (geoJson === null) {
        return null;
    }

    // Extract the coordinates from the GeoJSON data
    const coordinates = geoJson.features[0].geometry.coordinates;

    // Calculate the total distance traveled
    let distance = 0;
    for (let i = 0; i < coordinates.length - 1; i++) {
        const from = L.latLng(coordinates[i][1], coordinates[i][0]);
        const to = L.latLng(coordinates[i + 1][1], coordinates[i + 1][0]);
        distance += from.distanceTo(to);
    }

    // Convert distance to kilometers
    distance /= 1000;

    return (
        <div style={{ height: "400px", overflowY: "scroll" }}>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell>Latitude</TableCell>
                        <TableCell>Longitude</TableCell>
                        <TableCell>Altitude</TableCell>
                        <TableCell>Time</TableCell>
                    </TableRow>
                    {coordinates.map((coordinate, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCell>{coordinate[1]}</TableCell>
                                <TableCell>{coordinate[0]}</TableCell>
                                <TableCell>{coordinate[2]}</TableCell>
                                <TableCell>{coordinate[3]}</TableCell>
                            </TableRow>
                        );
                    })}
                    <TableRow>
                        <TableCell colSpan={4}>Total Distance Traveled: {distance.toFixed(2)} km</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
}

