import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import MailRoundedIcon from '@mui/icons-material/MailRounded';
import { Box, Button, Container, Divider, IconButton, Link, Stack, Typography } from '@mui/material';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

type FooterLink = { label: string; href?: string };

const NAVIGATE: FooterLink[] = [
    { label: 'Services', href: '#' },
    { label: 'Success Stories', href: '#' },
    { label: 'Discover', href: '#' },
    { label: 'Care', href: '#' },
    { label: 'Download App', href: '#' },
];

const SOLUTION: FooterLink[] = [
    { label: 'Get in Touch', href: '#' },
    { label: 'Technology', href: '#' },
    { label: `Who're We?`, href: '#' },
    { label: 'Expertise', href: '#' },
];

const DISCOVER: FooterLink[] = [
    { label: 'Latest News', href: '#' },
    { label: 'New Arrivals', href: '#' },
    { label: 'Solution', href: '#' },
    { label: 'Gain Profession', href: '#' },
    { label: 'Career', href: '#' },
];

const FOLLOW: FooterLink[] = [
    { label: 'Facebook', href: '#' },
    { label: 'Instagram', href: '#' },
    { label: 'LinkedIn', href: '#' },
    { label: 'Twitter', href: '#' },
];

function FooterColumn(props: { title: string; links: FooterLink[] }) {
    const { title, links } = props;
    return (
        <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 20, mb: 2 }}>{title}</Typography>
            <Stack spacing={1.2}>
                {links.map((l) => (
                    <Link
                        key={l.label}
                        href={l.href ?? '#'}
                        underline="none"
                        sx={{
                            color: 'text.secondary',
                            fontSize: 15,
                            '&:hover': { color: 'text.primary' },
                            width: 'fit-content',
                        }}
                    >
                        {l.label}
                    </Link>
                ))}
            </Stack>
        </Box>
    );
}

function ContactRow(props: { icon: React.ReactNode; primary: string; secondary?: string }) {
    const { icon, primary, secondary } = props;
    return (
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <IconButton
                disableRipple
                sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 999,
                    bgcolor: 'rgba(99, 102, 241, 0.10)',
                    color: 'primary.main',
                    border: '1px solid rgba(99, 102, 241, 0.18)',
                }}
            >
                {icon}
            </IconButton>

            <Box sx={{ pt: 0.5 }}>
                <Typography sx={{ fontSize: 15, color: 'text.primary' }}>{primary}</Typography>
                {secondary ? <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>{secondary}</Typography> : null}
            </Box>
        </Stack>
    );
}

export default function Footer() {
    const navigate = useNavigate();

    return (
        <Box
            component="footer"
            sx={{
                py: { xs: 4, md: 6 },
                px: { xs: 2, md: 3 },
                bgcolor: '#EEF3FF',
            }}
        >
            <Container maxWidth="xl">
                <Box
                    sx={{
                        borderRadius: 6,
                        bgcolor: '#F8FBFF',
                        boxShadow: '0 18px 45px rgba(15, 23, 42, 0.08)',
                        border: '1px solid rgba(15, 23, 42, 0.06)',
                        overflow: 'hidden',
                    }}
                >
                    <Box sx={{ px: { xs: 3, md: 6 }, pt: { xs: 4, md: 6 }, pb: { xs: 3, md: 4 } }}>
                        <Stack spacing={1.2} alignItems="center" textAlign="center">
                            <img src="/Logo.svg" alt="Logo" className="h-[50px]" />

                            <Typography sx={{ fontWeight: 900, fontSize: { xs: 28, md: 40 } }}>
                                Tham gia khảo sát năng lượng ngay hôm nay!
                            </Typography>

                            <Typography sx={{ color: 'text.secondary', maxWidth: 520 }}>
                                Tham gia khảo sát năng lượng miễn phí để khám phá cách tối ưu hóa hiệu suất năng lượng
                                và giảm chi phí vận hành cho doanh nghiệp của bạn.
                            </Typography>

                            <Button
                                variant="contained"
                                endIcon={<ArrowForwardRoundedIcon />}
                                sx={{
                                    mt: 1,
                                    px: 3,
                                    py: 1.2,
                                    borderRadius: 999,
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    boxShadow: 'none',
                                }}
                                onClick={() => navigate('survey')}
                            >
                                Tham gia khảo sát
                            </Button>
                        </Stack>
                    </Box>

                    <Divider sx={{ opacity: 0.6 }} />

                    {/* Links area */}
                    <Box sx={{ px: { xs: 3, md: 6 }, py: { xs: 4, md: 5 } }}>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    sm: '1fr 1fr',
                                    md: '1.25fr 1fr 1fr 1fr 1fr',
                                },
                                gap: { xs: 4, md: 5 },
                                alignItems: 'start',
                            }}
                        >
                            {/* Contact */}
                            <Box>
                                <Typography sx={{ fontWeight: 900, fontSize: 22, mb: 2 }}>Contact</Typography>
                                <Stack spacing={2.2}>
                                    <ContactRow
                                        icon={<LocalPhoneRoundedIcon fontSize="small" />}
                                        primary="+84 702 058 551"
                                    />
                                    <ContactRow
                                        icon={<LocationOnRoundedIcon fontSize="small" />}
                                        primary="Hanoi University of Civil Engineering"
                                        secondary="55 Giai Phong, Dong Tam, Hai Ba Trung, Hanoi, Vietnam"
                                    />
                                    <ContactRow
                                        icon={<MailRoundedIcon fontSize="small" />}
                                        primary="qt32486@gmail.com"
                                    />
                                </Stack>
                            </Box>

                            <FooterColumn title="Navigate" links={NAVIGATE} />
                            <FooterColumn title="Solution" links={SOLUTION} />
                            <FooterColumn title="Discover" links={DISCOVER} />
                            <FooterColumn title="Follow Us" links={FOLLOW} />
                        </Box>
                    </Box>

                    <Divider sx={{ opacity: 0.6 }} />

                    {/* Bottom bar */}
                    <Box
                        sx={{
                            px: { xs: 3, md: 6 },
                            py: 2.4,
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            gap: 2,
                            alignItems: { xs: 'flex-start', md: 'center' },
                            justifyContent: 'space-between',
                        }}
                    >
                        <Typography sx={{ color: 'text.secondary' }}>
                            ©Copyright{' '}
                            <Link href="#" underline="none" sx={{ fontWeight: 800 }}>
                                UnifiedUI.com
                            </Link>{' '}
                            all rights reserved. 2024
                        </Typography>

                        <Stack direction="row" spacing={3}>
                            <Link
                                href="#"
                                underline="none"
                                sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
                            >
                                Privacy &amp; Policy
                            </Link>
                            <Link
                                href="#"
                                underline="none"
                                sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
                            >
                                Terms &amp; Condition
                            </Link>
                        </Stack>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
