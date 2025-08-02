"use client";

import React, { useState, useMemo, useEffect } from "react";
import type { Internship } from "@/lib/types";
import { InternshipCard } from "./internship-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { PLATFORMS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { parseISO, isPast } from 'date-fns';

type SortOption = "deadline" | "newest";

export function InternshipList({
  internships,
  setInternships,
}: {
  internships: Internship[];
  setInternships: React.Dispatch<React.SetStateAction<Internship[]>>;
}) {
  const [activeTab, setActiveTab] = useState<"all" | "saved">("all");
  const [sortOption, setSortOption] = useState<SortOption>("deadline");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    const notifiedDeadlines = new Set<string>();
    const interval = setInterval(() => {
      const now = new Date();
      internships.forEach(internship => {
        if (internship.isSaved && !notifiedDeadlines.has(internship.id)) {
          try {
            const deadlineDate = parseISO(internship.deadline);
            const hoursLeft = (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60);
            if (hoursLeft > 0 && hoursLeft <= 24) {
              toast({
                title: "Reminder: Deadline Approaching!",
                description: `The deadline for "${internship.title}" is tomorrow.`,
              });
              notifiedDeadlines.add(internship.id);
            }
          } catch (e) { /* Ignore invalid dates */ }
        }
      });
    }, 1000 * 60 * 5); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [internships, toast]);

  const handleSaveToggle = (id: string) => {
    setInternships((prev) =>
      prev.map((internship) => {
        if (internship.id === id) {
          const updatedInternship = { ...internship, isSaved: !internship.isSaved };
          toast({
            title: updatedInternship.isSaved ? "Internship Saved" : "Internship Unsaved",
            description: `"${updatedInternship.title}" has been ${updatedInternship.isSaved ? 'saved to' : 'removed from'} your list.`,
          });
          return updatedInternship;
        }
        return internship;
      })
    );
  };
  
  const filteredAndSortedInternships = useMemo(() => {
    let filtered = internships;

    if (activeTab === "saved") {
      filtered = filtered.filter((internship) => internship.isSaved);
    }
    
    if (platformFilter !== "all") {
      filtered = filtered.filter((internship) => internship.platform === platformFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (internship) =>
          internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          internship.company.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    const sorted = [...filtered].sort((a, b) => {
      if (sortOption === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      try {
        const dateA = parseISO(a.deadline);
        const dateB = parseISO(b.deadline);
        if (isPast(dateA)) return 1;
        if (isPast(dateB)) return -1;
        return dateA.getTime() - dateB.getTime();
      } catch (e) {
        return 0;
      }
    });

    return sorted;
  }, [internships, activeTab, sortOption, platformFilter, searchQuery]);

  return (
    <div className="container py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "all" | "saved")}>
          <TabsList>
            <TabsTrigger value="all">All Internships</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              {PLATFORMS.map(({ name }) => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="deadline">Deadline</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
       <div className="mb-6">
        <Input
            placeholder="Search by title or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
        />
       </div>

      {filteredAndSortedInternships.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedInternships.map((internship) => (
            <InternshipCard
              key={internship.id}
              internship={internship}
              onSaveToggle={handleSaveToggle}
            />
          ))}
        </div>
      ) : (
          <div className="col-span-full text-center py-16 bg-card rounded-lg border border-dashed">
            <h2 className="text-xl font-semibold text-card-foreground">No internships found.</h2>
            <p className="text-muted-foreground mt-2">Try adjusting your filters or add a new internship!</p>
          </div>
      )}
    </div>
  );
}
