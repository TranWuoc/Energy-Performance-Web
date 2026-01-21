import { BuildingType } from '../api/buildings/building.type';

export const GOV_ZONE_CODES = [
    'admin_work',
    'hall_meeting',
    'lobby_reception',
    'corridor_wc',
    'security',
    'indoor_parking',
] as const;

export const COM_ZONE_CODES = [
    'rental_office',
    'hall_meeting',
    'lobby_reception',
    'corridor_wc',
    'security',
    'canteen_fnb',
    'commercial_area',
    'indoor_parking',
] as const;

export type GovernmentZoneCode = (typeof GOV_ZONE_CODES)[number];
export type CommercialZoneCode = (typeof COM_ZONE_CODES)[number];

export const GOV_ZONE_LABEL: Record<GovernmentZoneCode, string> = {
    admin_work: 'Khu làm việc hành chính',
    hall_meeting: 'Hội trường & phòng họp lớn',
    lobby_reception: 'Sảnh chính & lễ tân',
    corridor_wc: 'Hành lang, cầu thang bộ, khu vệ sinh',
    security: 'Khu bảo vệ / an ninh',
    indoor_parking: 'Khu đỗ xe trong nhà',
};

export const COM_ZONE_LABEL: Record<CommercialZoneCode, string> = {
    rental_office: 'Văn phòng cho thuê',
    hall_meeting: 'Hội trường & phòng họp lớn',
    lobby_reception: 'Sảnh chính & lễ tân',
    corridor_wc: 'Hành lang, cầu thang bộ, khu vệ sinh',
    security: 'Khu bảo vệ / an ninh',
    canteen_fnb: 'Căng tin / F&B / party',
    commercial_area: 'Khu dịch vụ thương mại',
    indoor_parking: 'Khu đỗ xe trong nhà',
};

export const ZONE_LABEL_BY_TYPE = {
    [BuildingType.GOVERNMENT]: GOV_ZONE_LABEL,
    [BuildingType.COMMERCIAL]: COM_ZONE_LABEL,
} as const;
