import { IconButton } from '@mui/material';
import React from 'react';

export default function GlassIconButton(props: React.ComponentProps<typeof IconButton>) {
    return (
        <IconButton
            {...props}
            sx={{
                width: 38,
                height: 38,
                borderRadius: 999,
                bgcolor: 'rgba(255,255,255,0.20)',
                color: 'white',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.25)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.28)' },
            }}
        />
    );
}
