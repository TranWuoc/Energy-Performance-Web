import { Box, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { BUILDING_TYPE_OPTIONS } from '../../../../constants';
import { getSystemZoneConfig } from '../../../../constants/systemZones';
import { DataCenterAnnualElectricityCard } from '../Components/DataCenterAnnualElectricityCard';
import { ParkingAnnualElectricityCard } from '../Components/ParkingAnnualElectricityCard';
import RHFCheckbox from '../Components/RHFCheckbox';
import RHFSelect from '../Components/RHFSelect';
import RHFTextField from '../Components/RHFTextField';
import ZoneCard from '../Components/ZoneCard';

const CONTROL_SYSTEM_OPTIONS = [
    { label: 'Hệ thống điều khiển tập trung', value: 'Centralized' },
    { label: 'Hệ thống điều khiển phân tán', value: 'Distributed' },
    { label: 'Hệ thống điều khiển thông minh', value: 'Intelligent' },
    { label: 'Hệ thống điều khiển khác', value: 'Other' },
];

export default function GeneralInformationStep() {
    const { setValue } = useFormContext();

    const buildingType = useWatch({
        name: 'generalInfo.buildingType',
    }) as 1 | 2 | undefined;
    const zonesConfig = useMemo(() => {
        if (!buildingType) return [];
        return getSystemZoneConfig(buildingType);
    }, [buildingType]);

    const zoneBasePath = useMemo(() => {
        if (buildingType === 1) return 'generalInfo.governmentSystemZones';
        if (buildingType === 2) return 'generalInfo.commercialOfficeZones';
        return null;
    }, [buildingType]);

    const currentZones = useWatch({
        name: zoneBasePath as any,
    }) as any[] | undefined;

    useEffect(() => {
        if (!zoneBasePath || zonesConfig.length === 0) return;

        const normalised = zonesConfig.map((cfgZone) => {
            const existed = currentZones?.find((z) => z?.zoneCode === cfgZone.zoneCode);

            return (
                existed ?? {
                    zoneCode: cfgZone.zoneCode,
                    hvac: { from: null, to: null },
                    lighting: { from: null, to: null },
                    waterHeating: { from: null, to: null },
                    camera: { from: null, to: null },
                }
            );
        });

        setValue(zoneBasePath as any, normalised, {
            shouldDirty: false,
            shouldValidate: false,
        });
    }, [zoneBasePath, zonesConfig.length]);

    if (!buildingType) return null;

    const outdoorParkingArea = useWatch({ name: 'generalInfo.outdoorParkingArea' }) ?? 0;
    const dataCenterArea = useWatch({ name: 'generalInfo.dataCenterArea' }) ?? 0;

    useEffect(() => {
        if (outdoorParkingArea <= 0) {
            setValue('generalInfo.parkingAnnualElectricity', [], { shouldDirty: true });
        }
    }, [outdoorParkingArea, setValue]);

    useEffect(() => {
        if (dataCenterArea <= 0) {
            setValue('generalInfo.dataCenterAnnualElectricity', [], { shouldDirty: true });
        }
    }, [dataCenterArea, setValue]);

    return (
        <Stack spacing={3}>
            {/* ===== BASIC INFORMATION ===== */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Stack spacing={2}>
                    <Typography fontWeight={800}>Thông tin cơ bản</Typography>

                    {/* 2 columns */}
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                            gap: 2,
                        }}
                    >
                        <RHFTextField name="generalInfo.name" label="Tên toà nhà" placeholder="Nhập tên toà nhà" />

                        <RHFTextField name="generalInfo.owner" label="Chủ sở hữu" placeholder="Chủ sở hữu" />
                    </Box>

                    <RHFTextField name="generalInfo.address" label="Địa chỉ" placeholder="Nhập địa chỉ" />

                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
                            gap: 2,
                        }}
                    >
                        <RHFSelect
                            name="generalInfo.buildingType"
                            label="Kiểu văn phòng"
                            options={BUILDING_TYPE_OPTIONS}
                        />

                        <RHFTextField name="generalInfo.commissioningYear" label="Năm vận hành" type="number" />

                        <RHFTextField name="generalInfo.climateZone" label="Khu vực" />
                    </Box>
                </Stack>
            </Paper>

            {/* ===== SYSTEMS ===== */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Stack spacing={2}>
                    <Typography fontWeight={800}>Hệ thống toà nhà</Typography>

                    {/* checkboxes */}
                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                        <RHFCheckbox name="generalInfo.hasHVAC" label="Hệ thống HVAC" />
                        <RHFCheckbox name="generalInfo.hasLighting" label="Hệ thống chiếu sáng" />
                        <RHFCheckbox name="generalInfo.hasWaterHeating" label="Hệ thống nước nóng" />
                    </Box>

                    <RHFTextField name="generalInfo.otherSystems" label="Hệ thống khác" />

                    {/* setpoints */}
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr 1fr' },
                            gap: 2,
                        }}
                    >
                        <RHFTextField
                            name="generalInfo.setpointTemperature"
                            label="Nhiệt độ chung (°C)"
                            type="number"
                        />

                        <RHFTextField name="generalInfo.setpointHumidity" label="Độ ẩm chung (%)" type="number" />

                        <RHFTextField
                            name="generalInfo.setpointLightingLevel"
                            label="Độ sáng chung (lux)"
                            type="number"
                        />

                        <RHFSelect
                            name="generalInfo.controlSystemType"
                            label="Loại kiểm soát hệ thống "
                            options={CONTROL_SYSTEM_OPTIONS}
                        />
                    </Box>
                </Stack>
            </Paper>

            {/* ===== NEW SECTION: System operating hours by zone (belong to Step 1) ===== */}
            {!!buildingType && zonesConfig.length > 0 && (
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                    <Stack spacing={2}>
                        <Typography fontWeight={800}>Giờ vận hành các hệ thống thiết bị theo khu vực</Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            {zonesConfig.map((zone, idx) => (
                                <ZoneCard key={zone.zoneCode} zoneIndex={idx} zone={zone} basePath={zoneBasePath!} />
                            ))}
                        </Box>
                    </Stack>
                </Paper>
            )}

            {/* ===== AREAS ===== */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Stack spacing={2}>
                    <Typography fontWeight={800}>Diện tích tổng thể</Typography>

                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
                            gap: 2,
                        }}
                    >
                        <RHFTextField name="generalInfo.totalFloor" label="Tổng số tầng (Tầng)" type="number" />
                        <RHFTextField
                            name="generalInfo.totalStoery"
                            label="Tổng số tầng mặt đất (Tầng)"
                            type="number"
                        />

                        <RHFTextField name="generalInfo.totalBasement" label="Tổng số tầng hầm (Tầng)" type="number" />

                        <RHFTextField
                            name="generalInfo.totalFloorArea"
                            label="Tổng diện tích sàn xây dựng (GFA, m²)"
                            type="number"
                        />

                        <RHFTextField
                            name="generalInfo.aboveGroundFloorArea"
                            label="Tổng diện tích sàn mặt đất (m²)"
                            type="number"
                        />

                        <RHFTextField
                            name="generalInfo.basementFloorArea"
                            label="Tổng diện tích sàn tầng hầm (m²)"
                            type="number"
                        />

                        <RHFTextField
                            name="generalInfo.indoorParkingArea"
                            label="Diện tích bãi đỗ xe trong nhà (m²)"
                            type="number"
                        />

                        <RHFTextField
                            name="generalInfo.outdoorParkingArea"
                            label="Diện tích bãi đỗ xe ngoài trời (m²)"
                            type="number"
                        />

                        <RHFTextField
                            name="generalInfo.dataCenterArea"
                            label="Diện tích trung tâm dữ liệu (DCA, m²)"
                            type="number"
                        />

                        <RHFTextField
                            name="generalInfo.nonRentableArea"
                            label="Diện tích phần không cho thuê (m²)"
                            type="number"
                        />

                        <RHFTextField
                            name="generalInfo.totalRentableArea"
                            label="Tổng diện tích cho thuê (GLA, m²)"
                            type="number"
                        />

                        <RHFTextField name="generalInfo.vacantArea" label="Diện tích trống (m²)" type="number" />
                    </Box>
                    {outdoorParkingArea > 0 && <ParkingAnnualElectricityCard />}

                    {dataCenterArea > 0 && <DataCenterAnnualElectricityCard />}
                </Stack>
            </Paper>
        </Stack>
    );
}
