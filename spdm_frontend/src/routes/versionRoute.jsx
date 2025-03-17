import React from "react";
import VersionIndex from "../pages/version/VersionIndex.jsx";
import VersionDetail from "../pages/version/VersionDetail.jsx";

const versionRoute = [
  {
    path: "/version",
    element: <VersionIndex />,
  },
  {
    path: "/version/:processName",
    element: <VersionIndex />,
  },
  {
    path: "/version/:processName/:id",
    element: <VersionDetail />,
  },
];
export default versionRoute;
