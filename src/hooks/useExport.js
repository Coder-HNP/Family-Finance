import { useState } from 'react';
import { exportToXLSX, exportToCSV, exportBudgetToXLSX, exportSummaryReport } from '../utils/exportHelpers';

/**
 * Hook for exporting data to spreadsheets
 */
export const useExport = () => {
    const [exporting, setExporting] = useState(false);

    const exportTransactionsXLSX = async (transactions, filename) => {
        setExporting(true);
        const result = exportToXLSX(transactions, filename);
        setExporting(false);
        return result;
    };

    const exportTransactionsCSV = async (transactions, filename) => {
        setExporting(true);
        const result = exportToCSV(transactions, filename);
        setExporting(false);
        return result;
    };

    const exportBudgetXLSX = async (budgetData, filename) => {
        setExporting(true);
        const result = exportBudgetToXLSX(budgetData, filename);
        setExporting(false);
        return result;
    };

    const exportSummary = async (data, filename) => {
        setExporting(true);
        const result = exportSummaryReport(data, filename);
        setExporting(false);
        return result;
    };

    return {
        exportTransactionsXLSX,
        exportTransactionsCSV,
        exportBudgetXLSX,
        exportSummary,
        exporting,
    };
};

export default useExport;
