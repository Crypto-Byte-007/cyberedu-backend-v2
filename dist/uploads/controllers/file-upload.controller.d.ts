export declare class FileUploadController {
    getQuota(req: any): {
        success: boolean;
        data: {
            used: number;
            limit: number;
            remaining: number;
            percentage: number;
            formatted: {
                used: string;
                limit: string;
                remaining: string;
            };
        };
        message: string;
        timestamp: string;
        path: string;
    };
}
