import {
    BuildingType,
    type CommercialZoneCode,
    type GovernmentZoneCode,
} from '../../../../api/buildings/building.type';

export const ZONE_LABEL: {
    [BuildingType.GOVERNMENT]: Record<GovernmentZoneCode, string>;
    [BuildingType.COMMERCIAL]: Record<CommercialZoneCode, string>;
} = {
    [BuildingType.GOVERNMENT]: {
        admin_work: 'Khu làm việc hành chính',
        hall_meeting: 'Hội trường / phòng họp',
        lobby_reception: 'Sảnh – lễ tân',
        corridor_wc: 'Hành lang – WC',
        security: 'Khu an ninh',
        indoor_parking: 'Bãi đỗ xe trong nhà',
    },

    [BuildingType.COMMERCIAL]: {
        rental_office: 'Văn phòng cho thuê',
        hall_meeting: 'Hội trường / phòng họp',
        lobby_reception: 'Sảnh – lễ tân',
        canteen_fnb: 'Căn tin / F&B',
        commercial_area: 'Khu thương mại',
        indoor_parking: 'Bãi đỗ xe trong nhà',
        corridor_wc: 'Hành lang – WC',
        security: 'Khu an ninh',
    },
};

export function getZoneLabel(buildingType: 1 | 2, zoneCode: string) {
    if (buildingType === BuildingType.GOVERNMENT) {
        return ZONE_LABEL[BuildingType.GOVERNMENT][zoneCode as GovernmentZoneCode] ?? zoneCode;
    }
    return ZONE_LABEL[BuildingType.COMMERCIAL][zoneCode as CommercialZoneCode] ?? zoneCode;
}
