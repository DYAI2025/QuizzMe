
"use client";

/**
 * The Altar (Dashboard)
 * 
 * Central hub for the user journey.
 * Integrates the ProfileSpine ("The Book") and ActionSidebar ("The Artifacts").
 */

import { useProfileSnapshot } from "@/hooks";
import { DashboardGrid, ContentColumn, SidebarColumn } from "@/components/dashboard/DashboardGrid";
import { ProfileSpine } from "@/components/dashboard/ProfileSpine";
import { ActionSidebar } from "@/components/dashboard/ActionSidebar";

export default function DashboardPage() {
  const { snapshot, isLoading, isNew, error } = useProfileSnapshot();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🔮</div>
          <p className="text-indigo-400 font-medium">Das Archiv öffnet sich...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md bg-neutral-900/80 p-8 rounded-xl border border-red-900/50">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-red-400 font-medium mb-2">Die Verbindung ist gestört</p>
          <p className="text-slate-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // New user / no data state
  // We passed this state down to components to handle "empty" or "intro" views
  // instead of blocking the entire dashboard page.
  const showIntro = isNew || !snapshot;

  return (
    <main className="min-h-screen py-8 lg:py-12">
        <DashboardGrid>
            
            {/* Left/Main Column: The Book */}
            <ContentColumn>
                <ProfileSpine snapshot={snapshot} showIntro={showIntro} />
            </ContentColumn>

            {/* Right Column: The Artifacts */}
            <SidebarColumn>
                <ActionSidebar snapshot={snapshot} />
            </SidebarColumn>

        </DashboardGrid>
    </main>
  );
}
