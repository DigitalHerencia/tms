export interface PlanDetails {
  name: string;
  price: string;
  color: string;
  features: string[];
}

export const planMap = {
  starter: {
    name: 'Starter',
    price: '$249/mo',
    color: 'text-blue-500',
    features: [
      'Up to 5 trucks',
      '2 dispatcher seats',
      '5 driver apps',
      'Core TMS features',
      '90‑day log retention',
    ],
  },
  growth: {
    name: 'Growth',
    price: '$549/mo',
    color: 'text-green-500',
    features: [
      'Up to 25 trucks',
      'Unlimited dispatcher seats',
      '25 driver apps',
      'IFTA engine',
      'Custom reports',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    price: '$799/mo',
    color: 'text-purple-500',
    features: ['Advanced features', 'Priority support', 'Unlimited everything'],
  },
} as const;

export type PlanKey = keyof typeof planMap;
