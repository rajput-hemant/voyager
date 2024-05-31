"use client";

import React from "react";

import { Copy } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type CopyButtonProps = Omit<React.ComponentProps<"button">, "children"> & {
  text: string | number;
};

export function CopyButton(props: CopyButtonProps) {
  const [open, setOpen] = React.useState(false);

  function copyToClipboard() {
    navigator.clipboard.writeText(props.text.toString());

    setTimeout(() => {
      setOpen(false);
    }, 1000);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger onClick={copyToClipboard} {...props}>
        <Copy className="size-3.5 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent
        side="right"
        className="size-fit px-2 py-0.5 text-xs uppercase"
      >
        Copied!
      </PopoverContent>
    </Popover>
  );
}
