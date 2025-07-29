import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import type {
  IFTAReportData,
  PDFOptions,
  PDFGenerationResult,
  CustomReportOptions,
  DigitalSignature,
  JurisdictionSummary,
} from '@/types/ifta';

export class IFTAPDFService {
  private static readonly STORAGE_PATH = path.join(process.cwd(), 'uploads', 'ifta-pdfs');
  private static readonly TEMP_PATH = path.join(process.cwd(), 'tmp', 'ifta-pdfs');

  /**
   * Ensure storage directories exist
   */
  private static async ensureDirectories(): Promise<void> {
    const dirs = [this.STORAGE_PATH, this.TEMP_PATH];

    for (const dir of dirs) {
      if (!existsSync(dir)) {
        await mkdir(dir, { recursive: true });
      }
    }
  }

  /**
   * Generate IFTA Quarterly Report PDF
   */
  static async generateQuarterlyReport(
    reportData: IFTAReportData,
    options: PDFOptions = {
      format: 'A4',
      orientation: 'portrait',
      includeSignature: false,
    },
  ): Promise<PDFGenerationResult> {
    try {
      await this.ensureDirectories();

      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([612, 792]); // Letter size
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // Header
      this.drawHeader(page, font, boldFont, reportData);

      // Company Information
      this.drawCompanyInfo(page, font, boldFont, reportData, 680);

      // Report Period
      this.drawReportPeriod(page, font, boldFont, reportData, 620);

      // Jurisdiction Summary Table
      this.drawJurisdictionTable(page, font, boldFont, reportData, 550);

      // Tax Summary
      this.drawTaxSummary(page, font, boldFont, reportData, 200);

      // Footer
      this.drawFooter(page, font, reportData, 50);

      // Add watermark if specified
      if (options.watermark) {
        this.addWatermark(page, font, options.watermark);
      }

      const pdfBytes = await pdfDoc.save();
      const fileName = `ifta-quarterly-${reportData.quarter}-${reportData.year}-${Date.now()}.pdf`;
      const filePath = path.join(this.STORAGE_PATH, fileName);

      await writeFile(filePath, pdfBytes);

      return {
        success: true,
        filePath,
        fileName,
        fileSize: pdfBytes.length,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Generate Trip Log PDF Report
   */
  static async generateTripLogReport(
    tripData: any[],
    organizationId: string,
    options: PDFOptions = {
      format: 'A4',
      orientation: 'portrait',
      includeSignature: false,
    },
  ): Promise<PDFGenerationResult> {
    try {
      await this.ensureDirectories();

      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      let currentY = 750;
      const pageHeight = 792;
      const marginBottom = 50;

      let page = pdfDoc.addPage([612, pageHeight]);

      // Header
      page.drawText('IFTA Trip Log Report', {
        x: 50,
        y: currentY,
        size: 18,
        font: boldFont,
        color: rgb(0, 0, 0),
      });
      currentY -= 40;

      // Trip details
      for (const trip of tripData) {
        if (currentY < marginBottom + 100) {
          page = pdfDoc.addPage([612, pageHeight]);
          currentY = 750;
        }

        // Trip header
        page.drawText(`Trip #${trip.id}`, {
          x: 50,
          y: currentY,
          size: 12,
          font: boldFont,
        });
        currentY -= 20;

        // Trip details
        const details = [
          `Date: ${new Date(trip.startDate).toLocaleDateString()} - ${new Date(trip.endDate).toLocaleDateString()}`,
          `Vehicle: ${trip.vehicleId}`,
          `Driver: ${trip.driverId}`,
          `Starting Location: ${trip.startLocation}`,
          `Ending Location: ${trip.endLocation}`,
          `Total Miles: ${trip.totalMiles}`,
          `Fuel Consumed: ${trip.fuelConsumed} gallons`,
        ];

        for (const detail of details) {
          page.drawText(detail, {
            x: 70,
            y: currentY,
            size: 10,
            font,
          });
          currentY -= 15;
        }

        // Jurisdiction breakdown
        if (trip.jurisdictionMiles && Object.keys(trip.jurisdictionMiles).length > 0) {
          page.drawText('Jurisdiction Miles:', {
            x: 70,
            y: currentY,
            size: 10,
            font: boldFont,
          });
          currentY -= 15;

          for (const [jurisdiction, miles] of Object.entries(trip.jurisdictionMiles)) {
            page.drawText(`  ${jurisdiction}: ${miles} miles`, {
              x: 90,
              y: currentY,
              size: 9,
              font,
            });
            currentY -= 12;
          }
        }

        currentY -= 20; // Space between trips
      }

      const pdfBytes = await pdfDoc.save();
      const fileName = `ifta-trip-log-${organizationId}-${Date.now()}.pdf`;
      const filePath = path.join(this.STORAGE_PATH, fileName);

      await writeFile(filePath, pdfBytes);

      return {
        success: true,
        filePath,
        fileName,
        fileSize: pdfBytes.length,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Generate Fuel Summary PDF Report
   */
  static async generateFuelSummaryReport(
    fuelData: any[],
    organizationId: string,
    dateRange: { start: Date; end: Date },
    options: PDFOptions = {
      format: 'A4',
      orientation: 'portrait',
      includeSignature: false,
    },
  ): Promise<PDFGenerationResult> {
    try {
      await this.ensureDirectories();

      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([612, 792]);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      let currentY = 750;

      // Header
      page.drawText('IFTA Fuel Purchase Summary', {
        x: 50,
        y: currentY,
        size: 18,
        font: boldFont,
      });
      currentY -= 30;

      // Date range
      page.drawText(
        `Period: ${dateRange.start.toLocaleDateString()} - ${dateRange.end.toLocaleDateString()}`,
        {
          x: 50,
          y: currentY,
          size: 12,
          font,
        },
      );
      currentY -= 40;

      // Table headers
      const headers = [
        'Date',
        'Location',
        'Jurisdiction',
        'Gallons',
        'Price/Gal',
        'Total',
        'Vehicle',
      ];
      const columnWidths = [70, 120, 80, 60, 60, 70, 80];
      let startX = 50;
      for (let i = 0; i < headers.length; i++) {
        const header = headers[i];
        if (header) {
          page.drawText(header, {
            x: startX,
            y: currentY,
            size: 10,
            font: boldFont,
          });
        }
        startX += columnWidths[i] ?? 0;
      }
      currentY -= 20;

      // Draw header line
      page.drawLine({
        start: { x: 50, y: currentY },
        end: { x: 590, y: currentY },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
      currentY -= 15;

      // Fuel purchase data
      let totalGallons = 0;
      let totalAmount = 0;

      for (const purchase of fuelData) {
        if (currentY < 100) break; // Prevent overflow for now

        startX = 50;
        const rowData = [
          new Date(purchase.purchaseDate).toLocaleDateString(),
          purchase.location.substring(0, 15) + (purchase.location.length > 15 ? '...' : ''),
          purchase.jurisdiction,
          purchase.gallons.toFixed(2),
          `$${purchase.pricePerGallon.toFixed(3)}`,
          `$${purchase.totalAmount.toFixed(2)}`,
          purchase.vehicleId,
        ];

        for (let i = 0; i < rowData.length; i++) {
          page.drawText(rowData[i], {
            x: startX,
            y: currentY,
            size: 9,
            font,
          });
          startX += columnWidths[i] ?? 0;
        }

        totalGallons += purchase.gallons;
        totalAmount += purchase.totalAmount;
        currentY -= 15;
      }

      // Summary
      currentY -= 20;
      page.drawText(`Total Gallons: ${totalGallons.toFixed(2)}`, {
        x: 50,
        y: currentY,
        size: 12,
        font: boldFont,
      });
      currentY -= 20;

      page.drawText(`Total Amount: $${totalAmount.toFixed(2)}`, {
        x: 50,
        y: currentY,
        size: 12,
        font: boldFont,
      });

      const pdfBytes = await pdfDoc.save();
      const fileName = `ifta-fuel-summary-${organizationId}-${Date.now()}.pdf`;
      const filePath = path.join(this.STORAGE_PATH, fileName);

      await writeFile(filePath, pdfBytes);

      return {
        success: true,
        filePath,
        fileName,
        fileSize: pdfBytes.length,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Generate Custom IFTA Report
   */
  static async generateCustomReport(
    data: any,
    organizationId: string,
    options: CustomReportOptions,
  ): Promise<PDFGenerationResult> {
    try {
      await this.ensureDirectories();

      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([612, 792]);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      let currentY = 750;

      // Header
      page.drawText(`Custom IFTA Report - ${options.reportType.toUpperCase()}`, {
        x: 50,
        y: currentY,
        size: 18,
        font: boldFont,
      });
      currentY -= 40;

      // Add content based on report type and options
      if (options.includeTrips && data.trips) {
        page.drawText('Trip Summary:', {
          x: 50,
          y: currentY,
          size: 14,
          font: boldFont,
        });
        currentY -= 25;

        page.drawText(`Total Trips: ${data.trips.length}`, {
          x: 70,
          y: currentY,
          size: 12,
          font,
        });
        currentY -= 20;
      }

      if (options.includeFuel && data.fuelPurchases) {
        page.drawText('Fuel Summary:', {
          x: 50,
          y: currentY,
          size: 14,
          font: boldFont,
        });
        currentY -= 25;

        const totalGallons = data.fuelPurchases.reduce(
          (sum: number, purchase: any) => sum + purchase.gallons,
          0,
        );
        page.drawText(`Total Fuel Purchased: ${totalGallons.toFixed(2)} gallons`, {
          x: 70,
          y: currentY,
          size: 12,
          font,
        });
        currentY -= 20;
      }

      if (options.includeTaxCalculations && data.taxCalculations) {
        page.drawText('Tax Calculations:', {
          x: 50,
          y: currentY,
          size: 14,
          font: boldFont,
        });
        currentY -= 25;

        for (const calc of data.taxCalculations) {
          page.drawText(`${calc.jurisdiction}: $${calc.taxDue.toFixed(2)}`, {
            x: 70,
            y: currentY,
            size: 12,
            font,
          });
          currentY -= 18;
        }
      }

      const pdfBytes = await pdfDoc.save();
      const fileName = `ifta-custom-${options.reportType}-${organizationId}-${Date.now()}.pdf`;
      const filePath = path.join(this.STORAGE_PATH, fileName);

      await writeFile(filePath, pdfBytes);

      return {
        success: true,
        filePath,
        fileName,
        fileSize: pdfBytes.length,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Helper methods for drawing PDF content
  private static drawHeader(page: any, font: any, boldFont: any, reportData: IFTAReportData): void {
    page.drawText('INTERNATIONAL FUEL TAX AGREEMENT', {
      x: 50,
      y: 750,
      size: 16,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    page.drawText('QUARTERLY FUEL TAX REPORT', {
      x: 50,
      y: 730,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
  }

  private static drawCompanyInfo(
    page: any,
    font: any,
    boldFont: any,
    reportData: IFTAReportData,
    startY: number,
  ): void {
    page.drawText('Company Information:', {
      x: 50,
      y: startY,
      size: 12,
      font: boldFont,
    });

    const companyInfo = [
      `Organization ID: ${reportData.organizationId}`,
      `Report Period: Q${reportData.quarter} ${reportData.year}`,
      `Generated: ${new Date().toLocaleDateString()}`,
    ];

    let currentY = startY - 20;
    for (const info of companyInfo) {
      page.drawText(info, {
        x: 70,
        y: currentY,
        size: 10,
        font,
      });
      currentY -= 15;
    }
  }

  private static drawReportPeriod(
    page: any,
    font: any,
    boldFont: any,
    reportData: IFTAReportData,
    startY: number,
  ): void {
    page.drawText(`Reporting Period: Quarter ${reportData.quarter}, ${reportData.year}`, {
      x: 50,
      y: startY,
      size: 12,
      font: boldFont,
    });
  }

  private static drawJurisdictionTable(
    page: any,
    font: any,
    boldFont: any,
    reportData: IFTAReportData,
    startY: number,
  ): void {
    page.drawText('Jurisdiction Summary:', {
      x: 50,
      y: startY,
      size: 12,
      font: boldFont,
    });

    // Table headers
    const headers = ['Jurisdiction', 'Miles', 'Fuel Purchased', 'Tax Rate', 'Tax Due'];
    const columnWidths = [100, 80, 100, 80, 80];
    const headerY = startY - 25;
    let startX = 50;
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i];
      if (header) {
        page.drawText(header, {
          x: startX,
          y: headerY,
          size: 10,
          font: boldFont,
        });
      }
      startX += columnWidths[i] ?? 0;
    }

    // Draw header line
    page.drawLine({
      start: { x: 50, y: headerY - 5 },
      end: { x: 490, y: headerY - 5 },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    // Table data
    if (reportData.reportSummary?.jurisdictionBreakdown) {
      let dataY = headerY - 20;

      for (const jurisdiction of reportData.reportSummary.jurisdictionBreakdown) {
        startX = 50;
        const rowData = [
          jurisdiction.jurisdiction,
          jurisdiction.miles.toString(),
          `${jurisdiction.fuelPurchased.toFixed(2)} gal`,
          `$${jurisdiction.taxRate.toFixed(3)}`,
          `$${jurisdiction.taxDue.toFixed(2)}`,
        ];

        for (let i = 0; i < rowData.length; i++) {
          page.drawText(rowData[i], {
            x: startX,
            y: dataY,
            size: 9,
            font,
          });
          startX += columnWidths[i] ?? 0;
        }
        dataY -= 15;
      }
    }
  }

  private static drawTaxSummary(
    page: any,
    font: any,
    boldFont: any,
    reportData: IFTAReportData,
    startY: number,
  ): void {
    page.drawText('Tax Summary:', {
      x: 50,
      y: startY,
      size: 12,
      font: boldFont,
    });

    if (reportData.reportSummary) {
      const summary = reportData.reportSummary;
      const summaryItems = [
        `Total Miles: ${summary.totalMiles.toLocaleString()}`,
        `Total Fuel Purchased: ${summary.totalFuelPurchased.toFixed(2)} gallons`,
        `Total Fuel Consumed: ${summary.totalFuelConsumed.toFixed(2)} gallons`,
        `Total Tax Due: $${summary.totalTaxDue.toFixed(2)}`,
      ];

      let currentY = startY - 20;
      for (const item of summaryItems) {
        page.drawText(item, {
          x: 70,
          y: currentY,
          size: 11,
          font,
        });
        currentY -= 18;
      }
    }
  }

  private static drawFooter(
    page: any,
    font: any,
    reportData: IFTAReportData,
    startY: number,
  ): void {
    page.drawText(
      `Generated on ${new Date().toLocaleDateString()} | FleetFusion IFTA Management System`,
      {
        x: 50,
        y: startY,
        size: 8,
        font,
        color: rgb(0.5, 0.5, 0.5),
      },
    );
  }

  private static addWatermark(page: any, font: any, watermarkText: string): void {
    page.drawText(watermarkText, {
      x: 200,
      y: 400,
      size: 48,
      font,
      color: rgb(0.9, 0.9, 0.9),
      rotate: { type: 'degrees', angle: 45 },
    });
  }
}
