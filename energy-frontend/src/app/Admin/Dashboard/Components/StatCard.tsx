import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Box, Chip, IconButton, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const StatCard = ({
    title,
    value,
    hint,
    rightChip,
    icon,
    bgicon,
    morePath,
}: {
    title: string;
    value: string;
    hint: string;
    rightChip?: string;
    icon?: React.ReactNode;
    bgicon?: string;
    morePath?: string;
}) => {
    const navigate = useNavigate();

    return (
        <Paper
            elevation={0}
            sx={{ p: 2.25, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)', bgcolor: 'white', minHeight: 132 }}
        >
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Box
                        sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 2,
                            bgcolor: bgicon || 'rgba(0,0,0,0.05)',
                            display: 'grid',
                            placeItems: 'center',
                        }}
                    >
                        {icon}
                    </Box>
                    <Typography fontWeight={950} fontSize={14}>
                        {title}
                    </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                    {rightChip ? (
                        <Chip size="small" label={rightChip} sx={{ bgcolor: 'rgba(0,0,0,0.05)', fontWeight: 900 }} />
                    ) : null}
                    {morePath && (
                        <IconButton size="small" onClick={() => navigate(morePath)}>
                            <MoreHorizIcon fontSize="small" />
                        </IconButton>
                    )}
                </Stack>
            </Stack>
            <Typography fontWeight={950} fontSize={28} letterSpacing={-0.6} sx={{ mt: 1.2 }}>
                {value}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.6 }}>
                {hint}
            </Typography>
        </Paper>
    );
};

export default StatCard;
