declare class ValidationResultDto {
    criteriaIndex: number;
    passed: boolean;
    actualResult?: string;
}
export declare class CompleteStepDto {
    hintsUsed?: number;
    attempts?: number;
    timeSpent?: number;
    validationResults?: ValidationResultDto[];
    metadata?: Record<string, any>;
}
export {};
