import React, { useRef, useEffect, useCallback } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores/StoreContext.jsx";
import edgehandles from "cytoscape-edgehandles";
import cytoscape from "cytoscape";
import GraphPopup from "./GraphPopup.jsx";
import cxtmenu from "cytoscape-cxtmenu";
import EditNodePopup from "./EditNodePopup.jsx";
import { TYPE_FIELD, TYPE_NODE } from "../../utils/enum.js";
import TableComponent from "../../components/TableComponent.jsx";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import { consoleLogStoreValue, convertTimestampToDate } from "../../utils/constant.js";
import { PasswordRounded } from "@mui/icons-material";
import TextField from "@mui/material/TextField";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import { debounce } from "@mui/material";

cytoscape.use(cxtmenu);
cytoscape.use(edgehandles);

const Graph = ({ elements = [], nodeSublabelSelected }) => {
  const {
    isDrawMode,
    handleSelectedNode,
    handleOpenEditNodePopup,
    changeDrawModeStatus,
    submitGraph,
    handleDragNode,
    checkNodeInGraphPosition,
    handleDrawEdge,
    handleChangeNodeValue,
    processName,
    handleChangeNodeSublabelSelected,
  } = useStore().graphStore;
  const cyRef = useRef(null); // Store Cytoscape instance

  const debouncedHandleChange = useCallback(
    debounce((id, newValue, props) => {
      handleChangeNodeValue?.(id, newValue, props);
    }, 300), // Adjust debounce delay as needed
    []
  );
  const columns = [
    {
      accessorKey: "data.properties.sublabel",
      header: TYPE_NODE.Sublabel.name,
      size: 300,
      muiTableHeadCellProps: {
        align: "center", // Center align header cells
        sx: {
          top: 0,
          zIndex: 9999,
          backgroundColor: "#9e9e9e", // Light gray background for header
          fontWeight: "bold", // Bold font for header
          border: "1px solid rgba(81, 81, 81, .5)", // Add border to header cells
          opacity: "unset",
        },
      },
    },
    {
      accessorKey: "data.label",
      header: "Label",
      size: 150,
      muiTableHeadCellProps: {
        align: "center", // Center align header cells
        sx: {
          top: 0,
          zIndex: 9999,
          backgroundColor: "#9e9e9e", // Light gray background for header
          fontWeight: "bold", // Bold font for header
          border: "1px solid rgba(81, 81, 81, .5)", // Add border to header cells
          opacity: "unset",
        },
      },
    },
    {
      accessorKey: "data.properties.key1",
      header: "Name",
      size: 150,
      muiTableHeadCellProps: {
        align: "center", // Center align header cells
        sx: {
          top: 0,
          zIndex: 9999,
          backgroundColor: "#9e9e9e", // Light gray background for header
          fontWeight: "bold", // Bold font for header
          border: "1px solid rgba(81, 81, 81, .5)", // Add border to header cells
          opacity: "unset",
        },
      },
    },
    {
      accessorKey: "data.properties.key3",
      header: "Unit",
      size: 150,
      Cell: ({ row }) => (
        <>
          <TextField
            defaultValue={row.original.data?.properties?.key3}
            onChange={(e) => debouncedHandleChange?.(row.original.data.id, e.target.value, "data.properties.key3")}
            size="small"
            fullWidth
            variant="outlined"
          />
        </>
      ),
      muiTableHeadCellProps: {
        align: "center", // Center align header cells
        sx: {
          top: 0,
          zIndex: 9999,
          backgroundColor: "#9e9e9e", // Light gray background for header
          fontWeight: "bold", // Bold font for header
          border: "1px solid rgba(81, 81, 81, .5)", // Add border to header cells
          opacity: "unset",
        },
      },
    },
    {
      accessorKey: "data.properties.key2",
      header: "Value",
      size: 150,
      Cell: ({ row }) => (
        <>
          <TextField
            defaultValue={row.original.data?.properties?.key2}
            onChange={(e) => debouncedHandleChange?.(row.original.data.id, e.target.value, "data.properties.key2")}
            size="small"
            fullWidth
            variant="outlined"
          />
        </>
      ),
      muiTableBodyCellProps: {
        align: "center",
      },
      muiTableHeadCellProps: {
        align: "center", // Center align header cells
        sx: {
          top: 0,
          zIndex: 9999,
          backgroundColor: "#9e9e9e", // Light gray background for header
          fontWeight: "bold", // Bold font for header
          border: "1px solid rgba(81, 81, 81, .5)", // Add border to header cells
          opacity: "unset",
        },
      },
    },
  ];

  const stylesheet = [
    {
      selector: "node",
      style: {
        "background-color": "data(color)",
        label: "data(label)",
        "font-size": "14px",
        "text-valign": "center",
        color: "#ffffff",
        "text-outline-width": 2,
        "text-outline-color": "#4a4a4a",
        shape: "ellipse",
        width: "60px",
        height: "60px",
      },
    },
    {
      selector: ":parent",
      style: {
        "background-color": "#d3d3d3", // Set color (optional)
        "background-opacity": 0, // Make the parent node transparent
        padding: "25px", // Ensure padding works
        "border-width": 2,
        "border-style": "dashed",
        "border-color": "#4a4a4a",
        shape: "roundrectangle", // Makes the parent distinguishable
        "text-valign": "bottom",
        "text-margin-y": "10px",
      },
    },
    {
      selector: "edge",
      style: {
        width: 3,
        "line-color": "#9dbaea",
        "target-arrow-color": "#9dbaea",
        "target-arrow-shape": "triangle",
        "curve-style": "bezier",
      },
    },
    {
      selector: ":selected",
      style: {
        "background-color": "#f58220",
        "line-color": "#f58220",
        "target-arrow-color": "#f58220",
        "source-arrow-color": "#f58220",
        "border-width": 2,
        "border-color": "#000",
      },
    },
  ];

  const layout = {
    name: "cose",
    idealEdgeLength: 100,
    nodeOverlap: 20,
    refresh: 20,
    fit: true,
    padding: 30,
    randomize: false,
    componentSpacing: 100,
    nodeRepulsion: 400000,
    edgeElasticity: 100,
    nestingFactor: 5,
    gravity: 80,
    numIter: 1000,
    initialTemp: 200,
    coolingFactor: 0.95,
    minTemp: 1.0,
  };

  // Initialize the graph on mount
  const onGraphReady = (cy) => {
    cyRef.current = cy;
    cy.fit();
    cy.boxSelectionEnabled(false);
    cy.autounselectify(true);
    // cy.makeLayout(layout).run(); // Initial layout
    // Handle node selection event
    cy.on("tap", "node", (event) => {
      const selectedNode = event.target.data();
      if (selectedNode?.label === TYPE_NODE.Sublabel.name) {
        handleChangeNodeSublabelSelected(selectedNode.id);
      }
    });
    cy.on("select", "node", (event) => {
      const selectedNode = event.target;

      // Disable interaction for all other nodes
      cy.nodes()
        .not(selectedNode)
        .forEach((node) => {
          node.style({
            "pointer-events": "none", // Disable interaction
            opacity: 0.5, // Dim the nodes
          });
        });
    });
    // Handle node unselection event
    cy.on("unselect", "node", () => {
      // Re-enable interaction for all nodes
      cy.nodes().forEach((node) => {
        node.style({
          "pointer-events": "auto", // Re-enable interaction
          opacity: 1, // Reset opacity
        });
      });
    });

    // Edgehandles initialization
    if (!cy.hasOwnProperty("ehInitialized")) {
      const edgehandleDefaults = {
        preview: true,
        hoverDelay: 150,
        handleNodes: "node",
        snap: true,
        noEdgeEventsInDraw: true,
        disableBrowserGestures: true,
      };
      cy.on("ehcomplete", (event, sourceNode, targetNode, addedEdge) => {
        if (sourceNode.isParent() || targetNode.isParent()) {
          addedEdge.remove();
          return;
        }
        if (sourceNode && targetNode) {
          handleDrawEdge(sourceNode?.data(), targetNode?.data(), addedEdge.data());
        }
      });
      cy.eh = cy.edgehandles(edgehandleDefaults);
      cy.cxtmenu({
        menuRadius: function (ele) {
          if (ele?.data()?.label !== TYPE_NODE.Sublabel.name) {
            return 70;
          } else return 0;
        },
        selector: "node",
        outSideMenuCancel: 10,
        adaptativeNodeSpotlightRadius: true,
        commands: function (target) {
          if (target?.data()?.label !== TYPE_NODE.Sublabel.name) {
            return [
              {
                fillColor: "rgba(129,172,84,0.75)",
                content: `
                    <div class="icon-container">
                        <svg class="feather" fill="none" height="14" width="14" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        <span class="icon-text">Edit</span>
                    </div>
                `,
                select: function (ele) {
                  handleSelectedNode(ele.data());
                  handleOpenEditNodePopup();
                },
                enabled: true,
              },
              {
                fillColor: "rgba(255,0,0,0.75)",
                content: `
                    <div class="icon-container">
                       <svg xmlns="http://www.w3.org/2000/svg" class="feather" fill="none" width="14" height="14" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M18 6L6 18M6 6l12 12" />
                       </svg>
                       <span class="icon-text">Close</span>
                    </div>`,
                select: function (ele) {
                  cy.cxtmenu("hide");
                },
              },
            ];
          }
          return [];
        },
      });
    }
    // Context menu initialization
    cy.ehInitialized = true;
  };

  // Handle draw mode toggling
  const handleDrawMode = () => {
    const cy = cyRef.current;
    const currentZoom = cy.zoom();
    const currentPan = cy.pan();

    // Toggle draw mode
    if (!isDrawMode) {
      cy.eh.enableDrawMode();
    } else {
      cy.eh.disableDrawMode();
    }

    // Restore zoom and pan values
    cy.zoom(currentZoom);
    cy.pan(currentPan);

    changeDrawModeStatus();
  };
  const handleDragOver = (event) => {
    event.preventDefault();
    const cyContainer = cyRef.current.container();
    if (cyContainer) {
      const rect = cyContainer.getBoundingClientRect(); // Cytoscape position
      const { clientX, clientY } = event;
      if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
        checkNodeInGraphPosition(true);
      } else {
        checkNodeInGraphPosition(false);
      }
    }
  };
  return (
    <>
      <div
        style={{
          maxHeight: "100%",
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "space-between", // Ensure spacing between CytoscapeComponent and label container
        }}
        onDragOver={handleDragOver}
      >
        {/* Label Container */}
        <div
          style={{
            width: "15%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            backgroundColor: "#9e9e9e",
          }}
        >
          {processName && (
            <button
              style={{
                width: "90%",
                marginTop: "10px",
                pointerEvents: "none",
              }}
            >
              Process Name: {processName}
            </button>
          )}

          <button style={{ width: "90%", marginTop: "10px" }} onClick={handleDrawMode}>
            {isDrawMode ? "Disable draw mode" : "Enable draw mode"}
          </button>
          <div
            style={{
              height: "80%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
              justifyContent: "center",
            }}
          >
            {[TYPE_NODE.Label1.name, TYPE_NODE.Label4.name].map((label, index) => (
              <div
                draggable={true}
                onDragEnd={handleDragNode}
                key={index}
                style={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: label === TYPE_NODE.Label1.name ? TYPE_NODE.Label1.color : TYPE_NODE.Label4.color,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "12px",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  textShadow: "1px 1px 2px #4a4a4a, -1px -1px 2px #4a4a4a, 1px -1px 2px #4a4a4a, -1px 1px 2px #4a4a4a",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
              >
                {label}
              </div>
            ))}
          </div>

          <button style={{ width: "90%", marginBottom: "10px" }} onClick={() => submitGraph(cyRef.current)}>
            Save
          </button>
        </div>
        <div className={"w-full h-full"}>
          <CytoscapeComponent
            elements={elements}
            style={{
              height: "80%",
              flex: 1,
              border: "1px solid #ccc",
            }}
            wheelSensitivity={0.1}
            stylesheet={stylesheet}
            layout={layout}
            cy={onGraphReady}
          />
          <div className={"w-full h-1/5"}>
            <TableComponent
              data={elements.filter(
                (value) =>
                  value.group === "nodes" &&
                  value.data?.label === TYPE_NODE.Label2.name &&
                  value.data?.parent === nodeSublabelSelected
              )}
              columns={columns}
              enablePagination={false}
            ></TableComponent>
          </div>
        </div>
      </div>

      <EditNodePopup />
    </>
  );
};

export default Graph;
