import PropTypes from "prop-types";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ token = '' }) => {
    return token ? <Outlet /> : <Navigate to="/sign-in" replace />;
};

ProtectedRoute.propTypes = {
    token: PropTypes.string
}

export default ProtectedRoute

