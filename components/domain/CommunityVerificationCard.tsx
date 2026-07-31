import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface CommunityVerificationCardProps {
  statement: string;
  verifierName: string;
  verifierRole: string;
  verifierLocation: string;
}

export function CommunityVerificationCard({ statement, verifierName, verifierRole, verifierLocation }: CommunityVerificationCardProps) {
  return (
    <Card variant="flat" className="bg-bg flex h-full">
      <CardContent className="p-[32px] flex flex-col h-full border border-border rounded-[12px]">
        <div className="mb-6">
          <span className="inline-flex items-center px-3 py-1 rounded-sm bg-bg-alt text-navy text-xs font-medium">
            {verifierRole}
          </span>
        </div>
        <blockquote className="text-body text-text-heading italic flex-1">
          "{statement}"
        </blockquote>
        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-title text-text-heading">{verifierName}</p>
          <p className="text-caption text-text-muted mt-1">{verifierRole}, {verifierLocation}</p>
        </div>
      </CardContent>
    </Card>
  );
}
