import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { Box, Typography } from '@mui/material';
import GlassIconButton from './GlassIconButton';

export default function BigImageCard(props: { title: string; location: string; image: string; tall?: boolean }) {
    const { title, location, image, tall } = props;
    return (
        <Box
            sx={{
                borderRadius: 6,
                overflow: 'hidden',
                position: 'relative',
                minHeight: tall ? '100%' : 280,
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
                        'linear-gradient(to top, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.10) 55%, rgba(0,0,0,0) 100%)',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    left: 20,
                    bottom: 18,
                }}
            >
                <Typography sx={{ color: 'white', fontSize: 26, lineHeight: 1.1 }}>{title}</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>{location}</Typography>
            </Box>
            <Box
                sx={{
                    position: 'absolute',
                    right: 14,
                    top: 14,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                }}
            >
                <GlassIconButton aria-label="Previous">
                    <ArrowBackIosNewRoundedIcon fontSize="small" />
                </GlassIconButton>
                <GlassIconButton aria-label="Next">
                    <ArrowForwardIosRoundedIcon fontSize="small" />
                </GlassIconButton>
            </Box>
        </Box>
    );
}
