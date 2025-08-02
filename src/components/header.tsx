"use client";

import type { Internship } from "@/lib/types";
import { AddInternshipDialog } from "./add-internship-dialog";

export function Header({ onInternshipAdded }: { onInternshipAdded: (internship: Internship) => void; }) {
  return (
    <header className="sticky top-0 z-20 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-primary"
          >
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <h1 className="text-xl font-bold">Internship Alert</h1>
        </div>
        <AddInternshipDialog onInternshipAdded={onInternshipAdded} />
      </div>
    </header>
  );
}
