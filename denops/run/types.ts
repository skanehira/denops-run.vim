export type Runner = "buffer" | "terminal";

export interface FileTypeConfig {
  Type: string;
  Runner: Runner;
  Env?: string[];
  Cmd: string;
  File: string;
  Args?: string[];
  // TODO
  // Stdin: any;
  // Stdout: any;
}

export interface RunConfig {
  [key: string]: FileTypeConfig;
}
