import React, {memo} from "react";
import {FileUploader} from "react-drag-drop-files";

const fileTypes = ["PY", "XLSX"];

function DragDropComponent({handleChange, files = []}) {
    return (
        <FileUploader
            classes={'custom-fileUploader'}
            multiple={true}
            handleChange={handleChange}
            name="file"
            types={fileTypes}
            hoverTitle="Drop here!" // Custom hover text
        />
    );
}

export default DragDropComponent;
