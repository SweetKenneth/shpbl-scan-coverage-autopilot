export interface ScanTarget { id:string; risk:number; lastScannedAt:string|null; estimatedMinutes:number; requiredCapabilities:string[]; }
export interface Scanner { id:string; capacityMinutes:number; capabilities:string[]; }
export interface ScanHistory { scannerId:string; targetId:string; durationMinutes:number; completedAt:string; }
export interface CoveragePolicy { maxAgeHoursByRisk:[number,number][]; horizonMinutes:number; }
export interface ScheduledScan { targetId:string; scannerId:string; durationMinutes:number; priority:number; overdueHours:number; }
export interface UnscheduledTarget { targetId:string; reason:"NO_COMPATIBLE_SCANNER"|"CAPACITY_EXHAUSTED"; priority:number; }
export interface CoverageAnalysis { totalTargets:number; overdueTargets:string[]; neverScannedTargets:string[]; riskWeightedCoverage:number; blindRisk:number; }
export interface ScanPlan { now:string; seal:string; scheduled:ScheduledScan[]; unscheduled:UnscheduledTarget[]; scannerLoad:Record<string,number>; riskWeightedCoverageBefore:number; riskWeightedCoverageAfter:number; scheduledRisk:number; }
