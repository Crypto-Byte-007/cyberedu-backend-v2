export declare enum ExportFormat {
    PDF = "pdf",
    CSV = "csv",
    JSON = "json",
    EXCEL = "excel"
}
export declare class ExportReportDto {
    format: ExportFormat;
    includeDetails?: boolean;
    filename?: string;
}
