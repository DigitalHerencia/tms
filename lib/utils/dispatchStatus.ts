import type { LoadStatus } from '@/types/dispatch';

export const allowedStatusTransitions: Record<LoadStatus, LoadStatus[]> = {
  draft: ['pending'],
  pending: ['assigned', 'cancelled'],
  posted: ['booked'],
  booked: ['confirmed'],
  confirmed: ['dispatched'],
  dispatched: ['at_pickup'],
  at_pickup: ['picked_up'],
  picked_up: ['en_route'],
  en_route: ['at_delivery'],
  at_delivery: ['delivered'],
  assigned: ['in_transit', 'cancelled'],
  in_transit: ['delivered', 'cancelled'],
  delivered: ['completed'],
  pod_required: ['completed'],
  completed: [],
  invoiced: ['paid'],
  paid: [],
  cancelled: [],
  problem: [],
};
