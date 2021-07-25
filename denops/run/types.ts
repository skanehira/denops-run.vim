export interface FileTypeConfig {
  Type: string;
  Runner: "buffer" | "terminal";
  Cmd: string;
  Args?: string[];
  File?: string;
  Env?: string[];
  // TODO
  // Stdin: any;
  // Stdout: any;
}

export interface RunConfig {
  [key: string]: FileTypeConfig;
}
