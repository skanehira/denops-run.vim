import { Denops, FileTypeConfig, runConfig } from "./deps.ts";
import type { Runner } from "./deps.ts";

// Run go_run -env hello=world -args a b c %s
export async function buildConfig(
  denops: Denops,
  arg: string,
): Promise<FileTypeConfig> {
  const options = [];
  const splitArg = arg.split(" ");

  const configName = splitArg[0];
  const config = { ...getRunConfig(configName) };
  if (Object.keys(config).length === 0) {
    throw new Error(`not found config: ${configName}`);
  }

  let idx = 1;
  while (true) {
    if (idx >= splitArg.length) {
      break;
    }

    const key = splitArg[idx];
    // output:
    //   key: -env
    //   valu: [HOEG=1, FUGA=2]
    const option = {
      key: "",
      values: [] as string[],
    };
    if (isOption(key)) {
      option.key = key;
      idx++;
    }

    // invalid: go_run -env
    if (idx >= splitArg.length) {
      throw new Error(`invalid args: ${arg}`);
    }
    // get option values
    while (true) {
      if (idx >= splitArg.length) {
        break;
      }
      if (isOption(splitArg[idx])) {
        break;
      }
      const v = splitArg[idx];
      option.values.push(v);
      idx++;
    }

    options.push(option);
  }

  if (config.File === "%") {
    const filename = await denops.call("bufname") as string;
    const modified = await denops.eval("&modified");
    if (!filename && !modified) {
      throw new Error(`buffer is empty`);
    }
    config.File = filename;
  }

  options.forEach((option) => {
    switch (option.key) {
      case "-env":
        config.Env = option.values;
        break;
      case "-args":
        config.Args = option.values;
        break;
      case "-file":
        config.File = option.values[0];
        break;
      case "-runner":
        config.Runner = option.values[0] as Runner;
        break;
      case "-cmd":
        config.Cmd = option.values.join(" ");
    }
  });

  if (await denops.eval("&modified")) {
    config.File = await createTmp(denops, config.Type);
  }

  return config;
}

export async function createTmp(denops: Denops, ft: string): Promise<string> {
  const filename = `${await Deno.makeTempFile()}.${ft}`;
  const lines = await denops.eval("getline(1, '$')") as string[];
  await Deno.writeTextFile(filename, lines.join("\n"));
  return filename;
}

export function buildCmd(config: FileTypeConfig): string {
  const cmd = [];
  if (config.Env) {
    config.Env.forEach((env) => {
      cmd.push(env);
    });
  }

  cmd.push(config.Cmd);

  cmd.push(config.File);
  if (config.Args) {
    config.Args.forEach((arg) => {
      cmd.push(arg);
    });
  }

  return cmd.join(" ");
}

function isOption(v: string): boolean {
  return v.substr(0, 1) === "-";
}

function getRunConfig(name: string): FileTypeConfig {
  return runConfig[name];
}
