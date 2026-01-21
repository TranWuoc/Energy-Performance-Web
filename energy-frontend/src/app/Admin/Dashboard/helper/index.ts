import type { Building } from '../../../../api/buildings/building.type';

export function safeNumber(n: any, fallback = 0) {
    const x = Number(n);
    return Number.isFinite(x) ? x : fallback;
}

export function hasAnyRenewable(b?: Building) {
    const produced = b?.producedElectricity || [];
    if (produced.length === 0) return false;
    return produced.some((y) => {
        const solar = !!y?.solar?.isSelected;
        const wind = !!y?.wind?.isSelected;
        const geo = !!y?.geothermal?.isSelected;
        return solar || wind || geo;
    });
}

export function sumAnnualConsumptionForYear(building: Building, year: number) {
    const row = (building.consumedElectricity || []).find((x) => Number(x.year) === Number(year));
    if (!row) return 0;
    return (row.monthlyData || []).reduce((sum, m) => sum + safeNumber(m.energyConsumption), 0);
}

export function extractEPArray(epApiData: any) {
    if (Array.isArray(epApiData)) return epApiData;
    if (epApiData?.data && Array.isArray(epApiData.data)) return epApiData.data;
    return [];
}

export function pickEPValue(row: any) {
    if (typeof row?.EP === 'number') return row.EP;
    if (typeof row?.ep === 'number') return row.ep;
    return null;
}
