import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/Layout';
import { Login } from '../pages/Login';
import { AdminDashboard } from '../pages/admin/Dashboard';
import { Users } from '../pages/admin/Users';
import { Clients } from '../pages/admin/Clients';
import { AdminRemissions } from '../pages/admin/AdminRemissions';
import { AdminFarms } from '../pages/admin/AdminFarms';
import { AdminCrops } from '../pages/admin/AdminCrops';
import { Farms } from '../pages/producer/Farms';
import { Crops } from '../pages/producer/Crops';
import { Remissions } from '../pages/producer/Remissions';
import { ProducerDashboard } from '../pages/producer/Dashboard';

const PrivateRoute: React.FC<{
  element: React.ReactElement;
  requiredRole?: 'ADMIN' | 'PRODUCER';
}> = ({ element, requiredRole }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <Layout>{element}</Layout>;
};

export const AppRoutes: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" /> : <Login />}
      />

      {/* Rutas del Administrador */}
      <Route
        path="/admin"
        element={
          <PrivateRoute
            element={<AdminDashboard />}
            requiredRole="ADMIN"
          />
        }
      />
      <Route
        path="/admin/users"
        element={
          <PrivateRoute
            element={<Users />}
            requiredRole="ADMIN"
          />
        }
      />
      <Route
        path="/admin/clients"
        element={
          <PrivateRoute
            element={<Clients />}
            requiredRole="ADMIN"
          />
        }
      />
      <Route
        path="/admin/remissions"
        element={
          <PrivateRoute
            element={<AdminRemissions />}
            requiredRole="ADMIN"
          />
        }
      />
      <Route
        path="/admin/farms"
        element={
          <PrivateRoute
            element={<AdminFarms />}
            requiredRole="ADMIN"
          />
        }
      />
      <Route
        path="/admin/crops"
        element={
          <PrivateRoute
            element={<AdminCrops />}
            requiredRole="ADMIN"
          />
        }
      />

      {/* Rutas del Productor */}
      <Route
        path="/producer"
        element={
          <PrivateRoute
            element={<ProducerDashboard />}
            requiredRole="PRODUCER"
          />
        }
      />
      <Route
        path="/producer/farms"
        element={
          <PrivateRoute
            element={<Farms />}
            requiredRole="PRODUCER"
          />
        }
      />
      <Route
        path="/producer/crops"
        element={
          <PrivateRoute
            element={<Crops />}
            requiredRole="PRODUCER"
          />
        }
      />
      <Route
        path="/producer/remissions"
        element={
          <PrivateRoute
            element={<Remissions />}
            requiredRole="PRODUCER"
          />
        }
      />

      {/* Redirección por defecto */}
      <Route
        path="/"
        element={
          <Navigate
            to={isAuthenticated ? (isAdmin ? '/admin' : '/producer') : '/login'}
            replace
          />
        }
      />
    </Routes>
  );
};

