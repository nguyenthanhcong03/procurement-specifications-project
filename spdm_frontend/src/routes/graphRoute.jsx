import React from "react";
import GraphIndex from "../pages/graph/GraphIndex.jsx";


const graphRoute = [
    {
        path: "/:versionName",  // Add a dynamic parameter for versionName
        element: <GraphIndex />  // GraphIndex component
    },
    {
        index: true,
        element: <GraphIndex />  // Default route without versionName
    },
    {
        path: "/:processName/last-version",
        element: <GraphIndex />  // GraphIndex component

    },
    {
        path: "/:processName/:versionName",
        element: <GraphIndex />  // GraphIndex component
    }
];


export default graphRoute;
