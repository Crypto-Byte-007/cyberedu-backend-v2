export declare class ReportsController {
    getMyReports(req: any): {
        success: boolean;
        data: {
            reports: any[];
            summary: {
                totalReports: number;
                averageScore: number;
                totalTimeSpent: number;
            };
        };
        message: string;
        timestamp: string;
        path: string;
    };
}
