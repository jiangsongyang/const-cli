declare type CreateProjectOptions = {
  force?: boolean
}
export declare const createProject: (
  projectName: string,
  options: CreateProjectOptions
) => Promise<void>
export {}
