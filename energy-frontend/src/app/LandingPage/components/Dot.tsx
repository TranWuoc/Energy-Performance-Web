import { Box } from '@mui/material';

export default function Dot({ active }: { active?: boolean }) {
    return (
        <Box
            sx={{
                width: active ? 10 : 8,
                height: active ? 10 : 8,
                borderRadius: 999,
                bgcolor: active ? 'white' : 'rgba(255,255,255,0.55)',
                boxShadow: active ? '0 0 0 4px rgba(255,255,255,0.10)' : 'none',
            }}
        />
    );
}
