import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  imageUrl: string;
}

export function TestimonialCard({ quote, name, role, imageUrl }: TestimonialCardProps) {
  return (
    <Card variant="card" className="h-full flex">
      <CardContent className="p-6 md:p-8 flex flex-col h-full gap-6">
        <blockquote className="text-body text-text-heading flex-1">
          "{quote}"
        </blockquote>
        <div className="flex items-center gap-4 mt-auto">
          <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-title text-text-heading">{name}</p>
            <p className="text-caption text-text-muted mt-0.5">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
