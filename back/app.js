const express = require('express');
const GpxService = require('./Service/Gpx');
const multer = require('multer');
const multerStorage = require('./middlewares/multerStorage');
const upload = multer({storage: multerStorage});
const bodyParser = require('body-parser');
const app = express();
console.clear();

app.set('view engine', 'ejs');
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.disable('x-powered-by')

app.route('/api/gpx')
    .get((req, res) => {
        const gpxService = new GpxService('./uploads/Footing_intensif.gpx');
        gpxService.calculator().then((result) => {
            res.json(result);
        });
        // gpxService.toGeoJSON().then(geoJSON => res.json(geoJSON));
    })
    .post(
        upload.single('file'),
        (req, res) => {
        const gpxService = new GpxService(req.file.path);
        gpxService.toGeoJSON().then(geoJSON => res.json(geoJSON));
    })
;

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
