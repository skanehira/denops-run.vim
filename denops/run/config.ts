import { RunConfig } from "./deps.ts";

export const Cmds: {
  [key: string]: string;
} = {
  "go": "go",
  "typescript": "deno",
};

export const runConfig: RunConfig = {
  "go_run": {
    Type: "go",
    Runner: "buffer",
    Cmd: "go",
    Args: ["run"],
  },
  "go_test": {
    Type: "go",
    Runner: "terminal",
    Cmd: "go",
    Args: ["test"],
    File: "%s_test.go",
  },
  "go_bench": {
    Type: "go",
    Runner: "terminal",
    Cmd: "go",
    Args: ["test", "-bench", ".", "-benchmem"],
    File: "%s_test.go",
  },
  "deno_run": {
    Type: "typescript",
    Runner: "buffer",
    Cmd: "deno",
    Args: ["run", "--allow-all", "--unstable"],
    File: "%s",
  },
  "deno_test": {
    Type: "typescript",
    Runner: "terminal",
    Cmd: "deno",
    Args: ["test", "--allow-all", "--unstable"],
    File: "%s",
  },
};
