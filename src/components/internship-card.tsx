"use client";

import { useState, useEffect } from 'react';
import { Bookmark, Info, CalendarDays, Building } from "lucide-react";
import { formatDistanceToNow, parseISO, differenceInDays, isPast } from 'date-fns';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Internship } from "@/lib/types";
import { PLATFORM_INFO } from "@/lib/constants";

interface InternshipCardProps {
  internship: Internship;
  onSaveToggle: (id: string) => void;
}

export function InternshipCard({ internship, onSaveToggle }: InternshipCardProps) {
  const { id, title, company, deadline, requirements, platform, postContent, isSaved, createdAt } = internship;
  const Platform = PLATFORM_INFO[platform];
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getDeadlineInfo = () => {
    try {
      const deadlineDate = parseISO(deadline);
      const now = new Date();
      if (isPast(deadlineDate)) {
        return { text: "Expired", variant: "destructive" as const };
      }
      const daysLeft = differenceInDays(deadlineDate, now);
      if (daysLeft <= 3) {
        return { text: `${daysLeft + 1}d left`, variant: "destructive" as const };
      }
      if (daysLeft <= 14) {
        return { text: `${daysLeft + 1}d left`, variant: "secondary" as const, className: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30" };
      }
      return { text: deadlineDate.toLocaleDateString(), variant: "secondary" as const };
    } catch (e) {
      return { text: deadline, variant: "secondary" as const };
    }
  };

  const deadlineInfo = getDeadlineInfo();

  return (
    <Card className="flex flex-col h-full transition-shadow duration-300 hover:shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="relative pb-4">
        <Button
            variant="ghost"
            size="icon"
            className={`absolute top-3 right-3 h-8 w-8 rounded-full z-10 ${isSaved ? 'text-primary bg-primary/10 hover:bg-primary/20' : 'text-muted-foreground hover:bg-accent/50'}`}
            onClick={() => onSaveToggle(id)}
            aria-label={isSaved ? "Unsave internship" : "Save internship"}
        >
            <Bookmark className={`h-5 w-5 transition-transform duration-200 ${isSaved ? 'fill-primary scale-110' : ''}`} />
        </Button>
        <div className="flex items-center gap-3 pr-8">
            <div className="p-2 rounded-lg bg-muted flex items-center justify-center aspect-square h-12 w-12">
                <Building className="w-6 h-6 text-primary" />
            </div>
            <div>
                <CardTitle className="text-lg leading-tight">{title}</CardTitle>
                <CardDescription className="pt-1">{company}</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Platform.Icon className="h-4 w-4" style={{color: Platform.color}}/>
          <span>From {platform}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>Apply by: </span>
            {isClient ? <Badge variant={deadlineInfo.variant} className={deadlineInfo.className}>{deadlineInfo.text}</Badge> : <Badge variant="secondary">Loading...</Badge> }
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-muted/50 p-4">
        <span className="text-xs text-muted-foreground">
            {isClient ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : '...'}
        </span>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="link" className="text-primary h-auto p-0">
              View Details
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-lg p-0">
            <ScrollArea className="h-full">
              <div className="p-6">
                <SheetHeader className="text-left">
                  <Badge variant="outline" className="w-fit mb-2" style={{borderColor: Platform.color, color: Platform.color}}>
                    <Platform.Icon className="h-3 w-3 mr-1.5"/>
                    {platform}
                  </Badge>
                  <SheetTitle className="text-2xl">{title}</SheetTitle>
                  <SheetDescription>
                    <div className="flex items-center gap-2 mt-2">
                      <Building className="w-4 h-4" />
                      <span>{company}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <CalendarDays className="w-4 h-4" />
                      <span>Apply by {new Date(deadline).toLocaleDateString()}</span>
                    </div>
                  </SheetDescription>
                </SheetHeader>
                <Separator className="my-6" />
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2 text-foreground">Requirements</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{requirements}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-foreground">Original Post</h3>
                    <div className="text-sm text-muted-foreground bg-muted p-4 rounded-md whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">{postContent}</div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </CardFooter>
    </Card>
  );
}
