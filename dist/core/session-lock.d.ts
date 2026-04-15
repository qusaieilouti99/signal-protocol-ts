export type JobType<T> = () => Promise<T>;
export declare class SessionLock {
    static queueJob<T>(id: string, runJob: JobType<T>): Promise<T>;
}
