import { BuildingType } from '../api/buildings/building.type';

export type SystemKey = 'hvac' | 'lighting' | 'waterHeating' | 'camera';

export type SystemZoneConfig = {
    zoneCode: string;
    label: string;
    systems: SystemKey[];
};

// GOV (buildingType=1) - đúng 5 khu theo BE enum: administration/meeting/lobby/corridor_wc/security
export const GOV_SYSTEM_ZONE_CONFIG: SystemZoneConfig[] = [
    { zoneCode: 'administration', label: 'Khu vực làm việc hành chính', systems: ['hvac', 'lighting', 'camera'] },
    { zoneCode: 'meeting', label: 'Hội trường & phòng họp lớn', systems: ['hvac', 'lighting', 'camera'] },
    { zoneCode: 'lobby', label: 'Sảnh chính & lễ tân', systems: ['hvac', 'lighting', 'camera'] },
    {
        zoneCode: 'corridor_wc',
        label: 'Hành lang, cầu thang bộ, khu vệ sinh',
        systems: ['hvac', 'lighting', 'waterHeating', 'camera'],
    },
    { zoneCode: 'security', label: 'Khu bảo vệ/ an ninh', systems: ['hvac', 'lighting', 'camera'] },
];

// COM (buildingType=2) - BE enum: rental_office/meeting/lobby/corridor_wc/security/canteen_fnb/commercial_area/indoor_parking
export const COM_SYSTEM_ZONE_CONFIG: SystemZoneConfig[] = [
    { zoneCode: 'rental_office', label: 'Khu vực văn phòng cho thuê', systems: ['hvac', 'lighting', 'waterHeating'] },
    { zoneCode: 'meeting', label: 'Hội trường & phòng họp lớn', systems: ['hvac', 'lighting'] },
    { zoneCode: 'lobby', label: 'Sảnh chính & lễ tân', systems: ['hvac', 'lighting'] },
    {
        zoneCode: 'corridor_wc',
        label: 'Hành lang, cầu thang bộ, khu vệ sinh',
        systems: ['hvac', 'lighting', 'waterHeating'],
    },
    { zoneCode: 'security', label: 'Khu bảo vệ/ an ninh', systems: ['hvac', 'lighting', 'camera'] },
    { zoneCode: 'canteen_fnb', label: 'Căng tin / F&B services', systems: ['hvac', 'lighting', 'waterHeating'] },
    { zoneCode: 'commercial_area', label: 'Khu dịch vụ thương mại', systems: ['hvac', 'lighting'] },
    { zoneCode: 'indoor_parking', label: 'Khu đỗ xe trong nhà', systems: ['lighting', 'camera'] },
];

export function getSystemZoneConfig(buildingType: 1 | 2) {
    return buildingType === BuildingType.GOVERNMENT ? GOV_SYSTEM_ZONE_CONFIG : COM_SYSTEM_ZONE_CONFIG;
}
