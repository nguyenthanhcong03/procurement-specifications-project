import { createContext, useContext } from "react";
import PropTypes from "prop-types";
import { store } from "./stores"; // Import the store object

const StoreContext = createContext(null); // Initialize context without `store`

export const StoreProvider = ({ children }) => {
    return (
        <StoreContext.Provider value={store}>
            {children}
        </StoreContext.Provider>
    );
};

StoreProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error("useStore must be used within a StoreProvider");
    }
    return context;
};

export { StoreContext };
