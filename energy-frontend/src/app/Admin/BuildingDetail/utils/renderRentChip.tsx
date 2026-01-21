import { Chip } from '@mui/material';

export function RenderRentStatusChip({ isRented }: { isRented?: boolean }) {
    if (isRented === true) {
        return <Chip size="small" label="Đang cho thuê" color="success" sx={{ fontWeight: 700 }} />;
    }

    return <Chip size="small" label="Không cho thuê" variant="outlined" sx={{ fontWeight: 600 }} />;
}
