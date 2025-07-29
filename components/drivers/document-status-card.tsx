// features/driver/DocumentStatusCard.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export async function DocumentStatusCard({ driverId, orgId }: { driverId: string; orgId: string }) {
  const { getComplianceDocuments } = await import('@/lib/fetchers/complianceFetchers');
  try {
    const documentsResponse = await getComplianceDocuments({
      entityType: ['driver'],
      entityId: driverId,
    });
    const documents =
      documentsResponse.success && 'data' in documentsResponse
        ? documentsResponse.data.documents
        : [];
    const now = new Date();
    const expiringSoon = documents.filter((doc: any) => {
      const expiryDate = new Date(doc.expiryDate);
      const daysUntilExpiry = Math.ceil(
        (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    });
    const expired = documents.filter((doc: any) => {
      const expiryDate = new Date(doc.expiryDate);
      return expiryDate < now;
    });
    const valid = documents.filter((doc: any) => {
      const expiryDate = new Date(doc.expiryDate);
      const daysUntilExpiry = Math.ceil(
        (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );
      return daysUntilExpiry > 30;
    });
    return (
      <Card className="bg-black/40 border-gray-800/50">
        <CardHeader>
          <CardTitle className="text-lg text-white">Document Status</CardTitle>
          <CardDescription className="text-gray-400">Compliance document overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{valid.length}</div>
              <div className="text-sm text-gray-400">Valid</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{expiringSoon.length}</div>
              <div className="text-sm text-gray-400">Expiring Soon</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{expired.length}</div>
              <div className="text-sm text-gray-400">Expired</div>
            </div>
          </div>
          {documents.length > 0 ? (
            <div className="space-y-3">
              {documents.slice(0, 4).map((doc: any) => {
                const expiryDate = new Date(doc.expiryDate);
                const daysUntilExpiry = Math.ceil(
                  (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
                );
                const isExpired = expiryDate < now;
                const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry > 0;
                return (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 border border-gray-700 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-white">{doc.documentType || doc.name}</p>
                      <p className="text-sm text-gray-400">
                        Expires: {expiryDate.toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        isExpired
                          ? 'border-red-200 bg-red-50 text-red-700'
                          : isExpiringSoon
                            ? 'border-yellow-200 bg-yellow-50 text-yellow-700'
                            : 'border-green-200 bg-green-50 text-green-700'
                      }
                    >
                      {isExpired ? 'Expired' : isExpiringSoon ? 'Expiring Soon' : 'Valid'}
                    </Badge>
                  </div>
                );
              })}
              {documents.length > 4 && (
                <div className="text-center pt-2">
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    View All Documents ({documents.length})
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">No compliance documents found</p>
              <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white">
                Upload Documents
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  } catch (error) {
    console.error('Error fetching document status:', error);
    return (
      <Card className="bg-black/40 border-gray-800/50">
        <CardHeader>
          <CardTitle className="text-lg text-white">Document Status</CardTitle>
          <CardDescription className="text-gray-400">Compliance document overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">Unable to load document status</p>
            <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white">
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
}
