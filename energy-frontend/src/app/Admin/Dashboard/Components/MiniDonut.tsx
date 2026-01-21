import { Box } from '@mui/material';

const MiniDonut = ({ percent }: { percent: number }) => (
    <Box
        sx={{
            width: 46,
            height: 46,
            borderRadius: '50%',
            background: `conic-gradient(#7fd13a ${percent}%, rgba(0,0,0,0.06) 0)`,
            display: 'grid',
            placeItems: 'center',
        }}
    >
        <Box
            sx={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                bgcolor: 'white',
                display: 'grid',
                placeItems: 'center',
                fontSize: 10,
                fontWeight: 950,
                color: 'text.secondary',
            }}
        >
            {percent}%
        </Box>
    </Box>
);

export default MiniDonut;
