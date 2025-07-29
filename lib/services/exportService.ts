import { PDFDocument, StandardFonts } from 'pdf-lib'
import { put } from '@vercel/blob'

export function objectsToCsv(data: Record<string, any>[]): string {
  if (data.length === 0) return ''
  const headers = Object.keys(data[0])
  const escape = (val: any) => `"${String(val ?? '').replace(/"/g, '""')}"`
  const rows = data.map(row => headers.map(h => escape(row[h])).join(','))
  return [headers.join(','), ...rows].join('\n')
}

export async function generateSimplePdf(title: string, data: Record<string, any>[]): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  let page = doc.addPage()
  const font = await doc.embedFont(StandardFonts.Helvetica)
  let y = page.getHeight() - 40
  page.drawText(title, { x: 50, y, size: 16, font })
  y -= 24
  for (const row of data) {
    const text = Object.values(row).join(' | ')
    if (y < 40) {
      page = doc.addPage()
      y = page.getHeight() - 40
    }
    page.drawText(text, { x: 50, y, size: 12, font })
    y -= 16
  }
  return await doc.save()
}

export async function uploadExport(pathname: string, body: Buffer): Promise<string> {
  const { downloadUrl } = await put(pathname, body, { access: 'public' })
  return downloadUrl
}
