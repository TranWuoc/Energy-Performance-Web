import { AppBar, Box, Button, Container, Toolbar } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

type NavKey = 'Trang chủ' | 'Khảo sát' | 'Bài viết' | 'Toà nhà';

const navConfig: { label: NavKey; path: string | string[] }[] = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Khảo sát', path: ['/survey', '/survey/:buildingId', '/survey/:buildingId/edit'] },
    { label: 'Bài viết', path: '/posts' }, // Giả sử sau này có route này
    { label: 'Toà nhà', path: '/buildings' },
];

function matchPath(path: string | string[], current: string) {
    if (Array.isArray(path)) {
        return path.some((p) => {
            if (p === '/') return current === '/';
            return current.startsWith(p.replace(/:.*$/, ''));
        });
    }
    if (path === '/') return current === '/';
    return current.startsWith(path.replace(/:.*$/, ''));
}

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <AppBar
            position="static"
            elevation={0}
            sx={{
                bgcolor: 'transparent',
                color: '#111',
            }}
        >
            <Container maxWidth="lg">
                <Toolbar
                    disableGutters
                    sx={{
                        height: 84,
                        px: { xs: 2, md: 3 },
                    }}
                >
                    {/* Left: logo */}
                    <Box sx={{ display: 'flex', alignItems: 'left', gap: 1.2, flex: '0 0 auto' }}>
                        <Box
                            component="img"
                            src="/Logo.svg"
                            alt="EEBM"
                            sx={{
                                height: 50,
                                width: '100%',
                                display: { xs: 'none', sm: 'block' },
                            }}
                            onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = 'none';
                            }}
                        />
                    </Box>

                    {/* Center nav */}
                    <Box
                        sx={{
                            flex: 1,
                            display: { xs: 'none', md: 'flex' },
                            justifyContent: 'center',
                            gap: 2.5,
                        }}
                    >
                        {navConfig.map((item) => (
                            <NavItem
                                key={item.label}
                                label={item.label}
                                active={matchPath(item.path, location.pathname)}
                                onClick={() => {
                                    if (typeof item.path === 'string') {
                                        navigate(item.path);
                                    } else {
                                        navigate(item.path[0]);
                                    }
                                }}
                            />
                        ))}
                    </Box>

                    {/* Right menu icon */}
                    <Box sx={{ flex: '0 0 auto', display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="outlined"
                            sx={{
                                textTransform: 'none',
                                fontWeight: 700,
                                px: 3,
                                py: 1,
                                borderRadius: 999,
                                borderColor: '#28A745',
                                color: '#28A745',
                                '&:hover': {
                                    borderColor: '#679540',
                                    backgroundColor: 'rgb(128, 194, 73)',
                                },
                            }}
                            onClick={() => {
                                navigate('/login');
                            }}
                        >
                            Đăng nhập
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

function NavItem(props: { label: string; active?: boolean; onClick?: () => void }) {
    const { label, active, onClick } = props;

    return (
        <Button
            onClick={onClick}
            disableRipple
            sx={{
                textTransform: 'none',
                fontWeight: 500,
                color: active ? '#14b86e' : 'rgba(0,0,0,0.55)',
                fontSize: 16,
                px: 1.2,
                '&:hover': { bgcolor: 'transparent', color: '#14b86e' },
            }}
        >
            {label}
        </Button>
    );
}
