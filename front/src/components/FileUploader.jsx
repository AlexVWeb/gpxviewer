import React, {useEffect, useState} from "react";
import {createRoot} from "react-dom/client";
import FileUpload from "react-mui-fileuploader";
import {Button} from "@mui/material";
import axios from "axios";

export default function FileUploader({onFileUpload}) {
    const [filesToUpload, setFilesToUpload] = useState([]);
    const [geoJson, setGeoJson] = useState(null);

    const handleFilesChange = (files) => {
        setFilesToUpload([files[0]]);
    };

    const uploadFiles = () => {
        let formData = new FormData();
        formData.append("file", filesToUpload[0]);
        axios.post("http://localhost:3000/api/gpx", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }).then((response) => {
            setGeoJson(response.data);
            onFileUpload(response.data);
        }).catch((error) => {
            console.log(error);
        });
    };

    return (
        <>
            <FileUpload
                multiFile={false}
                onFilesChange={handleFilesChange}
                onContextReady={(context) => {
                }}
                title={"Upload Files"}
                header={"Déposez votre fichier GPX"}
                maxUploadFiles={1}
            />

            <Button style={{
                marginTop: 10
            }} onClick={uploadFiles} variant="contained" id="uploadButton">
                Upload
            </Button>
        </>
    );
}

const root = createRoot(document.getElementById("root"));
root.render(<FileUploader/>);
