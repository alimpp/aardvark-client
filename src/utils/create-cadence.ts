export enum cadenceTypes {
    assignment = "assignment",
    nugget = "nugget",
    phase = "phase",
    resource = "resource"
}

export function createcadence(cadenceType: cadenceTypes, progress?: number, boarding?: string, hours?: number, totalHours?: number, isDelayedByEstimatedHours?: boolean, lastDelayedBy?: string): object {
    const cadence = {
        progress: progress ? progress : 0,
        tempo: boarding ? boarding : 'on-time',
        hours: hours ? hours : 0,
        totalHours: totalHours ? totalHours : 0,
        isDelayedByEstimatedHours: isDelayedByEstimatedHours ? isDelayedByEstimatedHours : false,
        lastDelayedBy: lastDelayedBy ? lastDelayedBy : '',
        cadenceType: cadenceType ? cadenceType : cadenceTypes.assignment
    }
    return cadence
}
