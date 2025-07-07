'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AlertCircle, CheckCircle, ExternalLink, Clock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

// Add 'comingSoon' as an optional property to the integration type
interface Integration {
  id: number;
  name: string;
  description: string;
  status: string;
  lastSync: string;
  icon: string;
  available: boolean;
  logo: string;
  comingSoon?: boolean;
}

// Updated with real-world integrations
const realIntegrations = [
  {
    id: 1,
    name: 'Motive (KeepTruckin)',
    description:
      "Connect with Motive's ELD platform for automated HOS compliance and vehicle tracking.",
    status: 'Connected',
    lastSync: '2023-06-28 10:15 AM',
    icon: '🔄',
    available: true,
    logo: '/black_logo.png',
    comingSoon: false,
  },
  {
    id: 2,
    name: 'QuickBooks',
    description:
      'Integrate with QuickBooks to sync invoices, payments, and financial data.',
    status: 'Connected',
    lastSync: '2023-06-28 09:30 AM',
    icon: '💰',
    available: true,
    logo: '/black_logo.png',
    comingSoon: false,
  },
  {
    id: 3,
    name: 'Comdata',
    description:
      'Connect with Comdata fuel cards to automatically import fuel purchases and IFTA data.',
    status: 'Not Connected',
    lastSync: 'Never',
    icon: '⛽',
    available: true,
    logo: '/black_logo.png',
    comingSoon: false,
  },
  {
    id: 4,
    name: 'Fleetio',
    description:
      'Integrate with Fleetio to track vehicle maintenance, inspections, and parts inventory.',
    status: 'Connected',
    lastSync: '2023-06-27 03:45 PM',
    icon: '🔧',
    available: true,
    logo: '/black_logo.png',
    comingSoon: true,
  },
];

export function IntegrationSettings() {
  const [integrations, setIntegrations] = useState(realIntegrations);

  const toggleIntegration = (id: number) => {
    setIntegrations(prev =>
      prev.map(integration => {
        if (integration.id === id) {
          // Only allow toggling if the integration is available
          if (integration.available) {
            return {
              ...integration,
              status:
                integration.status === 'Connected'
                  ? 'Not Connected'
                  : 'Connected',
              lastSync:
                integration.status === 'Not Connected'
                  ? new Date().toLocaleString()
                  : integration.lastSync,
            };
          }
        }
        return integration;
      })
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Connected':
        return (
          <div className="flex items-center">
            <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
              Connected
            </Badge>
          </div>
        );
      case 'Not Connected':
        return (
          <div className="flex items-center">
            <AlertCircle className="mr-1 h-4 w-4 text-gray-400" />
            <Badge variant="outline">Not Connected</Badge>
          </div>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {integrations.map(integration => (
          <Card
            key={integration.id}
            className={!integration.available ? 'opacity-75 grayscale' : ''}
          >
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 flex-shrink-0">
                  <Image
                    src={integration.logo || '/placeholder.svg'}
                    alt={`${integration.name} logo`}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <CardTitle className="flex items-center">
                    {integration.name}(
                    <Badge
                      variant="outline"
                      className="ml-2 border-yellow-300 bg-yellow-100 text-yellow-800"
                    >
                      <Clock className="mr-1 h-3 w-3" />
                      Coming Soon
                    </Badge>
                    )
                  </CardTitle>
                  <CardDescription>{integration.description}</CardDescription>
                </div>
              </div>
              <Switch
                checked={integration.status === 'Connected'}
                onCheckedChange={() => toggleIntegration(integration.id)}
                disabled={!integration.available}
              />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm">
                <span>Status:</span>
                <span>{getStatusBadge(integration.status)}</span>
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span>Last Sync:</span>
                <span className="text-muted-foreground">
                  {integration.lastSync}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                disabled={!integration.available}
              >
                {integration.available ? 'Configure' : 'Learn More'}
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
            {integration.comingSoon && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/5">
                <div className="rotate-[-10deg] transform rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800 shadow-sm">
                  Coming Q3 2023
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      <div className="rounded-lg border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
        <h3 className="mb-2 text-lg font-medium text-blue-800">
          Integration Roadmap
        </h3>
        <p className="mb-3 text-blue-700">
          We're constantly expanding our integration capabilities. Have a
          specific integration request?
        </p>
        <Button variant="outline" className="bg-white hover:bg-blue-50">
          Request Integration
        </Button>
      </div>

      <div className="flex justify-end">
        <Button>Add Custom Integration</Button>
      </div>
    </div>
  );
}
