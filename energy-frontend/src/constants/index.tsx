import type { EPNormalisedForDisplay } from '../api/EP/ep.type';
import type { DropdownOption } from '../components/DropdownComponent/DropdownItems';

// Loại tòa nhà
export const BUILDING_TYPE_OPTIONS = [
    { label: 'Văn phòng công sở nhà nước', value: 1 },
    { label: 'Văn phòng thương mại', value: 2 },
];

// Mức độ sử dụng
export const UTILISATION_LEVEL_OPTIONS: DropdownOption<string>[] = [
    { label: 'Thấp (< 30%)', value: 'Thấp' },
    { label: 'Trung bình (30-70%)', value: 'Trung bình' },
    { label: 'Cao (> 70%)', value: 'Cao' },
];

// Loại kiểm soát hệ thống
export const CONTROL_SYSTEM_OPTIONS: DropdownOption<string>[] = [
    { label: 'Thủ công', value: 'manual' },
    { label: 'Bán tự động', value: 'semi-auto' },
    { label: 'Tự động hoàn toàn (BMS)', value: 'full-auto' },
];

// Năm vận hành (từ 1990 đến hiện tại)
export const YEAR_OPTIONS: DropdownOption<number>[] = Array.from(
    { length: new Date().getFullYear() - 1990 + 1 },
    (_, i) => ({
        label: `${1990 + i}`,
        value: 1990 + i,
    }),
).reverse();

export const DataSourceEnum = {
    BILL_OR_MANUAL: 1,
    METER_OR_SYSTEM: 2,
} as const;

export const BuildingType = {
    GOVERNMENT: 1,
    COMMERCIAL: 2,
} as const;

export type BuildingType = (typeof BuildingType)[keyof typeof BuildingType];

export type DataSourceEnum = (typeof DataSourceEnum)[keyof typeof DataSourceEnum];

export const DATA_SOURCE_LABEL: Record<number, string> = {
    [DataSourceEnum.BILL_OR_MANUAL]: 'Hoá đơn điện hàng tháng',
    [DataSourceEnum.METER_OR_SYSTEM]: 'Công tơ điện / Báo cáo kiểm toán',
};

export const BUILDING_TYPE_LABEL: Record<BuildingType, string> = {
    [BuildingType.GOVERNMENT]: 'Văn phòng công sở nhà nước',
    [BuildingType.COMMERCIAL]: 'Văn phòng thương mại',
};

export const ROLE_LABEL: Record<string, string> = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    viewer: 'Viewer',
};

export const EP_INPUT_META: Record<
    string,
    { label: string; unit?: string; formula?: string; formatter?: (v: any) => string }
> = {
    GFA: {
        label: 'Tổng diện tích sàn',
        unit: 'm²',
        formula: '𝐺𝐹𝐴 : tổng diện tích sàn của tòa nhà không tính đến khu vực bãi đỗ xe,tính bằng m2',
    },
    CPA: {
        label: 'Diện tích bãi đỗ xe ngoài trời',
        unit: 'm²',
        formula: 'CPA : tổng diện tích khu vực bãi đỗ xe ngoài nhà',
    },
    DCA: { label: 'Diện tích trung tâm dữ liệu', unit: 'm²', formula: 'DCA : diện tích trung tâm dữ liệu máy chủ' },
    GLA: {
        label: 'Tổng diện tích cho thuê',
        unit: 'm²',
        formula:
            '𝐺𝐿𝐴 là tổng diện tích của khu vực cho thuê bao gồm các diện tích của tòa nhà được sử dụng vào các mục đích như văn phòng, cửa hàng bán lẻ, quán cà phê, quán ăn, tập thể hình, câu lạc bộ, v.v… bên trong tòa nhà',
    },
    VA: { label: 'Diện tích trống', unit: 'm²' },
    EC: {
        label: 'Tổng mức năng lượng tiêu thụ',
        unit: 'kWh',
        formula: 'TBEC : tổng năng lượng tiêu thụ hàng năm của tòa nhà',
    },
    RE: {
        label: 'Năng lượng tái tạo',
        unit: 'kWh',
        formula: ' Tổng năng lượng tái tạo bao gồm điện mặt trời / điện gió / điện nhiệt',
    },
};

const formatNumber = (n: number) => n.toLocaleString();
const formatMaybe = (v: number | null | undefined) => (v == null ? '-' : formatNumber(v));

export const EP_NORMALISED_META: Record<
    keyof EPNormalisedForDisplay,
    {
        label: string;
        unit?: string;
        formula?: string;
        format?: (v: any) => string;
    }
> = {
    EFA: {
        label: 'Diện tích hiệu dụng',
        unit: 'm²',
        formula: 'EFA = GFA - CPA - DCA - (GLA * FVR)',
        format: (v) => formatNumber(v),
    },
    EEC: {
        label: 'Điện tiêu thụ hiệu dụng',
        unit: 'kWh/năm',
        formula:
            'Tổng năng lượng tiêu thụ hàng năm của tòa nhà TEEC = TBEC - CPEC - (Điện năng bãi đỗ xe + Điện năng trung tâm dữ liệu)',
        format: (v) => formatNumber(v),
    },
    AWH: {
        label: 'Giờ vận hành thực tế',
        unit: 'giờ/tuần',
        formula: '𝐴𝑊𝐻 là số giờ làm việc trung bình (điển hình) trong tuần, tính bằng giờ/tuần.',
        format: (v) => formatMaybe(v),
    },
    WOH: {
        label: 'Giờ vận hành tiêu chuẩn',
        unit: 'giờ/tuần',
        formula: 'WOH : số giờ làm việc theo trọng số trong tuần của từng khu vực cho thuê 𝐺𝐿𝐴, tính bằng giờ/tuần',
        format: (v) => formatMaybe(v),
    },
};
