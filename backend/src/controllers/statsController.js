const statsService = require("../services/statsService");

async function getStats(req, res) {
  try {
    const stats = await statsService.getStats();
    return res.json(stats);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function exportExcel(req, res) {
  try {
    const workbook = await statsService.buildStatsWorkbook();
    const date = new Date().toISOString().slice(0, 10);
    const filename = `acheaq-relatorio-${date}.xlsx`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`,
    );

    await workbook.xlsx.write(res);
    return res.end();
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

module.exports = {
  getStats,
  exportExcel,
};
