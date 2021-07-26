import { buildCmd, buildConfig } from "./builder.ts";
import {
  assertEquals,
  assertThrowsAsync,
  FileTypeConfig,
  test,
} from "./deps.ts";

const buildConfigTestsSuccess = [
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
      "go_run -env GOOS=linux GOARCH=amd64 -file main.go -args a b c -runner buffer -cmd go test",
    want: {
      Type: "go",
      Runner: "buffer",
      Cmd: "go test",
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
for (const t of buildConfigTestsSuccess) {
  test("all", t.name, async (denops) => {
    await denops.cmd(`e ${t.want.File}`);
    const got = await buildConfig(denops, t.args);
    await denops.cmd(`bw!`);
    assertEquals(got, t.want);
  });
}

const buildConfigTestsFail = [
  {
    name: "build with invalid args",
    args: "go_run -env -args",
    want: "invalid args: go_run -env -args",
  },
  {
    name: "build with no exists config",
    args: "xxx",
    want: "not found config: xxx",
  },
];
for (const t of buildConfigTestsFail) {
  test("all", t.name, async (denops) => {
    await assertThrowsAsync(
      async () => {
        await buildConfig(denops, t.args);
      },
      Error,
      t.want,
    );
  });
}

test("all", "build with invalid buffer", async (denops) => {
  await denops.cmd("set ft=go");
  await assertThrowsAsync(
    async () => {
      await buildConfig(denops, "go_run");
    },
    Error,
    "buffer is empty",
  );
});

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
