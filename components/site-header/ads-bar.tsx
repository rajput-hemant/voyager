import { ArrowUpRight } from "lucide-react";

import { AdsIcon1, AdsIcon2 } from "../icons";
import { Separator } from "../ui/separator";

export function Adsbar() {
  return (
    <div className="flex h-12 items-center justify-center">
      <div className="container items-center justify-between px-1 py-3.5">
        <div className="flex justify-between">
          <div className="flex w-full items-center gap-4 text-sm font-medium">
            <a
              href="https://voyager.online/strk-provisions-dashboard"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 p-2 pr-0 opacity-80 hover:opacity-100"
            >
              <AdsIcon1 className="size-4" />
              Check <p className="font-bold">STRK token</p> dashboard
              <ArrowUpRight strokeWidth={1.5} className="mr-2 size-5" />
            </a>
            <Separator orientation="vertical" className="h-6" />
            <a
              href="https://data.voyager.online/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 p-2 pr-0 opacity-80 hover:opacity-100"
            >
              <AdsIcon2 className="size-4" />
              Access <p className="font-bold">Starknet RPC</p> for free
              <ArrowUpRight strokeWidth={1.5} className="mr-2 size-5" />
            </a>
          </div>
          <div className="w-full"></div>
        </div>
      </div>
    </div>
  );
}
