import ExcelJS from 'exceljs';
import { NextResponse } from 'next/server';

async function generateExcelExport(data: any, metrics?: string[]) {
  const workbook = new ExcelJS.Workbook();

  // Main Data Sheet
  const mainData = prepareDataForExport(data.current || [], metrics);
  const mainSheet = workbook.addWorksheet('Analytics Data');
  if (mainData.length) {
    mainSheet.columns = Object.keys(mainData[0]).map(key => ({ header: key, key }));
    mainSheet.addRows(mainData);
  }

  // Comparison Data Sheet
  if (data.previous) {
    const comparisonData = prepareDataForExport(data.previous, metrics);
    const comparisonSheet = workbook.addWorksheet('Previous Period');
    if (comparisonData.length) {
      comparisonSheet.columns = Object.keys(comparisonData[0]).map(key => ({ header: key, key }));
      comparisonSheet.addRows(comparisonData);
    }
  }

  // Summary Sheet
  if (data.comparison) {
    const summaryData = [
      { metric: 'Revenue Change', value: `${data.comparison.revenueChange?.percentage || 0}%` },
      { metric: 'Loads Change', value: `${data.comparison.loadsChange?.percentage || 0}%` },
      { metric: 'Miles Change', value: `${data.comparison.milesChange?.percentage || 0}%` },
    ];
    const summarySheet = workbook.addWorksheet('Summary');
    summarySheet.columns = [
      { header: 'Metric', key: 'metric' },
      { header: 'Value', key: 'value' }
    ];
    summarySheet.addRows(summaryData);
  }

  // Write buffer
  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="analytics-export-${Date.now()}.xlsx"`,
    },
  });
}

function prepareDataForExport(data: any[], metrics?: string[]) {
  if (!data || data.length === 0) {
    return [];
  }

  return data.map(item => {
    // Start with basic properties
    const exportItem: any = {
      date: item.date || item.period || 'N/A',
      revenue: item.revenue || 0,
      loads: item.loads || 0,
      miles: item.miles || 0,
      averageRate: item.averageRate || 0,
    };

    // Add any additional properties from the original item
    Object.keys(item).forEach(key => {
      if (!exportItem.hasOwnProperty(key)) {
        exportItem[key] = item[key];
      }
    });

    // Filter by specific metrics if provided
    if (metrics && metrics.length > 0) {
      const filteredItem: any = {};
      metrics.forEach(metric => {
        if (exportItem.hasOwnProperty(metric)) {
          filteredItem[metric] = exportItem[metric];
        }
      });
      // Always include date for context
      if (!filteredItem.date && exportItem.date) {
        filteredItem.date = exportItem.date;
      }
      return filteredItem;
    }

    return exportItem;
  });
}

