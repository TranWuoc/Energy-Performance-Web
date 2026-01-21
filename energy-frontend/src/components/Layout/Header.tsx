import { AppBar, Box, Button, Container, Toolbar } from '@mui/material';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

type NavKey = 'Trang chủ' | 'Khảo sát' | 'Bài viết' | 'Toà nhà';

export default function Header() {
    const [active, setActive] = React.useState<NavKey>('Trang chủ');
    const navigate = useNavigate();
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
                                // fallback nếu chưa có svg
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
                        <NavItem
                            label="Trang chủ"
                            active={active === 'Trang chủ'}
                            onClick={() => {
                                setActive('Trang chủ');
                                navigate('/');
                            }}
                        />
                        <NavItem
                            label="Khoả sát"
                            active={active === 'Khảo sát'}
                            onClick={() => {
                                setActive('Khảo sát');
                                navigate('/survey');
                            }}
                        />
                        <NavItem
                            label="Bài viết"
                            active={active === 'Bài viết'}
                            onClick={() => setActive('Bài viết')}
                        />
                        <NavItem label="Toà nhà" active={active === 'Toà nhà'} onClick={() => setActive('Toà nhà')} />
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
                color: active ? '#111' : 'rgba(0,0,0,0.55)',
                fontSize: 16,
                px: 1.2,
                '&:hover': { bgcolor: 'transparent', color: '#111' },
            }}
        >
            {label}
        </Button>
    );
}
