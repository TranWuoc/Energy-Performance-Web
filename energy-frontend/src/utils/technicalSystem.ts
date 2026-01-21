type TechnicalSystemFlags = {
    hasHVAC?: boolean;
    hasLighting?: boolean;
    hasWaterHeating?: boolean;
    otherSystems?: string;
};

export function convertTechnicalSystems(flags: TechnicalSystemFlags): string[] {
    const systems: string[] = [];

    if (flags.hasHVAC) systems.push('Hệ thống HVAC');
    if (flags.hasLighting) systems.push('Hệ thống chiếu sáng');
    if (flags.hasWaterHeating) systems.push('Hệ thống cấp nước nóng');
    if (flags.otherSystems) systems.push(flags.otherSystems);

    return systems;
}
