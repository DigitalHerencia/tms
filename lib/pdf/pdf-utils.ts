import type { DigitalSignature } from '@/types/ifta';
import type { PDFDocument, PDFFont, PDFPage } from 'pdf-lib';
import { rgb } from 'pdf-lib';

export class PDFUtils {
  /**
   * Add digital signature to PDF
   */
  static async addDigitalSignature(
    pdfDoc: PDFDocument,
    page: PDFPage,
    signature: DigitalSignature,
    x: number = 50,
    y: number = 100,
  ): Promise<void> {
    const font = await pdfDoc.embedFont('Helvetica');

    page.drawText('Digital Signature:', {
      x,
      y,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Signed by: ${signature.signerName}`, {
      x,
      y: y - 15,
      size: 9,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Date: ${signature.timestamp.toLocaleString()}`, {
      x,
      y: y - 30,
      size: 9,
      font,
      color: rgb(0, 0, 0),
    });

    // Add signature box
    page.drawRectangle({
      x: x - 5,
      y: y - 45,
      width: 200,
      height: 50,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });
  }

  /**
   * Add page numbers to PDF
   */
  static async addPageNumbers(pdfDoc: PDFDocument, totalPages: number): Promise<void> {
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont('Helvetica');

    pages.forEach((page, index) => {
      page.drawText(`Page ${index + 1} of ${totalPages}`, {
        x: 520,
        y: 30,
        size: 8,
        font,
        color: rgb(0.5, 0.5, 0.5),
      });
    });
  }

  /**
   * Create table structure for PDF
   */
  static drawTable(
    page: PDFPage,
    font: PDFFont,
    boldFont: PDFFont,
    data: string[][],
    headers: string[],
    startX: number,
    startY: number,
    columnWidths: number[],
  ): number {
    let currentY = startY; // Draw headers
    let x = startX;
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i];
      if (header) {
        page.drawText(header, {
          x,
          y: currentY,
          size: 10,
          font: boldFont,
          color: rgb(0, 0, 0),
        });
      }
      x += columnWidths[i] ?? 0;
    }
    currentY -= 20;

    // Draw header line
    page.drawLine({
      start: { x: startX, y: currentY },
      end: {
        x: startX + columnWidths.reduce((sum, width) => sum + width, 0),
        y: currentY,
      },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    currentY -= 15;

    // Draw data rows
    for (const row of data) {
      x = startX;
      for (let i = 0; i < row.length && i < columnWidths.length; i++) {
        page.drawText(row[i] || '', {
          x,
          y: currentY,
          size: 9,
          font,
          color: rgb(0, 0, 0),
        });
        x += columnWidths[i] ?? 0;
      }
      currentY -= 15;
    }

    return currentY;
  }

  /**
   * Format currency for PDF display
   */
  static formatCurrency(amount: number): string {
    return `$${amount.toFixed(2)}`;
  }

  /**
   * Format number with commas
   */
  static formatNumber(num: number): string {
    return num.toLocaleString();
  }

  /**
   * Truncate text to fit column width
   */
  static truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }

  /**
   * Calculate text width (approximate)
   */
  static getTextWidth(text: string, fontSize: number): number {
    // Approximation: each character is roughly 0.6 * fontSize wide
    return text.length * fontSize * 0.6;
  }

  /**
   * Add company logo to PDF
   */
  static async addLogo(
    pdfDoc: PDFDocument,
    page: PDFPage,
    logoPath: string,
    x: number,
    y: number,
    width: number = 100,
    height: number = 50,
  ): Promise<void> {
    try {
      // This would need actual logo file implementation
      // For now, we'll draw a placeholder rectangle
      page.drawRectangle({
        x,
        y,
        width,
        height,
        borderColor: rgb(0.8, 0.8, 0.8),
        borderWidth: 1,
      });

      page.drawText('LOGO', {
        x: x + width / 2 - 15,
        y: y + height / 2 - 5,
        size: 10,
        color: rgb(0.8, 0.8, 0.8),
      });
    } catch (error) {
      console.warn('Could not add logo:', error);
    }
  }

  /**
   * Create multi-page PDF if content exceeds page height
   */
  static checkPageBreak(
    pdfDoc: PDFDocument,
    currentPage: PDFPage,
    currentY: number,
    marginBottom: number = 50,
    pageHeight: number = 792,
  ): { page: PDFPage; y: number } {
    if (currentY < marginBottom) {
      const newPage = pdfDoc.addPage([612, pageHeight]);
      return { page: newPage, y: pageHeight - 50 };
    }
    return { page: currentPage, y: currentY };
  }

  /**
   * Add document metadata
   */
  static setMetadata(
    pdfDoc: PDFDocument,
    title: string,
    author: string = 'FleetFusion',
    subject: string = 'IFTA Report',
    creator: string = 'FleetFusion IFTA Management System',
  ): void {
    pdfDoc.setTitle(title);
    pdfDoc.setAuthor(author);
    pdfDoc.setSubject(subject);
    pdfDoc.setCreator(creator);
    pdfDoc.setCreationDate(new Date());
    pdfDoc.setModificationDate(new Date());
  }
}
