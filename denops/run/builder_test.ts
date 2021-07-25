import { buildCmd, buildConfig } from "./builder.ts";
import { assertEquals, FileTypeConfig, test } from "./deps.ts";

const buildConfigTests = [
  {
    name: "build with -env",
    args: "go_run -env GOOS=linux GOARCH=amd64",
    want: {
      Type: "go",
      Runner: "terminal",
      Cmd: "go run",
      Env: ["GOOS=linux", "GOARCH=amd64"],
      File: "tmp.go",
    },
  },
  {
    name: "build with -env and -file",
    args: "go_run -env GOOS=linux GOARCH=amd64 -file main.go",
    want: {
      Type: "go",
      Runner: "terminal",
      Cmd: "go run",
      File: "main.go",
      Env: ["GOOS=linux", "GOARCH=amd64"],
    },
  },
  {
    name: "build with all option",
    args:
      "go_run -env GOOS=linux GOARCH=amd64 -file main.go -args a b c -runner buffer",
    want: {
      Type: "go",
      Runner: "buffer",
      Cmd: "go run",
      Args: ["a", "b", "c"],
      File: "main.go",
      Env: ["GOOS=linux", "GOARCH=amd64"],
    },
  },
  {
    name: "build with no option",
    args: "go_run",
    want: {
      Type: "go",
      Runner: "terminal",
      Cmd: "go run",
      File: "main.go",
    },
  },
];

for (const t of buildConfigTests) {
  test("all", t.name, async (denops) => {
    await denops.cmd(`e ${t.want.File}`);
    const got = await buildConfig(denops, t.args);
    await denops.cmd(`bw!`);
    assertEquals(got, t.want);
  });
}

const buildCmdTests = [
  {
    name: "build with full config",
    config: {
      Type: "go",
      Runner: "terminal",
      Cmd: "go run",
      File: "main.go",
      Args: ["arg"],
      Env: ["GOOS=linux", "GOARCH=amd64"],
    } as FileTypeConfig,
    want: "GOOS=linux GOARCH=amd64 go run main.go arg",
  },
];

buildCmdTests.forEach((test) => {
  Deno.test(test.name, () => {
    const got = buildCmd(test.config);
    assertEquals(got, test.want);
  });
});
