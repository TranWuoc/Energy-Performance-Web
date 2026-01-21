import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Layout/Footer';
import Header from '../components/Layout/Header';

function LandingPageLayout() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div>
            <div
                className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-none'}`}
            >
                <Header />
            </div>
            {/* MainContent */}
            <Box
                id="main-content"
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                }}
            >
                <Outlet />
            </Box>
            <div>
                <Footer />
            </div>
        </div>
    );
}

export default LandingPageLayout;
