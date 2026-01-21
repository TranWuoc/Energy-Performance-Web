import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import RHFTextField from './RHFTextField';

export function DataCenterAnnualElectricityCard({ disabled }: { disabled?: boolean }) {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'generalInfo.dataCenterAnnualElectricity',
    });
    const readOnly = useWatch({ name: '__meta.readOnly' }) ?? false;
    const mergedDisabled = disabled ?? readOnly;

    return (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Stack spacing={2}>
                <Typography fontWeight={800}>Năng lượng tiêu thụ trung tâm dữ liệu</Typography>

                {fields.map((f, idx) => (
                    <Box
                        key={f.id}
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', md: '180px 1fr 120px' },
                            gap: 2,
                            alignItems: 'center',
                        }}
                    >
                        <RHFTextField
                            name={`generalInfo.dataCenterAnnualElectricity.${idx}.year`}
                            label="Năm"
                            type="number"
                        />
                        <RHFTextField
                            name={`generalInfo.dataCenterAnnualElectricity.${idx}.monthlyAverageEnergyConsumption`}
                            label="Năng lượng tiêu thụ trung bình hàng tháng"
                            type="number"
                        />

                        <Button
                            color="error"
                            variant="outlined"
                            onClick={() => remove(idx)}
                            startIcon={<RemoveCircleOutlineIcon />}
                            disabled={mergedDisabled}
                        >
                            Xoá
                        </Button>
                    </Box>
                ))}

                <Button
                    variant="contained"
                    onClick={() => append({ year: new Date().getFullYear(), energyConsumption: 0 })}
                    sx={{ width: 'fit-content' }}
                    startIcon={<AddCircleOutlineIcon />}
                    disabled={mergedDisabled}
                >
                    Thêm mới năm
                </Button>
            </Stack>
        </Paper>
    );
}
