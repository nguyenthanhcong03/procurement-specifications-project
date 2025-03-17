import DragDropComponent from "../../components/DragDropComponent.jsx";
import Graph from "./Graph.jsx";
import { useStore } from "../../stores/StoreContext.jsx";
import { useParams } from "react-router-dom";
import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import GraphPopup from "./GraphPopup.jsx";

const GraphIndex = () => {
  const { processName, versionName } = useParams();
  const {
    nodeSublabelSelected,
    elements,
    resetGraphStore,
    getLastVersionByProcess,
    getProgramByProcessVersionName,
    uploadFile,
  } = useStore().graphStore;
  useEffect(() => {
    resetGraphStore();
    if (processName && versionName) {
      getProgramByProcessVersionName(processName, versionName);
    } else if (processName) {
      getLastVersionByProcess(processName);
    }
  }, []);
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
          rowGap: "10px",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            height: `${elements.length > 0 ? "20%" : "50%"}`,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <DragDropComponent handleChange={uploadFile} />
        </div>
        {elements.length > 0 && (
          <div className={"w-full h-4/5"}>
            <Graph elements={elements} nodeSublabelSelected={nodeSublabelSelected} />
          </div>
        )}
        <GraphPopup />
      </div>
    </>
  );
};
export default observer(GraphIndex);
