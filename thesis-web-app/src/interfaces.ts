export interface SensorBoxDTO {
    thingName: string,
    CarAssigned: number | string,
    Coordinator: string,
    IsOn: boolean
}

export interface SensorBoxReachableDTO {
    thingName: string,
    isReachable: boolean,
    vibError: boolean,
}


export interface WorkerDTO {
    WorkerName: string
}


export interface BeaconDTO {
    shortID: string,
    isActive: boolean,
    zone: number,
    batteryLevel: number
}

export interface PlugDTO {
    shortID: string;
    isActive: boolean;
    position: number;

}

export interface AlarmDTO {
    Message: string,
    DeviceId: string,
    DeviceType: string,
    Date: string,
    Time: string,
    FixTip: string
}

export interface ActivityDTO {
    BoxName: string,
    Location: string,
    Activity: string,
    CarAssigned:string,
    Date: string,
    Time: string,
}

export interface SystemLogDTO {
    BoxName: string,
    LogFileNames: string[]
}

export interface ShopToolDTO {
    ToolModelKey: string;
    isActive: boolean;
    MaximumFrequency: number;
    MinimumFrequency: number;
    ToolBrand: string;
    ToolDescription: string;
    ToolName: string;
}

