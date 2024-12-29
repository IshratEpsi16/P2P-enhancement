// PrivateRoute.tsx
import React from 'react';
import { Route, Navigate, RouteProps as ReactRouteProps } from 'react-router-dom';

interface PrivateRouteProps {
    element: React.ReactNode;
    isAuthenticated: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, isAuthenticated, ...rest }) => {
    return isAuthenticated ? (
        <Route {...rest} element={element} />
    ) : (
        <Navigate to="/" />
    );
};

export default PrivateRoute;








