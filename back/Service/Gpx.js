const fs = require('fs');
const GpxParser = require('gpxparser');

const EARTH_RADIUS_IN_METERS = 6371000;
const toRad = value => value * Math.PI / 180;

class GpxService {
    constructor(filePath) {
        this.filePath = filePath;
        this.gpx = null;
        this.parsePromise = this.parse();
    }

    parse() {
        return new Promise((resolve, reject) => {
            fs.readFile(this.filePath, (err, data) => {
                if (err) {
                    return reject(err);
                }

                const gpx = new GpxParser();
                gpx.parse(data);
                resolve(gpx);
            });
        });
    }

    async toGeoJSON() {
        if (this.gpx === null) {
            this.gpx = await this.parsePromise;
        }

        const geoJSON = {
            type: 'FeatureCollection',
            features: []
        };

        const calculateTime = await this.calculateTime();
        // console.log(speed);
        this.gpx.tracks.forEach(track => {
            const feature = {
                type: 'Feature',
                properties: {
                    name: track.name,
                    desc: track.desc,
                    number: track.number,
                    type: track.type,
                    distance: track.distance,
                    elevation: track.elevation,
                    slopes: track.slopes,
                    points: track.points,
                },
                geometry: {
                    type: 'LineString',
                    coordinates: []
                }
            };

            track.points.forEach(point => {
                feature.geometry.coordinates.push([
                    point.lon,
                    point.lat,
                    point.ele,
                    point.time
                ]);
            });

            geoJSON.features.push(feature);
        });

        return geoJSON;
    }

    /**
     * TODO:
     *  - Calculate the time
     *  - Calculate the distance
     *  - Calculate the average speed
     *  - Get the start and end date
     *  - Get min and max elevation
     *  - list of slopes
     *  - list of points
     *  - list of waypoints
     */

    async calculator() {
        if (this.gpx === null) {
            this.gpx = await this.parsePromise;
        }

        await this.addDataInPoints(this.gpx.tracks[0].points);
        console.log(this.gpx.tracks[0].points)

    }

    /**
     * Calculate the distance between two points in meters
     * @param startWaypoint
     * @param endWaypoint
     * @returns {Promise<number>}
     */
    async calculateDistance(startWaypoint, endWaypoint) {
        const dLat = toRad(endWaypoint.lat - startWaypoint.lat);
        const dLon = toRad(endWaypoint.lon - startWaypoint.lon);

        const startLat = toRad(startWaypoint.lat);
        const endLat = toRad(endWaypoint.lat);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(startLat) * Math.cos(endLat);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS_IN_METERS * c;
    };

    async calculateTotalDistance() {
        let totalDistance = 0;
        for (let i = 0; i < this.gpx.tracks[0].points.length - 1; i++) {
            totalDistance += await this.calculateDistance(this.gpx.tracks[0].points[i], this.gpx.tracks[0].points[i + 1]);
        }
        return totalDistance;
    }

    async calculateTime() {
        const startDateTime = await this.getStartDateTime();
        const endDateTime = await this.getEndDateTime();
        return (endDateTime - startDateTime) / 1000;
    }

    async getStartDateTime() {
        return this.gpx.tracks[0].points[0].time;
    }

    async getEndDateTime() {
        return this.gpx.tracks[0].points[this.gpx.tracks[0].points.length - 1].time;
    }

    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds - (hours * 3600)) / 60);
        const secs = seconds - (hours * 3600) - (minutes * 60);

        const hh = hours.toString().padStart(2, '0');
        const mm = minutes.toString().padStart(2, '0');
        const ss = secs.toString().padStart(2, '0');

        return `${hh}:${mm}:${ss}`;
    }

    async getMinElevation() {
        return this.gpx.tracks[0].points.reduce((min, point) => point.ele < min ? point.ele : min, this.gpx.tracks[0].points[0].ele);
    }

    async getMaxElevation() {
        return this.gpx.tracks[0].points.reduce((max, point) => point.ele > max ? point.ele : max, this.gpx.tracks[0].points[0].ele);
    }



    /**
     * TODO:
     *  - Calculate min speed
     *  - Calculate max speed
     *  - Calculate average climb speed
     *  - Calculate average descent speed
     *  - Calculate average flat speed
     *  - Calculate average speed
     */

/*
    async addSpeedToPoints(points) {
        for (let i = 1; i < points.length; i++) {
            const p1 = points[i - 1];
            const p2 = points[i];
            const distance = await this.calculateDistance(p1, p2);
            const time = (new Date(p2.time) - new Date(p1.time)) / 1000; // in seconds
             // in meters per second
            this.gpx.tracks[0].points[i].speed = distance / time;
        }
    }
*/

    async addDataInPoints(points) {
        for (let i = 1; i < points.length; i++) {
            const p1 = points[i - 1];
            const p2 = points[i];
            const distance = await this.calculateDistance(p1, p2);
            const time = (p2.time - p1.time) / 1000;
            this.gpx.tracks[0].points[i].speed = distance / time;
            this.gpx.tracks[0].points[i].isClimbing = p2.ele > p1.ele; // new line to mark climbing points
            this.gpx.tracks[0].points[i].isDescending = p2.ele < p1.ele; // new line to mark descending points
            this.gpx.tracks[0].points[i].isFlat = p2.ele === p1.ele; // new line to mark flat points
        }
    }

    /**
     * Returns the average speed in m/s
     * @returns {Promise<number>}
     */
    async getAverageSpeed() {
        const totalDistance = await this.calculateTotalDistance();
        const totalTime = await this.calculateTime();
        return totalDistance / totalTime;
    }

    async getAverageSpeedKmH() {
        const averageSpeed = await this.getAverageSpeed();
        return averageSpeed * 3.6;
    }

    async getAllSpeedPoints() {
        return this.gpx.tracks[0].points
            .filter(point => point.speed !== undefined)
            .map(point => point.speed)
        ;
    }

    async getMaxSpeed() {
        return Math.max(...await this.getAllSpeedPoints());
    }
}

module.exports = GpxService;
