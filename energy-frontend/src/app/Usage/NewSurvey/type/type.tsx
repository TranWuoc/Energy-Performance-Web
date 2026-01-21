type TimeRange = { from: string | null; to: string | null };

export type UtilisationLevel = 'Thấp' | 'Trung bình' | 'Cao';

export type BuildingUser = {
    fullName: string;
    email: string;
    phone: string;
};

export type BaseOperationZone = {
    zoneCode: string;
    isRented: boolean;
    rentableArea: number | undefined;
    weekday: TimeRange;
    saturday: TimeRange;
    sunday: TimeRange;
    utilisationLevel: UtilisationLevel;
    averagePeople: number | undefined;
    note: string;
};

type ZoneSystems = {
    zoneCode: string;
    hvac?: TimeRange;
    lighting?: TimeRange;
    waterHeating?: TimeRange;
    camera?: TimeRange;
};

export type ProducedSolar = {
    isSelected: boolean;
    installedArea: number | null;
    installedCapacity: number | null;
    averageEfficiency: number | null;
    averageSunHoursPerYear: number | null;
    systemLosses: number | null;
};

export type ProducedWind = {
    isSelected: boolean;
    turbineCount: number | null;
    turbineCapacity: number | null;
    averageWindSpeed: number | null;
    operatingHoursPerYear: number | null;
    capacityFactor: number | null;
};

export type ProducedGeothermal = {
    isSelected: boolean;
    installedCapacity: number | null;
    sourceTemperature: number | null;
    operatingHoursPerYear: number | null;
    systemCOP: number | null;
};

export type ProducedElectricityYear = {
    year: number;
    solar?: ProducedSolar;
    wind?: ProducedWind;
    geothermal?: ProducedGeothermal;
};

export type BuildingFormValues = {
    buildingId?: string;
    user: BuildingUser;
    generalInfo: {
        name: string;
        address: string;
        buildingId?: string;
        owner?: string;

        buildingType: number;
        commissioningYear?: number;

        climateZone?: string;
        controlSystemType?: string;

        hasHVAC: boolean;
        hasLighting: boolean;
        hasWaterHeating: boolean;
        otherSystems?: string;

        setpointTemperature?: number;
        setpointHumidity?: number;
        setpointLightingLevel?: number;

        governmentSystemZones: ZoneSystems[];
        commercialOfficeZones: ZoneSystems[];

        totalFloor?: number;
        totalStoery?: number;
        totalBasement?: number;

        totalFloorArea?: number;
        aboveGroundFloorArea?: number;
        basementFloorArea?: number;

        indoorParkingArea?: number;
        outdoorParkingArea?: number;
        parkingAnnualElectricity?: { year: number; monthlyAverageEnergyConsumption: number }[];

        dataCenterArea?: number;
        dataCenterAnnualElectricity?: { year: number; monthlyAverageEnergyConsumption: number }[];

        nonRentableArea?: number;
        totalRentableArea?: number;
        vacantArea?: number;
    };

    operation: {
        governmentZones: BaseOperationZone[];
        commercialZones: BaseOperationZone[];
    };

    consumedElectricity: Array<{
        year: number;
        dataSource: 1 | 2;
        monthlyData: Array<{ month: number; energyConsumption: number }>;
    }>;

    producedElectricity: ProducedElectricityYear[];
};
