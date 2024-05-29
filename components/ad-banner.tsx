import { Skeleton } from "./ui/skeleton";

export function AdBanner() {
  return (
    <div className="relative z-0 h-[90px] overflow-hidden rounded-lg">
      <ins className="z-20 rounded-lg">
        <iframe
          src="https://v1.slise.xyz/serve/iframe/6ce42483-c6cd-47a0-8f36-a36cd9103fca?pub=pub-32&amp;size=728x90&amp;slot=transactions-desktop&amp;path=%2Ftxns&amp;rnd=t8z4rtq5psqs8509s07dw2zies8r9hhuyjl69eanu&amp;host=voyager.online"
          width="728px"
          height="90px"
        />
      </ins>
      <Skeleton className="absolute inset-0 -z-10" />
    </div>
  );
}
