import { Toaster } from 'react-hot-toast';
import { RouterProvider } from 'react-router-dom';
import router from './router/Router';

function App() {
    return (
        <>
            <RouterProvider router={router} />
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        </>
    );
}

export default App;
