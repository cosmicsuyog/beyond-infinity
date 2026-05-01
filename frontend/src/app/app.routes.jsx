import { createBrowserRouter } from 'react-router'
import Home from '../features/public-pages/pages/Home'
import Dashboard from '../features/dashboard/pages/dashboard'
import AuthPage from '../features/auth/pages/AuthPage'
import ProtectedRoute from '../features/auth/components/ProtectedRoute'

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/auth",
        element: <AuthPage />,
    },
    {
        path: "/dashboard",
        element: (
            // <ProtectedRoute>
            //     <Dashboard />
            // </ProtectedRoute>
            <Dashboard />
        ),
    },
])

