import * as React from 'react';
import { Line } from 'react-chartjs-2';

export function SpeedChart({ geoJson }) {
    if (geoJson === null) {
        return null;
    }

    const coordinates = geoJson.features[0].geometry.coordinates;
    getSpeeds(coordinates)
    const data = {
        labels: coordinates.map((coord, index) => index),
        datasets: [
            {
                label: 'Max speed per segment',
                data: getSpeeds(coordinates),
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.1,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Max speed (m/s)',
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Segment number',
                },
            },
        },
    };

    return <Line data={data} options={options} />;
}

function getSpeeds(coordinates) {
    const speeds = [];
    for (let i = 0; i < coordinates.length - 1; i++) {
        const distance = getDistanceFromLatLonInKm(
            coordinates[i][1],
            coordinates[i][0],
            coordinates[i + 1][1],
            coordinates[i + 1][0]
        );
        const timeDiff =
            new Date(coordinates[i + 1][3]) - new Date(coordinates[i][3]);
        const speed = distance / timeDiff;
        speeds.push(speed);
    }
    return speeds;
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d * 1000; // Distance in meters
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}
