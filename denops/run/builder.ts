import { FileTypeConfig, runConfig } from "./deps.ts";

// Run go_run -env hello=world -args a b c %s
export function buildConfig(arg: string): FileTypeConfig {
  const options = [];
  const splitArg = arg.split(" ");

  const configName = splitArg[0];
  const config = getRunConfig(configName);
  if (!config) {
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
        config.Runner = option.values[0] ? "terminal" : "buffer";
        break;
      case "-cmd":
        config.Cmd = option.values[0];
    }
  });
  return config;
}

function isOption(v: string): boolean {
  return v.substr(0, 1) === "-";
}

function getRunConfig(name: string): FileTypeConfig {
  return runConfig[name];
}
