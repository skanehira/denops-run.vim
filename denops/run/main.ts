import { buildCmd, buildConfig, Denops, isString } from "./deps.ts";

export async function main(denops: Denops): Promise<void> {
  await denops.cmd(
    `command! -nargs=1 Run call denops#notify("${denops.name}", "run", [<f-args>])`,
  );

  denops.dispatcher = {
    async run(args: unknown): Promise<void> {
      if (isString(args)) {
        const config = await buildConfig(denops, args);
        if (config.Runner === "terminal") {
          const cmd = buildCmd(config);
          await denops.cmd(`terminal ${cmd}`);
        }
      }
    },
  };
}
