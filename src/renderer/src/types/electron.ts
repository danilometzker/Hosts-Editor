export type ElectronAPI = {
    invoke: (channel: string, args?: any) => Promise<any>;
    send: (channel: string, args?: any) => void;
    on: (channel: string, callback: (...data: any[]) => void) => void;
    shell: typeof import("electron").shell;
    readFile: (filePath: string) => string;
    writeFile: (
        filePath: string,
        data: string
    ) => Promise<{
        success: boolean;
        message: string;
    }>;
};
