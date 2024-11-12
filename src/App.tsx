import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { LoadingProvider } from './context/LoadingContext';
import { ErrorProvider } from './context/ErrorContext';
import { AuthProvider } from './context/AuthContext';
import { ConfirmProvider } from './context/ConfirmContext';
import { AppRoutes } from './routes';

const App: React.FC = () => {
  return (
    <Router>
      <LoadingProvider>
        <ErrorProvider>
          <AuthProvider>
            <ConfirmProvider>
              <AppRoutes />
            </ConfirmProvider>
          </AuthProvider>
        </ErrorProvider>
      </LoadingProvider>
    </Router>
  );
};

export default App;