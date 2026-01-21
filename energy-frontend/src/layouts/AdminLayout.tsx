import {
    Avatar,
    Box,
    Button,
    Chip,
    Divider,
    IconButton,
    InputBase,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt';
import SearchIcon from '@mui/icons-material/Search';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { ROLE_LABEL } from '../constants';
import { getCurrentAdmin } from '../utils/auth';

const SidebarItem = ({ icon, label, to }: { icon: React.ReactNode; label: string; to: string }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const active = pathname === to || pathname.startsWith(to + '/');

    return (
        <ListItemButton
            onClick={() => navigate(to)}
            sx={{
                borderRadius: 2,
                mb: 0.5,
                color: active ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.78)',
                bgcolor: active ? 'rgba(255,255,255,0.12)' : 'transparent',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.10)' },
                px: 1.5,
                py: 1.1,
            }}
        >
            <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>{icon}</ListItemIcon>
            <ListItemText primary={label} sx={{ fontSize: 14, fontWeight: active ? 800 : 700 }} />
        </ListItemButton>
    );
};

const AdminLayout = () => {
    const navigate = useNavigate();
    const admin = getCurrentAdmin();

    const handleLogout = () => {
        localStorage.removeItem('currentAdmin');
        localStorage.removeItem('accessToken');
        navigate('/login');
    };

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                bgcolor: '#f2f0ea',
                overflow: 'hidden',
            }}
        >
            {/* SIDEBAR */}
            <Box
                sx={{
                    width: 260,
                    bgcolor: '#1f2f1f',
                    color: 'white',
                    p: 2,

                    position: 'sticky',
                    top: 0,
                    height: '100vh',

                    overflowY: 'auto',
                    flexShrink: 0,

                    display: { xs: 'none', md: 'flex' },
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 1 }}>
                    <img src="/iconTab.svg" alt="Logo" width={30} />
                    <Typography fontWeight={900} fontSize={50}>
                        EEBM
                    </Typography>
                </Stack>

                <List sx={{ px: 0 }}>
                    <SidebarItem icon={<DashboardIcon />} label="Dashboard" to="/admin/dashboard" />
                    <SidebarItem icon={<AccountBalanceIcon />} label="Buildings" to="/admin/buildings" />
                    <SidebarItem icon={<OfflineBoltIcon />} label="Energy Performance" to="/admin/energy-performance" />
                    <SidebarItem icon={<TrendingUpIcon />} label="Benchmarking" to="/admin/Benchmarking" />
                    <SidebarItem icon={<AssessmentOutlinedIcon />} label="Report" to="/admin/reports" />
                    <SidebarItem icon={<SettingsOutlinedIcon />} label="Setting" to="/admin/settings" />
                </List>

                <Box sx={{ flex: 1 }} />

                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 3,
                        p: 2,
                        bgcolor: 'rgba(255,255,255,0.06)',
                        border: '1px dashed rgba(255,255,255,0.18)',
                    }}
                >
                    <Typography fontWeight={900} sx={{ mb: 0.5 }}>
                        Upgrade to Pro 🔥
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.85 }}>
                        Unlock all the Pro features for free for 1 month
                    </Typography>
                    <Button
                        fullWidth
                        sx={{
                            mt: 1.5,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 900,
                            bgcolor: 'rgba(255,255,255,0.12)',
                            color: 'white',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.16)' },
                        }}
                    >
                        Upgrade
                    </Button>
                </Paper>

                <Stack spacing={0.75} sx={{ px: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ opacity: 0.9 }}>
                        <HelpOutlineIcon fontSize="small" />
                        <Typography fontWeight={800} fontSize={14}>
                            Help & Centre
                        </Typography>
                    </Stack>

                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{ opacity: 0.9, cursor: 'pointer' }}
                        onClick={handleLogout}
                    >
                        <LogoutOutlinedIcon fontSize="small" />
                        <Typography fontWeight={800} fontSize={14}>
                            Logout
                        </Typography>
                    </Stack>
                </Stack>
            </Box>

            {/* MAIN */}
            <Box
                sx={{
                    flex: 1,
                    height: '100vh',
                    overflowY: 'auto',
                    p: { xs: 2, md: 3 },
                }}
            >
                {/* TOPBAR */}
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            px: 1.5,
                            py: 1,
                            borderRadius: 3,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            width: { xs: '100%', md: 520 },
                            border: '1px solid rgba(0,0,0,0.06)',
                            bgcolor: 'rgba(255,255,255,0.8)',
                        }}
                    >
                        <SearchIcon sx={{ color: 'text.secondary' }} />
                        <InputBase placeholder="Search" sx={{ flex: 1, fontWeight: 700 }} />
                        <Chip size="small" label="⌘ F" sx={{ bgcolor: 'rgba(0,0,0,0.05)', fontWeight: 900 }} />
                    </Paper>

                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1.25}
                        sx={{ display: { xs: 'none', md: 'flex' } }}
                    >
                        <IconButton>
                            <NotificationsNoneOutlinedIcon />
                        </IconButton>

                        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

                        {admin && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Avatar sx={{ width: 32, height: 32 }}>
                                    {(admin.fullName?.[0] ?? admin.username?.[0] ?? 'A').toUpperCase()}
                                </Avatar>

                                <Box sx={{ lineHeight: 1.1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 800 }}>
                                        {admin.fullName || admin.username}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {ROLE_LABEL[admin.role] ?? admin.role}
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                    </Stack>
                </Stack>

                {/* Page content */}
                <Outlet />
            </Box>
        </Box>
    );
};

export default AdminLayout;
