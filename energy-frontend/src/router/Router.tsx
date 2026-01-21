import { createBrowserRouter } from 'react-router-dom';
import BuildingDetailPage from '../app/Admin/BuildingDetail/index.tsx';
import BuildingsPageAdmin from '../app/Admin/Buildings/index.tsx';
import DashboardPage from '../app/Admin/Dashboard/index.tsx';
import EPPage from '../app/Admin/EnergyPerformance/index.tsx';
import EPDetailPage from '../app/Admin/EPDetail/index.tsx';
import Buildings from '../app/Buildings/index.tsx';
import LandingPage from '../app/LandingPage/index.tsx';
import LoginPage from '../app/Login/index.tsx';
import CreateBuildingWizard from '../app/Usage/NewSurvey/CreateBuildingWizard.tsx';
import '../index.css';
import AdminLayout from '../layouts/AdminLayout.tsx';
import MainLayout from '../layouts/MainLayout.tsx';
import { ProtectRouter } from './ProtectRouter.tsx';
import RouterErrorPage from './RouterErrorPage.tsx';

const router = createBrowserRouter([
    // { path: 'survey', element: <div style={{ padding: 24 }}>SURVEY OK</div> },
    {
        path: '/',
        element: <MainLayout />,
        errorElement: <RouterErrorPage />,
        children: [
            {
                index: true,
                element: <LandingPage />,
            },
            {
                path: 'survey',
                element: <CreateBuildingWizard mode="create" />,
            },
            {
                path: 'survey/:buildingId',
                element: <CreateBuildingWizard mode="view" />,
            },
            {
                path: 'survey/:buildingId/edit',
                element: <CreateBuildingWizard mode="edit" />,
            },
        ],
    },
    {
        path: '/buildings',
        element: <Buildings />,
    },
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/admin',
        element: (
            <ProtectRouter>
                <AdminLayout />
            </ProtectRouter>
        ),
        children: [
            {
                path: '/admin/dashboard',
                element: <DashboardPage />,
            },
            {
                path: '/admin/buildings',
                element: <BuildingsPageAdmin />,
            },
            {
                path: '/admin/buildings/:buildingId',
                element: <BuildingDetailPage />,
            },
            {
                path: '/admin/energy-performance',
                element: <EPPage />,
            },
            {
                path: '/admin/energy-performance/:buildingId',
                element: <EPDetailPage />,
            },
        ],
    },
]);

export default router;
