import { query } from '../config/database.js';

// Get global reports across all societies
export const getGlobalReports = async (req, res) => {
  try {
    const { year } = req.query;
    const currentYear = year || new Date().getFullYear();

    // Aggregate financial data
    const financialSummary = await query(
      `
      SELECT 
        COUNT(DISTINCT f.society_apartment_id) as total_societies,
        SUM(CASE WHEN f.transaction_type = 'income' THEN f.amount ELSE 0 END) as total_income,
        SUM(CASE WHEN f.transaction_type = 'expense' THEN f.amount ELSE 0 END) as total_expenses,
        SUM(CASE WHEN f.transaction_type = 'income' THEN f.amount ELSE 0 END) - 
        SUM(CASE WHEN f.transaction_type = 'expense' THEN f.amount ELSE 0 END) as net_income
      FROM finance f
      WHERE f.year = $1
    `,
      [currentYear]
    );

    // Aggregate complaint statistics
    const complaintStats = await query(`
      SELECT 
        COUNT(*) as total_complaints,
        COUNT(DISTINCT society_apartment_id) as societies_with_complaints,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress,
        COUNT(CASE WHEN status = 'closed' THEN 1 END) as closed
      FROM complaints
    `);

    // Society-wise breakdown
    const societyBreakdown = await query(
      `
      SELECT 
        s.id, s.name,
        COUNT(DISTINCT u.id) as total_units,
        COUNT(DISTINCT c.id) as total_complaints,
        SUM(CASE WHEN f.transaction_type = 'income' THEN f.amount ELSE 0 END) as income,
        SUM(CASE WHEN f.transaction_type = 'expense' THEN f.amount ELSE 0 END) as expenses
      FROM societies s
      LEFT JOIN units u ON s.id = u.society_apartment_id
      LEFT JOIN complaints c ON s.id = c.society_apartment_id
      LEFT JOIN finance f ON s.id = f.society_apartment_id AND f.year = $1
      GROUP BY s.id, s.name
      ORDER BY s.name
    `,
      [currentYear]
    );

    const financial = financialSummary.rows[0] || {
      total_societies: 0,
      total_income: '0',
      total_expenses: '0',
      net_income: '0',
    };

    const complaints = complaintStats.rows[0] || {
      total_complaints: 0,
      societies_with_complaints: 0,
      pending: 0,
      resolved: 0,
      in_progress: 0,
      closed: 0,
    };

    const breakdownRows = societyBreakdown.rows || [];

    // Shape the response to match frontend + docs expectations
    const data = {
      // Summary cards
      total_income: Number(financial.total_income) || 0,
      total_expenses: Number(financial.total_expenses) || 0,
      net_income: Number(financial.net_income) || 0,
      total_complaints: Number(complaints.total_complaints) || 0,

      // Financial summary by society (for bar chart)
      society_financials: breakdownRows.map((row) => ({
        society_name: row.name,
        total_income: Number(row.income) || 0,
      })),

      // Complaint statistics (for pie chart)
      complaint_statistics: {
        pending: Number(complaints.pending) || 0,
        resolved: Number(complaints.resolved) || 0,
        in_progress: Number(complaints.in_progress) || 0,
        closed: Number(complaints.closed) || 0,
      },

      // Society-wise breakdown cards
      society_breakdown: breakdownRows.map((row) => {
        const income = Number(row.income) || 0;
        const expenses = Number(row.expenses) || 0;
        return {
          society_name: row.name,
          income,
          expenses,
          net_income: income - expenses,
          complaints: Number(row.total_complaints) || 0,
        };
      }),
    };

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Global reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch global reports',
      error: error.message,
    });
  }
};
