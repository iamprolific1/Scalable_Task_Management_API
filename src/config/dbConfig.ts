import mongoose, { ConnectOptions } from "mongoose";

export interface DbConfig {
    uri: string;
    dbName?: string;
    options?: ConnectOptions;
}

export class DbConnection implements DbConfig {
    uri: string;
    dbName?: string | undefined;
    options?: ConnectOptions | undefined;

    constructor(config: DbConfig) {
        this.uri = config.uri;
        this.dbName = config.dbName;
        this.options = config.options;
    }

    async connect(): Promise<void> {
        try {
            const options: ConnectOptions = { ...this.options, dbName: this.dbName};
            await mongoose.connect(this.uri, options);
            console.log("Database connected successfully");
            return;
        } catch (error) {
            console.log("Error connecting database: ", error as Error);
            process.exit(1);
        }
    }

    async closeConnection(): Promise<void> {
        try {
            await mongoose.disconnect();
            console.log("Connection closed");
        } catch (error) {
            console.error("Error closing database connection: ", error as Error)
        }
    }
}