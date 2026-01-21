import { Box, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import RHFCheckbox from '../Components/RHFCheckbox';
import RHFSelect from '../Components/RHFSelect';
import RHFTextField from '../Components/RHFTextField';
import { SystemTimeRow } from '../Components/SystemTimeRow';
type ZoneConfig = {
    zoneCode: string;
    label: string;
};

const UTILISATION_OPTIONS = [
    { label: 'Cao', value: 'Cao' },
    { label: 'Trung bình', value: 'Trung bình' },
    { label: 'Thấp', value: 'Thấp' },
];

const GOVERNMENT_ZONES: ZoneConfig[] = [
    { zoneCode: 'admin_work', label: 'Khu làm việc hành chính' },
    { zoneCode: 'hall_meeting', label: 'Hội trường & phòng họp' },
    { zoneCode: 'lobby_reception', label: 'Sảnh chính & lễ tân' },
    { zoneCode: 'corridor_wc', label: 'Hành lang + WC' },
    { zoneCode: 'security', label: 'Bảo vệ / an ninh' },
    { zoneCode: 'indoor_parking', label: 'Khu đỗ xe trong nhà' },
];
const COMMERCIAL_ZONES: ZoneConfig[] = [
    { zoneCode: 'rental_office', label: 'Khu vực văn phòng cho thuê' },
    { zoneCode: 'hall_meeting', label: 'Hội trường & phòng họp lớn' },
    { zoneCode: 'lobby_reception', label: 'Sảnh chính & lễ tân' },
    { zoneCode: 'canteen_fnb', label: 'Căng tin, party, F&B services' },
    { zoneCode: 'corridor_wc', label: 'Hành lang + WC' },
    { zoneCode: 'commercial_area', label: 'Khu dịch vụ thương mại' },
    { zoneCode: 'security', label: 'Bảo vệ / an ninh' },
    { zoneCode: 'indoor_parking', label: 'Khu đỗ xe trong nhà' },
];

type ZoneFieldArrayName = 'operation.governmentZones' | 'operation.commercialZones';

type Props = {
    title: string;
    zoneCode: string;
    index: number;
    name: ZoneFieldArrayName;
    onRemove?: () => void;
    disableRemove?: boolean;
};

function OperationZoneCard({ title, zoneCode, index, name, onRemove, disableRemove }: Props) {
    const { setValue, getValues, watch } = useFormContext<any>();

    const basePath = `${name}.${index}`;

    // ✅ đảm bảo zoneCode luôn nằm trong form state
    useEffect(() => {
        const current = getValues(`${basePath}.zoneCode`);
        if (!current) {
            setValue(`${basePath}.zoneCode`, zoneCode, { shouldDirty: false });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [zoneCode, basePath]);

    const isRented = watch(`${basePath}.isRented`);

    return (
        <Paper variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
            <Stack spacing={2}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Box>
                        <Typography fontWeight={800}>{title}</Typography>
                    </Box>

                    {onRemove && (
                        <button
                            type="button"
                            onClick={onRemove}
                            disabled={disableRemove}
                            style={{ opacity: disableRemove ? 0.5 : 1 }}
                        >
                            Xoá
                        </button>
                    )}
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <Box sx={{ minWidth: 180 }}>
                        <RHFCheckbox name={`${basePath}.isRented`} label="Đang cho thuê" />
                    </Box>

                    <Box sx={{ flex: 1 }}>
                        <RHFTextField
                            name={`${basePath}.rentableArea`}
                            label="Diện tích cho thuê (m²)"
                            type="number"
                            inputProps={{ min: 0 }}
                            disabled={!isRented}
                        />
                    </Box>

                    <Box sx={{ minWidth: 220 }}>
                        <RHFSelect
                            name={`${basePath}.utilisationLevel`}
                            label="Mức sử dụng"
                            options={UTILISATION_OPTIONS}
                        />
                    </Box>
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <RHFTextField
                        name={`${basePath}.averagePeople`}
                        label="Số người TB"
                        type="number"
                        inputProps={{ min: 0 }}
                    />
                    <RHFTextField name={`${basePath}.note`} label="Ghi chú" />
                </Stack>

                {/* schedule */}
                <SystemTimeRow label="Hàng ngày (T2-T6)" baseName={`${basePath}.weekday`} />
                <SystemTimeRow label="Thứ 7" baseName={`${basePath}.saturday`} />
                <SystemTimeRow label="Chủ nhật" baseName={`${basePath}.sunday`} />
            </Stack>
        </Paper>
    );
}

export default function OperationBuildingStep() {
    const { watch, control } = useFormContext<any>();

    const buildingType = watch('generalInfo.buildingType');

    const govFA = useFieldArray({ control, name: 'operation.governmentZones' });
    const comFA = useFieldArray({ control, name: 'operation.commercialZones' });

    const zones = useMemo(() => {
        return buildingType === 1 ? GOVERNMENT_ZONES : COMMERCIAL_ZONES;
    }, [buildingType]);

    const activeFA = buildingType === 1 ? govFA : comFA;
    const activeName = buildingType === 1 ? 'operation.governmentZones' : 'operation.commercialZones';

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 2,
            }}
        >
            {zones.map((z: any, index) => (
                <OperationZoneCard
                    key={z.zoneCode}
                    title={z.label}
                    zoneCode={z.zoneCode}
                    index={index}
                    name={activeName}
                    disableRemove={(activeFA.fields?.length || 0) === 1}
                />
            ))}
        </Box>
    );
}
