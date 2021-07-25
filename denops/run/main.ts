import { Denops, isString } from "./deps.ts";

export async function main(denops: Denops): Promise<void> {
  await denops.cmd(
    `command! -nargs=1 Run call denops#notify("${denops.name}", "run", [<f-args>])`,
  );

  denops.dispatcher = {
    async run(args: unknown): Promise<void> {
      if (isString(args)) {
        console.log("hello", args);
      }
      await Promise.resolve();
    },
  };
}
