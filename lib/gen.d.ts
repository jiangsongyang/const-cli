declare type CopyDirFn = (src: string, dst: string) => void;
export declare class Generator {
    name: string;
    targetDir: string;
    constructor(name: string, targetDir: string);
    getRepo(): Promise<any>;
    create(): Promise<void>;
    mkdir: (src: string, option?: {
        recursive: boolean;
    }) => Promise<unknown>;
    copyDir: (src: string, dst: string) => void;
    exists: (src: string, dst: string, callback: CopyDirFn) => void;
}
export {};
