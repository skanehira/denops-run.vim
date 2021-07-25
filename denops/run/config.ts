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
    Cmd: "go run",
    File: "%",
  },
  "go_test": {
    Type: "go",
    Runner: "terminal",
    Cmd: "go test",
    File: "%",
  },
  "go_bench": {
    Type: "go",
    Runner: "terminal",
    Cmd: "go test -bench",
    File: "%",
    Args: ["-benchmem"],
  },
  "deno_run": {
    Type: "typescript",
    Runner: "buffer",
    Cmd: "deno run --allow-all --unstable",
    File: "%",
  },
  "deno_test": {
    Type: "typescript",
    Runner: "terminal",
    Cmd: "deno test --allow-all --unstable",
    File: "%",
  },
};
