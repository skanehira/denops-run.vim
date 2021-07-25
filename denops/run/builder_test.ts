import { buildCmd, buildConfig } from "./builder.ts";
import { assertEquals, FileTypeConfig, test } from "./deps.ts";

const buildConfigTests = [
  {
    name: "build with -env",
    args: "go_run -env GOOS=linux GOARCH=amd64",
    want: {
      Type: "go",
      Runner: "buffer",
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
      Runner: "buffer",
      Cmd: "go run",
      File: "main.go",
      Env: ["GOOS=linux", "GOARCH=amd64"],
    },
  },
  {
    name: "build with all option",
    args:
      "go_run -env GOOS=linux GOARCH=amd64 -file main.go -args a b c -runner terminal",
    want: {
      Type: "go",
      Runner: "terminal",
      Cmd: "go run",
      Args: ["a", "b", "c"],
      File: "main.go",
      Env: ["GOOS=linux", "GOARCH=amd64"],
    },
  },
];

for (const t of buildConfigTests) {
  test("all", t.name, async (denops) => {
    await denops.cmd(`e ${t.want.File}`);
    const got = await buildConfig(denops, t.args);
    assertEquals(got, t.want);
    await denops.cmd(`bw!`);
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
