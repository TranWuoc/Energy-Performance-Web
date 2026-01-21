import type { BuildingFormValues } from '../type/type';

const toStr = (v: unknown) => (v === undefined || v === null ? '' : String(v).trim());

const toBool = (v: unknown) => Boolean(v);

const toNum = (v: unknown) => {
    if (v === '' || v === undefined || v === null) return 0;
    const n = typeof v === 'number' ? v : Number(v);
    return Number.isFinite(n) ? n : 0;
};

const toTimeOrNull = (v: unknown): string | null => {
    if (v === undefined || v === null) return null;
    const s = String(v).trim();
    return s === '' ? null : s;
};

const normalizeTimeRange = (t: any) => ({
    from: toTimeOrNull(t?.from),
    to: toTimeOrNull(t?.to),
});

const normalizeZone = (z: any) => {
    const isRented = toBool(z?.isRented);

    return {
        zoneCode: toStr(z?.zoneCode),
        isRented,
        rentableArea: isRented ? z?.rentableArea : 0,

        weekday: normalizeTimeRange(z?.weekday),
        saturday: normalizeTimeRange(z?.saturday),
        sunday: normalizeTimeRange(z?.sunday),

        utilisationLevel: z?.utilisationLevel ?? '',
        averagePeople: toNum(z?.averagePeople),
        note: toStr(z?.note),
    };
};

const normalizeAnnualElectricity = (arr: any) =>
    Array.isArray(arr)
        ? arr.map((item) => ({
              year: toNum(item?.year),
              monthlyAverageEnergyConsumption: toNum(item?.monthlyAverageEnergyConsumption),
          }))
        : [];

const normalizeConsumedElectricityEntry = (e: any) => {
    const year = toNum(e?.year);
    const dataSource = e?.dataSource;

    const map = new Map<number, any>();
    (e?.monthlyData || []).forEach((m: any) => {
        const month = toNum(m?.month);
        if (month >= 1 && month <= 12) map.set(month, m);
    });

    const monthlyData = Array.from({ length: 12 }, (_, i) => {
        const month = i + 1;
        const item = map.get(month);
        return {
            month,
            energyConsumption: toNum(item?.energyConsumption),
        };
    });

    return { year, dataSource, monthlyData };
};

const normalizeSolar = (s: any) => ({
    isSelected: toBool(s?.isSelected),
    installedArea: toNum(s?.installedArea),
    installedCapacity: toNum(s?.installedCapacity),
    averageEfficiency: toNum(s?.averageEfficiency),
    averageSunHoursPerYear: toNum(s?.averageSunHoursPerYear),
    systemLosses: toNum(s?.systemLosses),
});

const normalizeWind = (w: any) => ({
    isSelected: toBool(w?.isSelected),
    turbineCount: toNum(w?.turbineCount),
    turbineCapacity: toNum(w?.turbineCapacity),
    averageWindSpeed: toNum(w?.averageWindSpeed),
    operatingHoursPerYear: toNum(w?.operatingHoursPerYear),
    capacityFactor: toNum(w?.capacityFactor),
});

const normalizeGeothermal = (g: any) => ({
    isSelected: toBool(g?.isSelected),
    installedCapacity: toNum(g?.installedCapacity),
    sourceTemperature: toNum(g?.sourceTemperature),
    operatingHoursPerYear: toNum(g?.operatingHoursPerYear),
    systemCOP: toNum(g?.systemCOP),
});

const normalizeProducedElectricityEntry = (p: any) => ({
    year: toNum(p?.year),
    solar: normalizeSolar(p?.solar),
    wind: normalizeWind(p?.wind),
    geothermal: normalizeGeothermal(p?.geothermal),
});

const normalizeGeneralInfo = (g: any) => ({
    ...g,
    name: toStr(g?.name),
    address: toStr(g?.address),
    owner: toStr(g?.owner),
    otherSystems: toStr(g?.otherSystems),
    controlSystemType: toStr(g?.controlSystemType),
    climateZone: toStr(g?.climateZone),

    buildingType: toNum(g?.buildingType),
    commissioningYear:
        g?.commissioningYear === undefined || g?.commissioningYear === null ? undefined : toNum(g?.commissioningYear),

    hasHVAC: toBool(g?.hasHVAC),
    hasLighting: toBool(g?.hasLighting),
    hasWaterHeating: toBool(g?.hasWaterHeating),

    setpointTemperature: g?.setpointTemperature ?? 0,
    setpointHumidity: g?.setpointHumidity ?? 0,
    setpointLightingLevel: g?.setpointLightingLevel ?? 0,

    outdoorParkingArea: toNum(g?.outdoorParkingArea),
    parkingAnnualElectricity: normalizeAnnualElectricity(g?.parkingAnnualElectricity),
    indoorParkingArea: toNum(g?.indoorParkingArea),
    dataCenterArea: toNum(g?.dataCenterArea),
    dataCenterAnnualElectricity: normalizeAnnualElectricity(g?.dataCenterAnnualElectricity),

    totalFloor: g?.totalFloor ?? 0,
    totalStoery: g?.totalStoery ?? 0,
    totalBasement: g?.totalBasement ?? 0,

    totalFloorArea: g?.totalFloorArea ?? 0,
    aboveGroundFloorArea: g?.aboveGroundFloorArea ?? 0,
    basementFloorArea: g?.basementFloorArea ?? 0,

    nonRentableArea: toNum(g?.nonRentableArea),
    totalRentableArea: toNum(g?.totalRentableArea),
    vacantArea: toNum(g?.vacantArea),
});

export function formatBuildingPayload(values: BuildingFormValues) {
    const operation = values?.operation || {};

    return {
        user: {
            fullName: toStr(values?.user?.fullName),
            email: toStr(values?.user?.email),
            phone: toStr(values?.user?.phone),
        },
        generalInfo: normalizeGeneralInfo(values?.generalInfo || {}),

        operation: {
            governmentZones: (operation.governmentZones || []).map(normalizeZone),
            commercialZones: (operation.commercialZones || []).map(normalizeZone),
        },

        consumedElectricity: (values?.consumedElectricity || []).map(normalizeConsumedElectricityEntry),

        producedElectricity: (values?.producedElectricity || []).map(normalizeProducedElectricityEntry),
    };
}
