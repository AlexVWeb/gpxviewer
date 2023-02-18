import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import FileUploader from "./FileUploader.jsx";
import {GeoJsonTable} from "./GeoJsonTable.jsx";
import {useState} from "react";
import LeafletMap from "./LeafletMap.jsx";
import {SpeedChart} from "./SpeedChart.jsx";

const theme = createTheme();

export default function UploaderGPX() {
    const [geoJson, setGeoJson] = useState(null);

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                    }}
                >
                    <Typography component="h1" variant="h2" sx={{ marginBottom: 2, fontWeight: 500 }}>
                        GPX Viewer
                    </Typography>
                    <FileUploader onFileUpload={setGeoJson} />
                    <Box sx={{ display: 'flex', width: '100%', height: '600px' }}>
                        <Box sx={{ flex: 1 }}>
                            <GeoJsonTable geoJson={geoJson} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            {/*<LeafletMap geoJson={geoJson} />*/}
                            {/*<SpeedChart geoJson={geoJson} />*/}
                        </Box>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}