import { NextUIProvider } from '@nextui-org/react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import renderRoutes from './routes';
import Home from './pages/Home';
import { useContext } from 'react';
import AppProvider from './Context/AppProvider';
import { AuthContext } from './Context/AuthProvider';
function App() {
    const { user } = useContext(AuthContext);
    return (
        <NextUIProvider>
            <BrowserRouter>
                <AppProvider>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        {user?.role ? (
                            renderRoutes(user?.role)
                        ) : (
                            <Route path="*" element={<Navigate to="/" replace="true" />} />
                        )}
                    </Routes>
                </AppProvider>
            </BrowserRouter>
        </NextUIProvider>
    );
}

export default App;
