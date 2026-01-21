import AppleIcon from '@mui/icons-material/Apple';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import { Box, Button, Divider, IconButton, Paper, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from './hooks/useLogin';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const { mutate: Login, isPending, error } = useLogin();

    const handleLogin = () => {
        Login({ username, password });
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: '#eef2f7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: { xs: 2, md: 4 },
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    width: 'min(1100px, 100%)',
                    borderRadius: 4,
                    overflow: 'hidden',
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                    border: '1px solid rgba(0,0,0,0.06)',
                    bgcolor: 'white',
                }}
            >
                {/* LEFT */}
                <Box sx={{ p: { xs: 3, md: 6 }, position: 'relative' }}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon fontSize="large" />}
                        onClick={() => navigate('/')}
                    ></Button>
                    <Box sx={{ mt: { xs: 3, md: 6 } }}>
                        <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: -1 }}>
                            Welcome to EEBM
                        </Typography>

                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1, maxWidth: 420 }}>
                            Chức năng đặng nhập chỉ dành cho quản trị viên hệ thống. Vui lòng liên hệ với bộ phận quản
                            lý để được cấp tài khoản.
                        </Typography>

                        <Box sx={{ mt: 4 }}>
                            <form onSubmit={(e) => e.preventDefault()}>
                                <Stack spacing={2.25}>
                                    <TextField
                                        error={!!error}
                                        label="Userename"
                                        placeholder="Nhập username admin"
                                        fullWidth
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        // onKeyDown={handleKeyDown}
                                    />

                                    <TextField
                                        error={!!error}
                                        label="Password"
                                        placeholder="Nhập mật khẩu admin"
                                        type="password"
                                        fullWidth
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        // onKeyDown={handleKeyDown}
                                    />

                                    <Button
                                        type="button"
                                        onClick={handleLogin}
                                        disabled={isPending}
                                        variant="contained"
                                        fullWidth
                                        sx={{
                                            py: 1.25,
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontWeight: 700,
                                            bgcolor: '#33CC00',
                                            '&:hover': { bgcolor: '#4A5D3A' },
                                        }}
                                    >
                                        {isPending ? 'Signing in...' : 'Đăng nhập'}
                                    </Button>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                                        <Divider sx={{ flex: 1 }} />
                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                            Or sign up with
                                        </Typography>
                                        <Divider sx={{ flex: 1 }} />
                                    </Box>

                                    <Stack direction="row" spacing={2} justifyContent="center">
                                        <Paper
                                            variant="outlined"
                                            sx={{
                                                width: 72,
                                                height: 44,
                                                borderRadius: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <IconButton aria-label="google">
                                                <GoogleIcon />
                                            </IconButton>
                                        </Paper>

                                        <Paper
                                            variant="outlined"
                                            sx={{
                                                width: 72,
                                                height: 44,
                                                borderRadius: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <IconButton aria-label="facebook">
                                                <FacebookIcon />
                                            </IconButton>
                                        </Paper>

                                        <Paper
                                            variant="outlined"
                                            sx={{
                                                width: 72,
                                                height: 44,
                                                borderRadius: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <IconButton aria-label="apple">
                                                <AppleIcon />
                                            </IconButton>
                                        </Paper>
                                    </Stack>
                                </Stack>
                            </form>
                        </Box>
                    </Box>
                </Box>

                {/* RIGHT */}
                <Box
                    sx={{
                        display: { xs: 'none', md: 'flex' },
                        bgcolor: '#EFEDE7',
                        color: 'white',
                        p: 6,
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    <img src="/abc.png" alt="Landing Page Image" className="h-[500px] w-[900px]" />
                </Box>
            </Paper>
        </Box>
    );
};

export default LoginPage;
