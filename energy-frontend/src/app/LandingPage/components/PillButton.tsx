import { Button } from '@mui/material';
import React from 'react';

export default function PillButton({
    children,
    ...rest
}: React.ComponentProps<typeof Button> & { children: React.ReactNode }) {
    return (
        <Button
            {...rest}
            sx={{
                borderRadius: 999,
                px: 2.5,
                py: 0.8,
                color: 'white',
                borderColor: 'rgba(255,255,255,0.55)',
                textTransform: 'none',
                '&:hover': {
                    borderColor: 'rgba(255,255,255,0.85)',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                },
            }}
        >
            {children}
        </Button>
    );
}
