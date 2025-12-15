declare const _default: () => {
    nodeEnv: string;
    port: number;
    apiPrefix: string;
    database: {
        uri: string;
        testUri: string;
    };
    jwt: {
        secret: string;
        accessExpiration: string;
        refreshExpiration: string;
    };
    logging: {
        level: string;
        logToFile: boolean;
    };
};
export default _default;
