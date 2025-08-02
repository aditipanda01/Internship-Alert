"use client";

import React, { useEffect, useRef, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { PlusCircle } from "lucide-react";

import { addInternshipAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PLATFORMS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import type { Internship } from "@/lib/types";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
      {pending ? "Analyzing..." : "Add Internship"}
    </Button>
  );
}

export function AddInternshipDialog({
  onInternshipAdded,
}: {
  onInternshipAdded: (internship: Internship) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const [state, formAction] = useActionState(addInternshipAction, { message: "" });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      if (state.internship) {
        toast({
          title: "Success!",
          description: "New internship has been added.",
        });
        onInternshipAdded(state.internship);
        setOpen(false);
      } else if (state.error) {
        toast({
          title: "Error",
          description: state.error,
          variant: "destructive",
        });
      }
    }
  }, [state, toast, onInternshipAdded]);
  
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      formRef.current?.reset();
    }
    setOpen(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-primary hover:bg-primary/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Internship
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Internship</DialogTitle>
          <DialogDescription>
            Paste the content from a post to automatically extract details.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="platform">Platform</Label>
            <Select name="platform" defaultValue={PLATFORMS[0].name} required>
              <SelectTrigger id="platform">
                <SelectValue placeholder="Select a platform" />
              </SelectTrigger>
              <SelectContent>
                {PLATFORMS.map(({ name, Icon }) => (
                  <SelectItem key={name} value={name}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" style={{ color: name === 'LinkedIn' ? '#0A66C2' : 'currentColor' }}/>
                      {name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="postContent">Post Content</Label>
            <Textarea
              id="postContent"
              name="postContent"
              placeholder="Paste the internship description here..."
              rows={8}
              required
            />
          </div>
          <DialogFooter>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
