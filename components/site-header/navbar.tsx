import Link from "next/link";

import {
  Check,
  ChevronDown,
  Construction,
  Lightbulb,
  Search,
  UserRound,
} from "lucide-react";

import { AdsIcon1, Dot, Logo } from "../icons";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";

export function Navbar() {
  return (
    <header className="sticky flex h-24 items-center bg-secondary">
      <div className="container grid grid-cols-[6fr_3fr_1.5fr] items-center justify-items-end gap-8 p-5">
        <div className="grid w-full grid-cols-[160px_1fr] place-items-center gap-4">
          <Link href="/">
            <Logo className="h-10 w-40" />
          </Link>

          <div className="relative inline-flex w-full flex-nowrap items-center self-start">
            <Search className="absolute top-1/2 ml-6 size-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by blocks / transactions / addresses"
              className="size-full h-14 rounded-full border-none pl-[60px] pr-5 font-mono font-medium leading-[100%] placeholder:font-mono placeholder:text-base"
            />
            <kbd className="absolute right-3.5 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-2xl bg-secondary px-4 py-1 font-medium text-secondary-foreground">
              CTRL+k
            </kbd>
          </div>
        </div>
        <div className="flex items-center">
          <nav className="relative grid">
            <ul className="relative flex h-16 items-center justify-center gap-10 *:flex *:size-full *:items-center *:font-medium">
              <li>
                <DropdownMenu>
                  <DropdownMenuTrigger className="group inline-flex items-center justify-center gap-2 outline-none">
                    Blockchain
                    <ChevronDown className="ml-auto size-4 duration-300 group-data-[state=open]:rotate-180" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <UnderDevelopment />
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
              <li>
                <DropdownMenu>
                  <DropdownMenuTrigger className="group inline-flex items-center justify-center gap-2 outline-none">
                    Data
                    <ChevronDown className="ml-auto size-4 duration-300 group-data-[state=open]:rotate-180" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <UnderDevelopment />
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
              <li>
                <DropdownMenu>
                  <DropdownMenuTrigger className="group inline-flex items-center justify-center gap-2 outline-none">
                    Dev
                    <ChevronDown className="ml-auto size-4 duration-300 group-data-[state=open]:rotate-180" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <UnderDevelopment />
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
              <li>
                <a
                  href="https://voyager.online/strk-provisions-dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex h-11 flex-col items-center justify-center overflow-hidden rounded-lg border border-zinc-700 bg-[rgb(42,40,40)] px-4 text-xs font-medium uppercase leading-none"
                >
                  <AdsIcon1 className="absolute -bottom-3 -right-8 scale-[4] opacity-40 mix-blend-lighten duration-300 group-hover:-bottom-2 group-hover:-right-5" />
                  <span>Strk</span>
                  <span>Dashboard</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                className="group gap-3 rounded-full !bg-[#383838] py-[22px]"
              >
                <Dot className="size-2.5 fill-green-400" />
                Mainnet
                <ChevronDown className="size-4 duration-300 group-data-[state=open]:rotate-180" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-80 px-0 py-2">
              <DropdownMenuItem className="gap-2 px-4 py-3.5">
                <Dot className="size-2.5 fill-green-400" />
                Mainnet
                <Check className="ml-auto size-5" />
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 px-4 py-3.5">
                <Dot className="size-2.5 fill-green-400" />
                Sepolia
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" className="hover:bg-transparent">
            <UserRound />
          </Button>

          <Button variant="ghost" className="hover:bg-transparent">
            <Lightbulb />
          </Button>
        </div>
      </div>
    </header>
  );
}

function UnderDevelopment() {
  return (
    <div className="flex w-56 flex-col items-center justify-center p-4">
      <Construction className="size-24 stroke-orange-500" />
      <p className="text-lg font-semibold">Under Development</p>
    </div>
  );
}
