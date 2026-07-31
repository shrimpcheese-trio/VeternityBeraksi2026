import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface WorkerCardProps {
  name: string;
  category: string;
  city: string;
  trustScore: number;
  imageUrl: string;
}

export function WorkerCard({ name, category, city, trustScore, imageUrl }: WorkerCardProps) {
  return (
    <Card variant="card" className="hover:-translate-y-1 hover:shadow-md transition-transform duration-200 cursor-pointer">
      <CardContent className="p-0 flex flex-col sm:flex-row h-full">
        <div className="w-full sm:w-1/3 aspect-square sm:aspect-auto shrink-0 bg-muted overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        </div>
        <div className="p-4 sm:p-6 flex flex-col justify-between flex-1">
          <div>
            <h3 className="text-title text-text-heading">{name}</h3>
            <p className="text-caption text-text-muted mt-1">{category} · {city}</p>
          </div>
          <div className="mt-4">
            <Badge variant="trust-score">{trustScore} / 100</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
