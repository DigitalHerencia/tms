import RecentDispatchActivity from "@/components/dispatch/recent-activity";
import  DispatchBoardFeature  from "@/features/dispatch/DispatchBoardFeature";

interface DispatchPageProps {
  orgId: string; 
  userId: string ;
}

export default async function DispatchPage({ orgId }: DispatchPageProps) {
  


  return (
    <div className="p-4">
      {/* Main Dispatch Board */}
      <DispatchBoardFeature orgId={ orgId }  />
      {/* Recent activity feed for dispatch operations */}
      <div className="mt-8">
        <RecentDispatchActivity orgId={ orgId } />
      </div>
    </div>
  );
}
