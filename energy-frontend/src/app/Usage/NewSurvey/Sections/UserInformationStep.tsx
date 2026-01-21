import { Box, Stack } from '@mui/material';
import RHFTextField from '../Components/RHFTextField';

export default function UserInformationStep() {
    return (
        <Box>
            <Stack spacing={2}>
                <RHFTextField name="user.fullName" label="Họ và tên" fullWidth />

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <RHFTextField name="user.phone" label="Số điện thoại" fullWidth />

                    <RHFTextField name="user.email" label="Email" fullWidth />
                </Stack>
            </Stack>
        </Box>
    );
}
