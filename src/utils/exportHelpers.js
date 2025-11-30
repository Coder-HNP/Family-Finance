import * as XLSX from 'xlsx';
import { formatDate } from './dateHelpers';

/**
 * Export transactions to XLSX format
 */
export const exportToXLSX = (transactions, filename = 'transactions') => {
    try {
        // Prepare data for export
        const data = transactions.map(transaction => ({
            Date: formatDate(transaction.date, 'yyyy-MM-dd'),
            Type: transaction.type,
            Category: transaction.category,
            Amount: transaction.amount,
            'Expense Type': transaction.expenseType || 'N/A',
            Notes: transaction.notes || '',
        }));

        // Create worksheet
        const worksheet = XLSX.utils.json_to_sheet(data);

        // Set column widths
        const columnWidths = [
            { wch: 12 }, // Date
            { wch: 10 }, // Type
            { wch: 20 }, // Category
            { wch: 12 }, // Amount
            { wch: 15 }, // Expense Type
            { wch: 30 }, // Notes
        ];
        worksheet['!cols'] = columnWidths;

        // Create workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

        // Generate file
        XLSX.writeFile(workbook, `${filename}.xlsx`);

        return { success: true, message: 'XLSX file downloaded successfully' };
    } catch (error) {
        console.error('Error exporting to XLSX:', error);
        return { success: false, message: 'Failed to export XLSX file' };
    }
};

/**
 * Export transactions to CSV format
 */
export const exportToCSV = (transactions, filename = 'transactions') => {
    try {
        // Prepare data for export
        const data = transactions.map(transaction => ({
            Date: formatDate(transaction.date, 'yyyy-MM-dd'),
            Type: transaction.type,
            Category: transaction.category,
            Amount: transaction.amount,
            'Expense Type': transaction.expenseType || 'N/A',
            Notes: transaction.notes || '',
        }));

        // Create worksheet
        const worksheet = XLSX.utils.json_to_sheet(data);

        // Create workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

        // Generate CSV file
        XLSX.writeFile(workbook, `${filename}.csv`, { bookType: 'csv' });

        return { success: true, message: 'CSV file downloaded successfully' };
    } catch (error) {
        console.error('Error exporting to CSV:', error);
        return { success: false, message: 'Failed to export CSV file' };
    }
};

/**
 * Export budget data to XLSX
 */
export const exportBudgetToXLSX = (budgetData, filename = 'budget') => {
    try {
        const data = budgetData.map(item => ({
            Category: item.category,
            'Budget Limit': item.limit,
            'Current Spending': item.spent || 0,
            'Remaining': item.limit - (item.spent || 0),
            'Percentage Used': item.limit > 0 ? `${((item.spent || 0) / item.limit * 100).toFixed(1)}%` : '0%',
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Budget');

        XLSX.writeFile(workbook, `${filename}.xlsx`);

        return { success: true, message: 'Budget XLSX file downloaded successfully' };
    } catch (error) {
        console.error('Error exporting budget to XLSX:', error);
        return { success: false, message: 'Failed to export budget XLSX file' };
    }
};

/**
 * Export summary report to XLSX with multiple sheets
 */
export const exportSummaryReport = (data, filename = 'financial-summary') => {
    try {
        const workbook = XLSX.utils.book_new();

        // Summary sheet
        const summaryData = [
            { Metric: 'Total Income', Value: data.totalIncome },
            { Metric: 'Total Expenses', Value: data.totalExpenses },
            { Metric: 'Net Savings', Value: data.totalIncome - data.totalExpenses },
            { Metric: 'Savings Rate', Value: `${data.savingsRate}%` },
        ];
        const summarySheet = XLSX.utils.json_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

        // Category breakdown sheet
        if (data.categoryBreakdown) {
            const categorySheet = XLSX.utils.json_to_sheet(data.categoryBreakdown);
            XLSX.utils.book_append_sheet(workbook, categorySheet, 'Categories');
        }

        // Monthly trends sheet
        if (data.monthlyTrends) {
            const trendsSheet = XLSX.utils.json_to_sheet(data.monthlyTrends);
            XLSX.utils.book_append_sheet(workbook, trendsSheet, 'Monthly Trends');
        }

        XLSX.writeFile(workbook, `${filename}.xlsx`);

        return { success: true, message: 'Summary report downloaded successfully' };
    } catch (error) {
        console.error('Error exporting summary report:', error);
        return { success: false, message: 'Failed to export summary report' };
    }
};
