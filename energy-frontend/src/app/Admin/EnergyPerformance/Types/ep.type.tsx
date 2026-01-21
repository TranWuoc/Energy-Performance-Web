// ep.type.tsx

export type BuildingType = 1 | 2; // 1 = Government, 2 = Commercial
export type DataSource = 1 | 2; // 1 = Hoá đơn điện hàng tháng, 2 = Công tơ điện / Báo cáo kiểm toán

/**
 * Inputs returned by BE (the calculator)
 */
export interface EPInputs {
    GFA: number; // Gross Floor Area (m²)
    CPA: number; // Car Park Area - outdoorParkingArea (m²)
    DCA: number; // Data Center Area (m²)
    GLA: number; // Gross Lettable Area - totalRentableArea (m²)

    FVR: number; // Vacant rate (0..1) = vacantArea / totalRentableArea

    TBEC: number; // Total Building Electricity Consumption (kWh)
    CPEC: number; // Car Park Electricity Consumption (kWh)
    DCEC: number; // Data Center Electricity Consumption (kWh)

    dataSource: DataSource | null; // BE có thể trả null nếu không có entry theo năm
}

/**
 * Normalised returned by BE (the calculator)
 */
export interface EPNormalised {
    EFA: number; // Effective Floor Area = GFA - CPA - DCA - (GLA * FVR)
    EEC: number; // Effective Energy Consumption = TBEC - CPEC - DCEC

    TF: number; // Time Factor (default 1)
    AWH: number | null; // Actual Working Hours (optional)
    WOH: number | null; // Working Hours (optional)
}

export interface EPRecord {
    _id: string;
    ruleVersion: string;
    year: number;

    buildingId: string;
    buildingName: string;
    buildingType: BuildingType;

    climateZone?: string | null;
    computedAt?: string; // ISO string

    ep: number;

    inputs: EPInputs;
    normalised: EPNormalised;
}
export interface EPListResponse {
    total: number;
    data: EPRecord[];
}
