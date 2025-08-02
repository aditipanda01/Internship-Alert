import type { LucideIcon } from "lucide-react";

export type Platform = "YouTube" | "LinkedIn" | "Telegram" | "Instagram";

export type PlatformInfo = {
  name: Platform;
  Icon: LucideIcon | ((props: React.SVGProps<SVGSVGElement>) => JSX.Element);
  color: string;
};

export interface Internship {
  id: string;
  title: string;
  company: string;
  deadline: string;
  requirements: string;
  platform: Platform;
  postContent: string;
  isSaved: boolean;
  createdAt: Date;
}
