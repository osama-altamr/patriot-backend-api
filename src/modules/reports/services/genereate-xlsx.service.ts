// src/reports/excel-export.service.ts

import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { FileUploadService } from '/aws/services/s3.service';

@Injectable()
export class ExcelExportService {
    constructor(
       private readonly fileUploadService: FileUploadService,
    ) {}
  async createOrderReportFile(
    reportType: 'order' | 'employee' | 'complaint',
    data: any,
  ): Promise<string> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Patriot Platform';
    workbook.created = new Date();

    switch (reportType) {
      case 'order':
        this._createOrderSheet(workbook, data);
        break;
      case 'employee':
        this._createEmployeeSheet(workbook, data);
        break;
      case 'complaint':
        this._createComplaintSheet(workbook, data);
        break;
      default:
        throw new Error('Invalid report type provided.');
    }
    const buffer  = await workbook.xlsx.writeBuffer()
    const url = await this.fileUploadService.uploadExcelBufferFileToS3(buffer as any, `${reportType}-report`)
    return url
  }

  private _addHeader(
    worksheet: ExcelJS.Worksheet,
    title: string,
    startDate: Date,
    endDate: Date,
  ) {

    worksheet.mergeCells('C1:H2');
    const titleCell = worksheet.getCell('C1');
    titleCell.value = title;
    titleCell.style = {
      font: { name: 'Arial Black', size: 20, bold: true },
      alignment: { horizontal: 'center', vertical: 'middle' },
    };

    worksheet.mergeCells('C3:H3');
    const dateCell = worksheet.getCell('C3');
    dateCell.value = `Period: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`;
    dateCell.style = {
      font: { name: 'Arial', size: 12, italic: true },
      alignment: { horizontal: 'center' },
    };

    worksheet.addRow([]);
  }

  private _createOrderSheet(workbook: ExcelJS.Workbook, data: any) {
    const worksheet = workbook.addWorksheet('Order Analysis Report');
    const { orderSummary: summary , orders } = data;

    this._addHeader(worksheet, 'Order Report', summary.startDate, summary.endDate);
    const tableStartRow = 7;
    const headerRow = worksheet.getRow(tableStartRow);
    headerRow.values = [
      'Ref #',
      'Customer Name',
      'Status',
      'Priority',
      'Price',
      'Date Created',
      'Notes',
    ];

    headerRow.font = { name: 'Calibri', bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
    headerRow.eachCell((cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4472C4' },
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
            top: { style: 'thin' }, left: { style: 'thin' },
            bottom: { style: 'thin' }, right: { style: 'thin' },
        };
    });
    const dataRows = orders.map(order => ([
        order.ref,
        order.user?.name ?? 'N/A',
        order.status,
        order.priority,
        order['price'] ?? 0,
        order.createdAt,
        order.note ?? '',
      ]));
    
    worksheet.addRow([]);
    worksheet.addRows(dataRows);

    worksheet.getColumn('A').width = 15; // Ref #
    worksheet.getColumn('A').alignment = { horizontal: 'center', vertical: 'middle' };

    worksheet.getColumn('B').width = 25; // Customer Name
    worksheet.getColumn('B').alignment = { horizontal: 'center', vertical: 'middle' };

    worksheet.getColumn('C').width = 15; // Status
    worksheet.getColumn('C').alignment = { horizontal: 'center', vertical: 'middle' };

    worksheet.getColumn('D').width = 15; // Priority
    worksheet.getColumn('D').alignment = { horizontal: 'center', vertical: 'middle' };

    worksheet.getColumn('E').width = 15; // Price
    worksheet.getColumn('E').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getColumn('E').numFmt = '"$"#,##0.00';
    worksheet.getColumn('F').width = 20; // Date Created
    worksheet.getColumn('F').numFmt = 'yyyy-mm-dd hh:mm';
    worksheet.getColumn('F').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getColumn('G').width = 100; // Notes
    worksheet.getColumn('G').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getColumn('G').alignment = { wrapText: true }; 


    const tableEndRow = worksheet.rowCount; // Get the last row number
    for (let i = tableStartRow + 1; i <= tableEndRow; i++) {
        const dataRow = worksheet.getRow(i);
        dataRow.eachCell({ includeEmpty: true }, (cell) => {
             cell.border = {
                top: { style: 'thin' }, left: { style: 'thin' },
                bottom: { style: 'thin' }, right: { style: 'thin' },
            };
        });
    }

    worksheet.addRow([]); // Spacer
    const summaryStartRow = worksheet.rowCount + 1;
    
    worksheet.mergeCells(`A${summaryStartRow}:D${summaryStartRow}`);
    const totalsCell = worksheet.getCell(`A${summaryStartRow}`);
    totalsCell.value = 'Totals:';
    totalsCell.font = { bold: true, size: 14 };

    // Add the sum formula for the price
    const priceSumCell = worksheet.getCell(`E${summaryStartRow}`);
    priceSumCell.value = { formula: `SUM(E${tableStartRow + 1}:E${tableEndRow})` }; // Sums data rows only
    priceSumCell.numFmt = '"$"#,##0.00';
    priceSumCell.font = { bold: true, size: 14 };

    // Add the total orders count
    const totalOrdersCell = worksheet.getCell(`F${summaryStartRow}`);
    totalOrdersCell.value = `Total Orders: ${summary.totalOrders}`;
    totalOrdersCell.font = { bold: true, size: 14 };
  }

  private _createEmployeeSheet(workbook: ExcelJS.Workbook, data: any) {
    const {
        breakdownByType,
        startDate, 
        endDate
    } = data;

    const worksheet = workbook.addWorksheet('Employee & Driver Performance');
    console.log(data)
    this._addHeader(
      worksheet,
      'Employee & Driver Performance',
      new Date(startDate),
      new Date(endDate),
    );

    worksheet.addRow([]);

    let tableStartRow = worksheet.rowCount + 1;
    const driverTitleRow = worksheet.getRow(tableStartRow - 1);
    driverTitleRow.getCell('A').value = 'Driver Performance Summary';
    driverTitleRow.getCell('A').font = { bold: true, size: 16 };
    worksheet.mergeCells(`A${tableStartRow - 1}:D${tableStartRow - 1}`);

    // 4. Create the header row for the drivers table
    const driverHeaderRow = worksheet.getRow(tableStartRow);
    driverHeaderRow.values = [
      'Driver Name',
      'Total Delivered Orders',
      'Avg. Delivery Time (Mins)',
    ];

    driverHeaderRow.font = { name: 'Calibri', bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
    driverHeaderRow.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF28A745' }}; // A nice green color
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' }};
    });
    
    const driverRows =  breakdownByType.drivers.map(d => ([
        d.name,
        d.deliveredOrders,
        d.averageDeliveryTimeMinutes ?? 0,
    ]));
    worksheet.addRows(driverRows);

    worksheet.addRow([]);
    worksheet.addRow([]);

    tableStartRow = worksheet.rowCount + 1;
    const employeeTitleRow = worksheet.getRow(tableStartRow - 1);
    employeeTitleRow.getCell('A').value = 'Employee Performance Summary';
    employeeTitleRow.getCell('A').font = { bold: true, size: 16 };
    worksheet.mergeCells(`A${tableStartRow - 1}:D${tableStartRow - 1}`);

    const employeeHeaderRow = worksheet.getRow(tableStartRow);
    employeeHeaderRow.values = [
        'Employee Name',
        'Total Completed Items',
        'Avg. Completion Time (Mins)',
    ];
    employeeHeaderRow.font = { name: 'Calibri', bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
    employeeHeaderRow.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF28A745' }};
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' }};
    });

    const employeeRows = breakdownByType.employees.map(e => ([
        e.name,
        e.completedItems,
        e.averageTime ?? 0,
    ]));
    worksheet.addRows(employeeRows);

    // 11. Set column widths for the whole sheet
    worksheet.getColumn('A').width = 30; // Name
    worksheet.getColumn('B').width = 25; // Count
    worksheet.getColumn('C').width = 30; // Average Time

    // 12. Add borders and center alignment to all data cells
    for (let i = 1; i <= worksheet.rowCount; i++) {
        const row = worksheet.getRow(i);
        if (!row.font?.bold) { 
            row.eachCell({ includeEmpty: true }, (cell) => {
                cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' }};
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
            });
        }
    }
}

  private _createComplaintSheet(workbook: ExcelJS.Workbook, data: any) {
    const {
      summary,
      breakdownByType,
      breakdownByStatus,
      complaints,
    } = data;

    const worksheet = workbook.addWorksheet('Complaint Analysis Report');

    // 2. Add the standard header (Title and Date Range)
    // The dates from complaintSummary are already strings, so we convert them to Date objects
    this._addHeader(
      worksheet,
      'Complaint Analysis Report',
      new Date(summary.startDate),
      new Date(summary.endDate),
    );

    // 3. Create high-level summary tables at the top
    worksheet.addRow([]); // Add a spacer row after the main header
    
    // 4. Create the main, detailed complaints table
    const tableStartRow = worksheet.rowCount + 1; // Find the next available row dynamically

    const mainHeaderRow = worksheet.getRow(tableStartRow);
    mainHeaderRow.values = [
      'ID',
      'Date Submitted',
      'Customer',
      'Type',
      'Status',
      'Description',
      'Location',
      'Attachment',
    ];

    // Style the main header row
    mainHeaderRow.font = { name: 'Calibri', bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
    mainHeaderRow.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9534F' }}; // A red-ish color for complaints
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
            top: { style: 'thin' }, left: { style: 'thin' },
            bottom: { style: 'thin' }, right: { style: 'thin' },
        };
    });

    // 5. Prepare and add the data rows for each complaint
    const dataRows = complaints.map(c => ([
      c.id,
      new Date(c.createdAt), // Ensure it's a Date object for formatting
      c.user?.name ?? 'N/A',
      c.type,
      c.status,
      c.description ?? '',
      c.location ?? 'N/A',
      // Create a clickable hyperlink if fileUrl exists
      c.fileUrl ? { text: 'View Attachment', hyperlink: c.fileUrl } : 'No Attachment',
    ]));

    worksheet.addRows(dataRows);

    // 6. Set column widths, alignments, and formats
    worksheet.getColumn('A').width = 40; // ID
    worksheet.getColumn('B').width = 20; // Date Submitted
    worksheet.getColumn('B').numFmt = 'yyyy-mm-dd hh:mm';
    worksheet.getColumn('C').width = 25; // Customer
    worksheet.getColumn('D').width = 15; // Type
    worksheet.getColumn('E').width = 15; // Status
    worksheet.getColumn('F').width = 60; // Description
    worksheet.getColumn('F').alignment = { wrapText: true, vertical: 'top' };
    worksheet.getColumn('G').width = 30; // Location
    worksheet.getColumn('H').width = 20; // Attachment

    // Center align most columns
    ['A', 'B', 'C', 'D', 'E', 'G', 'H'].forEach(col => {
        worksheet.getColumn(col).alignment = { horizontal: 'center', vertical: 'middle' };
    });

    // 7. Add borders to the entire data table
    const tableEndRow = worksheet.rowCount;
    for (let i = tableStartRow + 1; i <= tableEndRow; i++) {
        const dataRow = worksheet.getRow(i);
        dataRow.eachCell({ includeEmpty: true }, (cell) => {
             cell.border = {
                top: { style: 'thin' }, left: { style: 'thin' },
                bottom: { style: 'thin' }, right: { style: 'thin' },
            };
        });
    }
}
 
}