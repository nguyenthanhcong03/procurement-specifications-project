import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import routes from "./routes";
import {Suspense} from "react";
import {Bounce, ToastContainer} from "react-toastify";
import {configure} from "mobx";
import ProtectedRoute from "./components/ProtectedRoute.jsx"; // Import the routes array
configure({
    enforceActions: "never", // 🚨 Disables strict-mode
});

function renderRoutes(routeArray) {
    return routeArray.map((route, index) =>
        route.children ? (
            <>
                <Route key={index}
                       element={<ProtectedRoute permissions={route.permissions === false}>{route.element}</ProtectedRoute>}
                >
                    {renderRoutes(route.children)} {/* Recursively render children */}
                </Route>
            </>

        ) : route.index ? (
            <Route key={index} index element={route.element}/>
        ) : route.permissions ? (

            // If permissions are defined, wrap route in ProtectedRoute
            <Route
                key={index}
                path={route.path}
                element={<ProtectedRoute permissions={route.permissions === false} children={route.element}></ProtectedRoute>}
            />
        ) : (
            <>
                <Route key={index} path={route.path}
                       element={<ProtectedRoute
                           permissions={route.permissions === false}>{route.element}</ProtectedRoute>}
                />
            </>
        )
    );
}

function App() {
    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
            <Router>
                <Suspense fallback={<h2>Loading...</h2>}>
                    <Routes>{renderRoutes(routes)}</Routes>
                </Suspense>
            </Router>
        </>
    );
}

export default App;
