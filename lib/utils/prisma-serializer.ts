'use server';

import { Decimal } from '@prisma/client/runtime/library';

/**
 * Server-side Prisma data serializer with proper type checking
 * This function can only be used in server components/actions
 */
export async function serializePrismaDataServer<T>(data: T): Promise<T> {
  if (data === null || data === undefined) {
    return data;
  }

  if (data instanceof Decimal) {
    return data.toNumber() as T;
  }

  if (data instanceof Date) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => serializePrismaDataServer(item)) as T;
  }

  if (typeof data === 'object') {
    const serialized: any = {};
    for (const [key, value] of Object.entries(data)) {
      serialized[key] = serializePrismaDataServer(value);
    }
    return serialized as T;
  }

  return data;
}

/**
 * Helper function to serialize specific Decimal fields in an object
 */
export async function serializeDecimalFields<T extends Record<string, any>>(
  obj: T,
  decimalFields: (keyof T)[],
): Promise<T> {
  const result = { ...obj };

  for (const field of decimalFields) {
    // Use duck typing to check for Decimal (has toNumber function)
    if (
      result[field] &&
      typeof result[field] === 'object' &&
      typeof result[field].toNumber === 'function'
    ) {
      result[field] = result[field].toNumber() as T[keyof T];
    }
  }

  return result;
}
