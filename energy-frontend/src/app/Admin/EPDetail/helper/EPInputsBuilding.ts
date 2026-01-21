import type { Building } from '../../../../api/buildings/building.type';

export function buildEPInputsFromBuilding(building: Building | undefined, year: number) {
    if (!building) {
        return {
            GFA: 0,
            CPA: 0,
            DCA: 0,
            GLA: 0,
            VA: 0,
            EC: 0,
            RE: 0,
            dataSource: null as 1 | 2 | null,
        };
    }

    const gi = building.generalInfo;

    // EC: tổng điện tiêu thụ theo năm
    const consumedYear = building.consumedElectricity?.find((y) => y.year === year);
    const EC = consumedYear?.monthlyData?.reduce((sum, m) => sum + (m.energyConsumption ?? 0), 0) ?? 0;

    // RE: tổng năng lượng tái tạo theo năm
    const producedYear = building.producedElectricity?.find((y) => y.year === year);

    let RE = 0;
    if (producedYear?.solar?.isSelected && producedYear.solar.installedCapacity) {
        RE += producedYear.solar.installedCapacity;
    }
    if (producedYear?.wind?.isSelected && producedYear.wind.turbineCapacity) {
        RE += producedYear.wind.turbineCapacity;
    }
    if (producedYear?.geothermal?.isSelected && producedYear.geothermal.installedCapacity) {
        RE += producedYear.geothermal.installedCapacity;
    }

    return {
        GFA: gi.totalFloorArea,
        CPA: gi.outdoorParkingArea ?? 0,
        DCA: gi.dataCenterArea ?? 0,
        GLA: gi.totalRentableArea,
        VA: gi.vacantArea ?? 0,
        EC,
        RE,
        dataSource: consumedYear?.dataSource ?? null,
    };
}
