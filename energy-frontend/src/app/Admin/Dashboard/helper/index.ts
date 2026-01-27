import type { Building } from '../../../../api/buildings/building.type';

export function safeNumber(n: unknown, fallback = 0): number {
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

export function pickEPValue(row: { EP?: number; ep?: number } | undefined | null) {
    if (typeof row?.EP === 'number') return row.EP;
    if (typeof row?.ep === 'number') return row.ep;
    return null;
}
