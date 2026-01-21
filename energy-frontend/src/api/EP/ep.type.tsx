// Inputs dùng để tính toán EP
export interface EPInputs {
    GFA: number; // Gross Floor Area - Tổng diện tích sàn
    CPA: number; // Car Park Area - Diện tích bãi đỗ xe ngoài trời
    DCA: number; // Data Center Area - Diện tích trung tâm dữ liệu
    GLA: number; // Gross Lettable Area - Tổng diện tích cho thuê
    VA: number; // Vacant Area - Diện tích trống
    EC: number; // Energy Consumption - Năng lượng tiêu thụ (kWh)
    RE: number; // Renewable Energy - Năng lượng tái tạo (kWh)
    dataSource: 1 | 2; // 1 = Hoá đơn điện hàng tháng, 2 = Công tơ điện / Báo cáo kiểm toán
}

export interface EPNormalised {
    EFA: number; // Effective Floor Area (m²)
    EEC: number; // Effective Electricity Consumption (kWh/year)
    TF?: number; // Time Factor
    AWH: number | null; // Actual Working Hours
    WOH: number | null; // Standard Working Hours
}

// Schema chính của Energy Performance
export interface EnergyPerformance {
    buildingId: string;
    year: number;
    ep: number; // Chỉ số hiệu suất năng lượng (kWh/m²/năm)
    buildingType: 1 | 2; // 1 = Công sở, 2 = Thương mại
    buildingName: string;
    climateZone?: string;

    inputs: EPInputs;
    normalised: EPNormalised;

    ruleVersion: string;
    computedAt: Date;

    createdAt?: Date;
    updatedAt?: Date;
}

// Response khi lấy EP theo buildingId
export interface EPResponse {
    success: boolean;
    data: EnergyPerformance | EnergyPerformance[];
    message?: string;
}

// Request tính toán EP
export interface EPCalculationRequest {
    buildingId: string;
    year?: number; //
}

export type EPNormalisedForDisplay = Pick<EPNormalised, 'EFA' | 'EEC' | 'AWH' | 'WOH'>;
