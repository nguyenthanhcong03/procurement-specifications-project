import {makeAutoObservable, runInAction} from "mobx";
import * as XLSX from "xlsx";
import {getRandomUUID, HttpStatus} from "../utils/constant.js";
import {TYPE_EDGES, TYPE_NODE} from "../utils/enum.js";
import {
    getProgramByProcessVersionName, saveNewVersion, updateVersion
} from "../services/graphService.js";
import {uploadFile} from "../services/versionService.js";
import {toast} from "react-toastify";
import {HttpStatusCode} from "axios";
import {getLastVersionByProcessName} from "../services/processService.js";

export default class GraphStore {
    versionName = null
    processName = null
    files = null;
    elements = []
    isDrawMode = false
    isSavePopupOpen = false
    isEditNodePopupOpen = false
    isNodeInGraphPosition = false
    nodeSelected = null;
    nodeSublabelSelected = null;

    constructor() {
        makeAutoObservable(this);
    }

    resetGraphStore = () => {
        this.versionName = null
        this.files = null;
        this.elements = []
        this.isDrawMode = false
        this.isSavePopupOpen = false
        this.isEditNodePopupOpen = false
        this.nodeSelected = null;
    }
    handleChangeStatusOpenPopup = () => {
        this.isSavePopupOpen = !this.isSavePopupOpen
    }
    changeDrawModeStatus = () => {
        this.isDrawMode = !this.isDrawMode
    }
    handleCreateProcess = async (value) => {
        let isCreate = 1
        if (this.processName) {
            isCreate = 0
        } else {
            this.processName = value.processName
        }
        const data = await uploadFile({
            processName: value.processName, files: Object.values(this.files), isCreate: isCreate
        });
        if (data.status === HttpStatusCode.Created) {
            toast.success('Upload file successfully.');
        } else if (data.status === HttpStatusCode.InternalServerError) {
            toast.error(data.data.message.errors.processName.join(", "))
            return
        } else if (data.status === HttpStatusCode.BadRequest) {
            toast.warning(`Upload file failed.\n${data.data.error}\n${data.data.failedFiles.join(", ")}`);
        }
        Object.values(this.files).forEach(file => {
            if (file && (data.status === HttpStatusCode.Created || data.status === HttpStatusCode.Ok || (data.status === HttpStatus.BAD_REQUEST && !data.data.failedFiles.includes(file.name)))) {
                if (file.name.includes('.py')) {
                    this.readFilePython(file);
                }
                if (file.name.includes('.xlsx')) {
                    this.readFileExcel(file);
                }
            }
        });
        if (isCreate === 1) {
            this.handleChangeStatusOpenPopup()
        }
        console.log(this.elements)
    }
    uploadFile = async (files) => {
        this.files = files;
        if (!this.processName) {
            this.handleChangeStatusOpenPopup()
        } else {
            await this.handleCreateProcess(this.processName)
        }
    };
    onRemoveFile = (index) => {
        const updatedFiles = {...this.files}; // Copy current files
        delete updatedFiles[index]; // Remove file by index
        this.files = updatedFiles; // Update this.files
        console.log(this.files); // Debugging
    };


    createNode = (label, labelName, color, x = null, y = null) => ({
        group: 'nodes', data: {
            id: label.id, parent: label.parent, color, label: labelName, properties: label.properties
        }, position: {
            x: x ? x : Math.floor(Math.random() * 200), y: y ? y : Math.floor(Math.random() * 200),
        },
    });
    createNodeParent = (label, labelName, color, x = null, y = null) => ({
        group: 'nodes', data: {
            id: label.id, parent: label.parent, color, label: labelName, properties: label.properties
        }, position: {
            x: x ? x : Math.floor(Math.random() * 200), y: y ? y : Math.floor(Math.random() * 200),
        },
    });

    createEdge = (source, labelName, target, edges = null) => ({
        group: 'edges', data: {
            properties: {
                versionName: target?.properties?.versionName,
            }, id: edges?.id, source: source.id, target: target.id, label: labelName
        },
    });
    handleDrawEdge = (source, target, addedEdge) => {
        let type = TYPE_EDGES.TYPE1
        if (source?.properties?.sublabel !== target?.properties?.sublabel) {
            type = TYPE_EDGES.TYPE2
        } else {
            if (source.label === TYPE_NODE.Label1.name || target.label === TYPE_NODE.Label1.name || source.label === TYPE_NODE.Label4.name || target.label === TYPE_NODE.Label4.name) {
                type = TYPE_EDGES.TYPE3
            }
        }
        this.elements.push(this.createEdge(source, type, target, addedEdge))
    }
    readFilePython = (file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            console.log(file.name)
            const groupNode = {
                id: getRandomUUID(),
            }
            const data = event.target.result;
            const lines = data.split('\n'); // split each row
            let func = "";
            let funcArray = [];
            let regex = /^\s/; // check blank
            lines.forEach((line) => {
                if (!line.includes('import')) {  // check 'import' row
                    if (line !== "" && !regex.test(line)) {
                        if (func) funcArray.push(func);  // push function to array
                        func = `${line}\n`;  // initialize function with new line
                    } else {
                        func += `${line}\n`;
                    }
                }
            });
            if (func) funcArray.push(func);
            const equalSymbol = "="
            const label2 = []
            const main = funcArray.find(content => content.includes('if __name__ == \'__main__\':'))
            const splitMain = main.split('\n');
            splitMain.forEach((line) => {
                const parts = line.split(equalSymbol);
                if (parts.length === 2) {
                    const value = parts[1].trim();
                    if (!isNaN(value) && value !== '') {
                        label2.push({
                            id: getRandomUUID(), parent: groupNode.id, properties: {
                                key1: parts[0].trim(),
                                key2: parts[1].trim(),
                                key3: null,
                                key4: new Date(),
                                sublabel: file.name,
                            }
                        });
                    }
                }
            })
            let fileResult
            const mainFunc = funcArray.find(content => content.includes('def main():'))
            const splitMainFunc = mainFunc.split('\n');
            for (let i = splitMainFunc.length - 1; i >= 0; i--) {
                const line = splitMainFunc[i];
                if (line.includes('to_csv')) {
                    const match = line.match(/'(\.\/\S+\.(csv|xlsx))'/);
                    if (match) {
                        fileResult = match[1].trim();
                        break
                    }
                } else if (line.includes('print')) {
                    const match = line.match(/"([^"]+)"/);
                    if (match) {
                        fileResult = match[1].trim()
                        break
                    }
                } else if (line.includes('return')) {
                    const match = line.match(/return\s+(.+)/);
                    if (match) {
                        fileResult = match[1].trim()
                        break
                    }
                }
            }

            const label2Result = {
                id: getRandomUUID(), parent: groupNode.id, properties: {
                    key1: fileResult, key2: null, key3: null, key4: new Date(), sublabel: file.name,

                }
            }
            const label3 = {
                id: getRandomUUID(), parent: groupNode.id, properties: {
                    key1: file.name, key2: new Date(), sublabel: file.name,
                }
            }
            let elements = []
            elements.push(this.createNodeParent(groupNode, TYPE_NODE.Sublabel.name, null));
            elements.push(this.createNode(label3, TYPE_NODE.Label3.name, TYPE_NODE.Label3.color), this.createNode(label2Result, TYPE_NODE.Label2.name, TYPE_NODE.Label2.color), this.createEdge(label3, TYPE_EDGES.TYPE1, label2Result));
            label2.forEach((param) => {
                elements.push(this.createNode(param, TYPE_NODE.Label2.name, TYPE_NODE.Label2.color), this.createEdge(param, TYPE_EDGES.TYPE1, label3));
            });
            runInAction(() => {
                this.elements = [...this.elements, ...elements];
            });
        };
        reader.readAsText(file);  // Read file as text
    }
    readFileExcel = (file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const data = event.target.result;
            try {
                const workbook = XLSX.read(data, {type: 'binary'});
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet);
                const label2 = []
                const label2Result = []
                const groupNode = {
                    id: getRandomUUID(),
                }
                const label3 = {
                    id: getRandomUUID(), parent: groupNode.id, properties: {
                        parent: groupNode.id, key1: file.name, key2: new Date(), sublabel: file.name,
                    }
                }
                jsonData.forEach((nodeData, index) => {
                    if (index > 0) {
                        label2.push({
                            id: getRandomUUID(), parent: groupNode.id, properties: {
                                key1: nodeData.input,
                                key2: nodeData.__EMPTY,
                                key3: nodeData.__EMPTY_1,
                                key4: new Date(),
                                sublabel: file.name,
                            }
                        })
                        label2Result.push({
                            id: getRandomUUID(), parent: groupNode.id, properties: {
                                key1: nodeData.output,
                                key2: nodeData.__EMPTY_4,
                                key3: nodeData.__EMPTY_5,
                                key4: new Date(),
                                sublabel: file.name,
                            }
                        })
                    }
                });
                let elements = []
                elements.push(this.createNodeParent(groupNode, TYPE_NODE.Sublabel.name, null));
                elements.push(this.createNode(label3, TYPE_NODE.Label3.name, TYPE_NODE.Label3.color),);

                label2Result.forEach((param) => {
                    elements.push(this.createNode(param, TYPE_NODE.Label2.name, TYPE_NODE.Label2.color), this.createEdge(label3, TYPE_EDGES.TYPE1, param),);
                });
                label2.forEach((param) => {
                    elements.push(this.createNode(param, TYPE_NODE.Label2.name, TYPE_NODE.Label2.color), this.createEdge(param, TYPE_EDGES.TYPE1, label3));
                });

                runInAction(() => {
                    this.elements = [...this.elements, ...elements];
                });
            } catch (e) {
                console.log(e)
            }
        }
        reader.readAsArrayBuffer(file); // Use readAsArrayBuffer instead of readAsBinaryString
    }
    submitGraph = async (value) => {
        const label1 = this.elements.find(element => element.data?.label === TYPE_NODE.Label1.name);
        if (!label1) {
            toast.warning("Label 1 is required in your process. Please ensure it exists.");
            return;
        }
        if (!label1.data?.properties?.comment) {
            toast.warning("Label 1 must have a comment.");
            return;
        }

        value.nodes().map((node) => {
            this.handleChangeNodePosition(node)
        });
        this.elements = this.elements.filter((element) => {
            return element.data?.label !== TYPE_NODE.Sublabel.name;
        });
        this.versionName = Date.now()
        const data = {
            versionName: this.versionName, elements: this.elements.map((element) => {
                const {id, source, target, ...restData} = element?.data || {};
                const newId = id ? "n" + id.replaceAll(/[-:]/g, "") : "";
                const newSource = source ? "n" + source.replaceAll(/[-:]/g, "") : "";
                const newTarget = target ? "n" + target.replaceAll(/[-:]/g, "") : "";
                return {
                    ...element, data: {
                        ...restData, id: newId, properties: {
                            ...element?.data?.properties, versionName: this.versionName, processName: this.processName
                        }, ...(element.group === "edges" && {
                            source: newSource, target: newTarget,
                        }),
                    },
                };
            }),
        };
        const response = await saveNewVersion(data)
        if (response.status === HttpStatus.OK) {
            toast.success('Update successfully.');
            window.location.replace('/process')
        } else if (response.status === HttpStatus.BAD_REQUEST) {
            toast.error('Update failed.');
        }
    }
    handleOpenEditNodePopup = () => {
        this.isEditNodePopupOpen = true
    }
    handleCloseEditNodePopup = () => {
        this.isEditNodePopupOpen = false
    }
    handleSelectedNode = (node) => {
        this.nodeSelected = node;
    }
    handleSaveNode = (node) => {
        this.elements = this.elements.map(element => {
            if (element.data.id === node.id) {
                return {
                    ...element, data: {
                        ...element.data, properties: node.properties
                    }
                };
            }
            return element;
        });
        this.nodeSelected = null;
        this.handleCloseEditNodePopup();
    }
    getProgramByProcessVersionName = async (processName, versionName) => {
        this.processName = processName
        const response = await getProgramByProcessVersionName(processName, versionName)
        if (response.status === HttpStatusCode.Ok) {
            const data = response.data.data;
            if (data) {
                this.getDateFromResponseToEle(data)
            }
        }
    }
    getLastVersionByProcess = async (process) => {
        const response = await getLastVersionByProcessName(process)
        if (response.status === HttpStatusCode.Ok) {
            const data = response.data.data;
            if (data) {
                this.getDateFromResponseToEle(data)
            }

        }
    }

    getDateFromResponseToEle(data) {
        const labelColorMap = new Map([[TYPE_NODE.Label1.name, TYPE_NODE.Label1.color], [TYPE_NODE.Label2.name, TYPE_NODE.Label2.color], [TYPE_NODE.Label3.name, TYPE_NODE.Label3.color], [TYPE_NODE.Label4.name, TYPE_NODE.Label4.color],]);
        this.elements = [...data.edges, ...data.elements?.map((element) => {
            const label = element?.data?.label;
            if (label && labelColorMap.has(label)) {
                element.data.color = labelColorMap.get(label);
            }
            return element;
        })];
    }

    checkNodeInGraphPosition = (isInPosition) => {
        this.isNodeInGraphPosition = isInPosition;
    }
    handleDragNode = (event) => {
        if (this.isNodeInGraphPosition) {
            const x = event.clientX;
            const y = event.clientY;
            const labelName = event.target.innerText; // Tên nhãn của node được kéo
            if (labelName === TYPE_NODE.Label1.name) {
                const isExistLabel1 = this.elements.some(element => {
                    const {label} = element?.data || {}; // Kiểm tra label của phần tử
                    return label === TYPE_NODE.Label1.name;
                });
                if (!isExistLabel1) {
                    const label = {
                        id: getRandomUUID(), properties: {
                            key1: labelName, key2: null, key3: null, key4: new Date(),
                        }
                    };
                    this.elements = [...this.elements, this.createNode(label, labelName, TYPE_NODE.Label1.color, // Chọn màu của Label1
                        x, y)];
                }
            } else {
                const label = {
                    id: getRandomUUID(), properties: {
                        key1: null, key2: null, key3: null, key4: null, key5: true, key6: new Date(),
                    }
                };
                this.elements = [...this.elements, this.createNode(label, labelName, labelName === TYPE_NODE.Label1.name ? TYPE_NODE.Label1.color : TYPE_NODE.Label4.color, x, y)];
            }
        }
    };
    handleChangeNodePosition = (node) => {
        this.elements = this.elements.map(element => {
            if (element.data.id === node.id()) {
                element.position = node.position()
                return element
            }
            return element;
        })
    }
    handleChangeNodeValue = (nodeId, newValue, props) => {
        this.elements = this.elements.map(element => {
            if (element.data.id === nodeId) {
                // Split the nested property path (e.g., "data.data" -> ["data", "data"])
                const propPath = props.split('.');
                let target = element;

                // Traverse the nested properties except the last one
                for (let i = 0; i < propPath.length - 1; i++) {
                    target = target[propPath[i]];
                    if (!target) return element; // If the path is invalid, return the original element
                }

                // Update the final property
                target[propPath[propPath.length - 1]] = newValue;
            }
            return element;
        });
    };
    handleChangeNodeSublabelSelected = (node) => {
        this.nodeSublabelSelected = node;
        console.log(this.nodeSublabelSelected)
    }
}
