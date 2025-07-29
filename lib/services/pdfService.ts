/**
 * PDF generation utilities for the IFTA domain.
 *
 * This service is responsible for producing quarterly, trip log and fuel
 * summary reports as PDFs. It aligns with the IFTA Reporting requirements in
 * docs/PRD.md §1.
 *
 * PDF files are uploaded to a configurable storage provider rather than
 * written to the local filesystem.
 */
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';
import type { StorageProvider } from './storageProvider';
import { getStorageProvider } from './storageProvider';

export interface PDFOptions {
  format: 'Letter' | 'A4';
  orientation: 'portrait' | 'landscape';
  includeSignature: boolean;
  watermark?: 'draft' | 'official' | 'none';
  includeAttachments?: boolean;
  compressionLevel?: 'none' | 'low' | 'medium' | 'high';
  customMetadata?: Record<string, string>;
  [key: string]: any; // Index signature for JSON compatibility
}

export interface PDFGenerationResult {
  success: boolean;
  error?: string;
  downloadUrl?: string;
  fileName?: string;
  fileSize?: number;
  metadata?: {
    pageCount: number;
    version: string;
    generatedAt: Date;
    reportType: string;
  };
}

export interface PDFAttachment {
  name: string;
  data: Uint8Array;
  mimeType?: string;
  description?: string;
}

export interface CustomReportOptions extends PDFOptions {
  reportType: string;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  includeTrips?: boolean;
  includeFuel?: boolean;
  groupBy?: 'jurisdiction' | 'vehicle' | 'date' | 'none';
  jurisdictions?: string[];
  vehicleIds?: string[];
  startDate?: Date;
  endDate?: Date;
}

class PDFService {
  private storage: StorageProvider;

  constructor(storage: StorageProvider = getStorageProvider()) {
    this.storage = storage;
  }

  /**
   * Generate quarterly IFTA report PDF.
   *
   * @param orgId - Organization id
   * @param quarter - Quarter identifier (e.g. 'Q1')
   * @param year - 4 digit year
   * @param options - PDF generation options
   * @returns Result object containing file metadata
   */
  async generateQuarterlyReport(
    orgId: string,
    quarter: string,
    year: number,
    options: PDFOptions,
    attachments: PDFAttachment[] = [],
  ): Promise<PDFGenerationResult> {
    try {
      const size: [number, number] = options.format === 'A4' ? [595.28, 841.89] : [612, 792];
      const pageSize: [number, number] =
        options.orientation === 'landscape' ? [size[1], size[0]] : size;

      const pdfDoc = await PDFDocument.create();
      const [pageWidth, pageHeight] = pageSize as [number, number];
      const page = pdfDoc.addPage([pageWidth, pageHeight]);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      page.drawText(`Quarterly IFTA Report - Q${quarter} ${year}`, {
        x: 50,
        y: pageHeight - 50,
        size: 16,
        font,
        color: rgb(0, 0, 0),
      });

      if (options.watermark && options.watermark !== 'none') {
        const wmFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
        page.drawText(options.watermark.toUpperCase(), {
          x: pageSize[0] / 2 - 100,
          y: pageSize[1] / 2,
          size: 50,
          font: wmFont,
          color: rgb(0.85, 0.85, 0.85),
          rotate: degrees(45),
        });
      }

      if (options.includeAttachments) {
        for (const att of attachments) {
          await pdfDoc.attach(att.data, att.name, {
            mimeType: att.mimeType ?? 'application/octet-stream',
            description: att.description ?? att.name,
          });
        }
      }

      const pdfBytes = await pdfDoc.save();
      const fileName = `ifta-quarterly-${quarter}-${year}.pdf`;
      const downloadUrl = await this.storage.upload(
        `${orgId}/${fileName}`,
        pdfBytes,
        'application/pdf',
      );

      return {
        success: true,
        downloadUrl,
        fileName,
        fileSize: pdfBytes.length,
        metadata: {
          pageCount: pdfDoc.getPageCount(),
          version: '1.0',
          generatedAt: new Date(),
          reportType: 'QUARTERLY',
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'PDF generation failed',
      };
    }
  }

  /**
   * Generate trip log report PDF.
   *
   * @param orgId - Organization id
   * @param options - Custom report settings
   * @returns PDFGenerationResult
   */
  async generateTripLogReport(
    orgId: string,
    options: CustomReportOptions,
    attachments: PDFAttachment[] = [],
  ): Promise<PDFGenerationResult> {
    try {
      const size: [number, number] = options.format === 'A4' ? [595.28, 841.89] : [612, 792];
      const pageSize: [number, number] =
        options.orientation === 'landscape' ? [size[1], size[0]] : size;

      const pdfDoc = await PDFDocument.create();
      const [pageWidth2, pageHeight2] = pageSize as [number, number];
      const page = pdfDoc.addPage([pageWidth2, pageHeight2]);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      page.drawText('IFTA Trip Log', {
        x: 50,
        y: pageHeight2 - 50,
        size: 16,
        font,
        color: rgb(0, 0, 0),
      });

      if (options.watermark && options.watermark !== 'none') {
        const wmFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
        page.drawText(options.watermark.toUpperCase(), {
          x: pageWidth2 / 2 - 100,
          y: pageHeight2 / 2,
          size: 50,
          font: wmFont,
          color: rgb(0.85, 0.85, 0.85),
          rotate: degrees(45),
        });
      }

      if (options.includeAttachments) {
        for (const att of attachments) {
          await pdfDoc.attach(att.data, att.name, {
            mimeType: att.mimeType ?? 'application/octet-stream',
            description: att.description ?? att.name,
          });
        }
      }

      const pdfBytes = await pdfDoc.save();
      const fileName = `ifta-trip-log-${Date.now()}.pdf`;
      const downloadUrl = await this.storage.upload(
        `${orgId}/${fileName}`,
        pdfBytes,
        'application/pdf',
      );

      return {
        success: true,
        downloadUrl,
        fileName,
        fileSize: pdfBytes.length,
        metadata: {
          pageCount: pdfDoc.getPageCount(),
          version: '1.0',
          generatedAt: new Date(),
          reportType: 'TRIP_LOG',
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'PDF generation failed',
      };
    }
  }

  /**
   * Generate fuel summary report PDF.
   *
   * @param orgId - Organization id
   * @param options - Custom report settings
   * @returns PDFGenerationResult
   */
  async generateFuelSummaryReport(
    orgId: string,
    options: CustomReportOptions,
    attachments: PDFAttachment[] = [],
  ): Promise<PDFGenerationResult> {
    try {
      const size: [number, number] = options.format === 'A4' ? [595.28, 841.89] : [612, 792];
      const pageSize: [number, number] =
        options.orientation === 'landscape' ? [size[1], size[0]] : size;

      const pdfDoc = await PDFDocument.create();
      const [pageWidth3, pageHeight3] = pageSize as [number, number];
      const page = pdfDoc.addPage([pageWidth3, pageHeight3]);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      page.drawText('IFTA Fuel Summary', {
        x: 50,
        y: pageHeight3 - 50,
        size: 16,
        font,
        color: rgb(0, 0, 0),
      });

      if (options.watermark && options.watermark !== 'none') {
        const wmFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
        page.drawText(options.watermark.toUpperCase(), {
          x: pageWidth3 / 2 - 100,
          y: pageHeight3 / 2,
          size: 50,
          font: wmFont,
          color: rgb(0.85, 0.85, 0.85),
          rotate: degrees(45),
        });
      }

      if (options.includeAttachments) {
        for (const att of attachments) {
          await pdfDoc.attach(att.data, att.name, {
            mimeType: att.mimeType ?? 'application/octet-stream',
            description: att.description ?? att.name,
          });
        }
      }

      const pdfBytes = await pdfDoc.save();
      const fileName = `ifta-fuel-summary-${Date.now()}.pdf`;
      const downloadUrl = await this.storage.upload(
        `${orgId}/${fileName}`,
        pdfBytes,
        'application/pdf',
      );

      return {
        success: true,
        downloadUrl,
        fileName,
        fileSize: pdfBytes.length,
        metadata: {
          pageCount: pdfDoc.getPageCount(),
          version: '1.0',
          generatedAt: new Date(),
          reportType: 'FUEL_SUMMARY',
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'PDF generation failed',
      };
    }
  }
}

export const pdfService = new PDFService();
export { PDFService };
