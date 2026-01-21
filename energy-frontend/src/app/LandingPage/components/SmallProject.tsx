import { Box, Typography } from '@mui/material';

export default function SmallProjectCard(props: { title: string; location: string; image: string }) {
    const { title, location, image } = props;
    return (
        <Box
            sx={{
                borderRadius: 6,
                overflow: 'hidden',
                position: 'relative',
                minHeight: { xs: 200, md: 240 },
                boxShadow: '0 10px 24px rgba(25, 60, 140, 0.12)',
            }}
        >
            <Box
                component="img"
                src={image}
                alt={title}
                sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    background:
                        'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.10) 60%, rgba(0,0,0,0) 100%)',
                }}
            />
            <Box sx={{ position: 'absolute', left: 18, bottom: 16, right: 18 }}>
                <Typography sx={{ color: 'white', fontSize: 22, lineHeight: 1.1 }}>{title}</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>{location}</Typography>
            </Box>
        </Box>
    );
}
