export type Metadata<T = unknown> = Record<string, T>;

/**
 * Standard metadata record type
 */
export type MetadataRecord = Record<string, unknown>;

/**
 * Standard metadata object used in webhook payloads.
 */
export type WebhookMetadata = Metadata;

/**
 * Standard metadata object used across compliance records.
 */
export type ComplianceMetadata = Metadata;
