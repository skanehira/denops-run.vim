import { Denops } from "./deps.ts";

export async function runTerminal(denops: Denops, cmd: string) {
  if (await denops.call("has", "nvim")) {
    await denops.cmd("new");
    await denops.cmd(`terminal ${cmd}`);
  } else {
    await denops.cmd(`terminal ++shell ${cmd}`);
    await denops.cmd("nnoremap <buffer> <silent> <CR> :bw<CR>");
  }
}
