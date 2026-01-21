import { Paper, Stack, Typography } from '@mui/material';
import type { SystemKey, SystemZoneConfig } from '../../../../constants/systemZones';
import { SystemTimeRow } from './SystemTimeRow';

const SYSTEM_LABEL: Record<SystemKey, string> = {
    hvac: 'Hệ thống HVAC',
    lighting: 'Hệ thống chiếu sáng',
    waterHeating: 'Hệ thống cấp nước nóng',
    camera: 'Hệ thống camera',
};

type Props = {
    zoneIndex: number;
    zone: SystemZoneConfig;
    basePath?: string;
};

export default function ZoneCard({ zoneIndex, zone, basePath = 'operation.zones' }: Props) {
    const base = `${basePath}.${zoneIndex}`;

    return (
        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Stack spacing={2}>
                <Typography fontWeight={800}>{zone.label}</Typography>

                {zone.systems.map((sys) => (
                    <SystemTimeRow
                        key={sys}
                        label={SYSTEM_LABEL[sys]}
                        baseName={`${base}.${sys}`}
                        placeholder="--:--"
                    />
                ))}
            </Stack>
        </Paper>
    );
}
