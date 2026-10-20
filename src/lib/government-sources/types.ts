import type { OfficialSource } from '@/types/registration-guide';

export interface SourceIngestionMetadata {
  sourceKey: string;
  source: OfficialSource;
  checksum?: string;
  version?: string;
  lastRetrievedAt: string;
  status: 'ACTIVE_VERIFIED' | 'STALE_WARNING' | 'PORTAL_OFFLINE';
}

export interface SourceAdapter<T> {
  sourceKey: string;
  officialSource: OfficialSource;
  fetchAndNormalize(): Promise<{
    data: T;
    metadata: SourceIngestionMetadata;
  }>;
}
