import { Suspense } from 'react';
import { listVehiclesByOrg } from '@/lib/fetchers/vehicleFetchers';
import { Plus, Truck } from 'lucide-react';
import Link from 'next/link';
import VehiclesClient from './vehicles-client';
import { VehicleListSkeleton } from '@/components/vehicles/vehicle-list-skeleton';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface VehiclesPageProps {
  params: Promise<{ orgId: string }>;
}

export default async function VehiclesPage({ params }: VehiclesPageProps) {
  const { orgId } = await params;
  const PAGE_SIZE = 10;
  const { data, totalPages } = await listVehiclesByOrg(orgId, 1, PAGE_SIZE);

  async function fetchPage(page: number) {
    'use server';
    return await listVehiclesByOrg(orgId, page, PAGE_SIZE);
  }

  return (
    <Suspense fallback={<VehicleListSkeleton />}>
      <Card className="rounded-md shadow-md bg-black p-6 border border-gray-200 space-y-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-3xl font-medium flex items-center gap-2 text-white">
              <Truck className="h-8 w-8" /> Fleet Vehicles
            </CardTitle>
            <CardDescription className="text-gray-400">
              Manage your fleet vehicles and their information
            </CardDescription>
          </div>
          <Button asChild className="rounded-md bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-800">
            <Link href={`/${orgId}/vehicles/new`} className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Vehicle
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="mt-6 space-y-6">
          <VehiclesClient
            orgId={orgId}
            initialVehicles={data}
            initialPage={1}
            totalPages={totalPages}
            fetchPage={fetchPage}
          />
        </CardContent>
      </Card>
    </Suspense>
  );
}
