import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CreditCard, CheckCircle } from 'lucide-react';

export interface PlanDetails {
  name: string;
  price: string;
  color: string;
  features: string[];
}

export interface BillingPlanOverviewProps {
  planDetails: PlanDetails;
  status: string;
  currentPeriodEnds: string;
  getStatusBadge: (status: string) => React.JSX.Element;
}

export function BillingPlanOverview({
  planDetails,
  status,
  currentPeriodEnds,
  getStatusBadge,
}: BillingPlanOverviewProps) {
  return (
    <Card className="rounded-md bg-black border border-gray-200">
      <CardHeader className="flex items-center justify-between pb-2">
        <CardTitle className="text-white flex items-center gap-2">
          <CreditCard className="h-8 w-8 text-white" />
          Subscription
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full p-2 ml-4 space-y-3">
        {/* Top row: plan name/price + status badge */}
        <div className="flex flex-row justify-evenly items-stretch ">
          <div className="flex flex-col items-left justify-center space-y-2">
            <h3 className={`text-2xl font-bold text-white ${planDetails.color}`}>
              {planDetails.name}
            </h3>
            <p className="text-4xl font-bold text-white mb-2">{planDetails.price}</p>
          </div>
          <div className="w-full">{getStatusBadge(status)}</div>
        </div>
        {currentPeriodEnds && (
          <p className="text-gray-400">
            Next billing: {new Date(currentPeriodEnds).toLocaleDateString()}
          </p>
        )}

        <Separator />

        {/* Features list */}
        <div className="flex flex-row items-center">
          <CheckCircle className="h-8 w-8 text-green-500 mr-1" />
          <h4 className="text-xl text-white">Plan Features</h4>
        </div>
        <ul className="flex flex-col items-start ml-4 justify-items-start">
          {planDetails.features.map((feature, idx) => (
            <li key={idx} className="flex flex-colitems-center text-gray-400">
              • {feature}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
