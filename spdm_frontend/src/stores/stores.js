import GraphStore from "./graphStore.js";
import VersionStore from "./versionStore.js";
import UserStore from "./userStore.js";
import ProcessStore from "./processStore.js";

export const store = {
    processStore: new ProcessStore(),
    graphStore: new GraphStore(),
    versionStore: new VersionStore(),
    userStore: new UserStore(),
};
