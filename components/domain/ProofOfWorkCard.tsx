import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProofOfWorkCardProps {
  jobType: string;
  date: string;
  status: "pending" | "confirmed";
  beforeImageUrl: string;
  afterImageUrl: string;
}

export function ProofOfWorkCard({ jobType, date, status, beforeImageUrl, afterImageUrl }: ProofOfWorkCardProps) {
  return (
    <Card variant="card">
      <CardContent className="p-0">
        <div className="grid grid-cols-2 aspect-video bg-muted overflow-hidden">
          <div className="relative border-r border-border">
             {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={beforeImageUrl} alt="Sebelum" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute top-2 left-2 bg-bg/80 backdrop-blur-sm px-2 py-0.5 rounded-sm text-[10px] font-medium">Sebelum</div>
          </div>
          <div className="relative">
             {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={afterImageUrl} alt="Sesudah" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute top-2 left-2 bg-bg/80 backdrop-blur-sm px-2 py-0.5 rounded-sm text-[10px] font-medium">Sesudah</div>
          </div>
        </div>
        <div className="p-4 flex flex-col gap-3">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h4 className="font-medium text-text-heading">{jobType}</h4>
              <p className="text-caption text-text-muted mt-0.5">{date}</p>
            </div>
          </div>
          <div>
            <Badge variant={status}>
              {status === "pending" ? "Menunggu Konfirmasi" : "Dikonfirmasi Pelanggan"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
