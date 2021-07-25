import { buildConfig } from "./builder.ts";
import { assertEquals, FileTypeConfig } from "./deps.ts";

type TestCsae = {
  name: string;
  args: string;
  want: FileTypeConfig;
};

const tests: TestCsae[] = [
  {
    name: "build with -env",
    args: "go_run -env GOOS=linux GOARCH=amd64",
    want: {
      Type: "go",
      Runner: "buffer",
      Cmd: "go",
      Args: ["run"],
      Env: ["GOOS=linux", "GOARCH=amd64"],
    },
  },
  {
    name: "build with -env and -file",
    args: "go_run -env GOOS=linux GOARCH=amd64 -file main.go",
    want: {
      Type: "go",
      Runner: "buffer",
      Cmd: "go",
      Args: ["run"],
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
      Cmd: "go",
      Args: ["a", "b", "c"],
      File: "main.go",
      Env: ["GOOS=linux", "GOARCH=amd64"],
    },
  },
];

tests.forEach((test) => {
  Deno.test(test.name, () => {
    const got = buildConfig(test.args);
    assertEquals(got, test.want);
  });
});
