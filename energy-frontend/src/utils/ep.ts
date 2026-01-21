export function formatNumber(v: any) {
    if (v === null || v === undefined) return '-';
    if (typeof v !== 'number') return String(v);
    return v.toLocaleString('vi-VN');
}
export function formatPercentFromRatio(v?: number) {
    if (v === undefined || v === null) return '-';
    return `${(v * 100).toFixed(2)}%`;
}
