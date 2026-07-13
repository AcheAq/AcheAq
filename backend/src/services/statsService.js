const ExcelJS = require("exceljs");
const statsRepository = require("../repositories/statsRepository");

function pickCount(rows, field, value) {
  const row = rows.find((r) => r[field] === value);
  return row ? row._count._all : 0;
}

function fillMonthGaps(rows) {
  if (rows.length === 0) return [];

  const sorted = [...rows].sort((a, b) => a.month.localeCompare(b.month));
  const values = Object.fromEntries(sorted.map((r) => [r.month, r.value]));

  const [startYear, startMonth] = sorted[0].month.split("-").map(Number);
  const [endYear, endMonth] = sorted[sorted.length - 1].month
    .split("-")
    .map(Number);

  const result = [];
  let year = startYear;
  let month = startMonth;

  while (year < endYear || (year === endYear && month <= endMonth)) {
    const key = `${year}-${String(month).padStart(2, "0")}`;
    result.push({ month: key, value: values[key] || 0 });

    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }

  return result;
}

async function getStats() {
  const [
    totalItems,
    totalUsers,
    totalCategories,
    byType,
    byStatus,
    byCategory,
    byLocation,
    byMonth,
    avgResolutionDays,
    staleOpenItems,
  ] = await Promise.all([
    statsRepository.countItems(),
    statsRepository.countUsers(),
    statsRepository.countCategories(),
    statsRepository.groupItemsByType(),
    statsRepository.groupItemsByStatus(),
    statsRepository.groupItemsByCategory(),
    statsRepository.groupItemsByLocation(),
    statsRepository.itemsByMonth(),
    statsRepository.averageResolutionDays(),
    statsRepository.countStaleOpenItems(30),
  ]);

  const categoryIds = byCategory.map((c) => c.categoryId);
  const categories = await statsRepository.findCategoriesByIds(categoryIds);
  const categoryNames = Object.fromEntries(
    categories.map((c) => [c.id, c.name]),
  );

  const lost = pickCount(byType, "type", "LOST");
  const found = pickCount(byType, "type", "FOUND");
  const open = pickCount(byStatus, "status", "OPEN");
  const resolved = pickCount(byStatus, "status", "RESOLVED");

  const resolutionRate =
    totalItems > 0 ? Math.round((resolved / totalItems) * 100) : 0;

  return {
    summary: {
      totalItems,
      totalUsers,
      totalCategories,
      lost,
      found,
      open,
      resolved,
      resolutionRate,
      avgResolutionDays:
        avgResolutionDays !== null ? Math.round(avgResolutionDays * 10) / 10 : null,
      staleOpenItems,
    },
    byType: [
      { name: "Perdidos", value: lost },
      { name: "Encontrados", value: found },
    ],
    byStatus: [
      { name: "Em aberto", value: open },
      { name: "Devolvidos", value: resolved },
    ],
    byCategory: byCategory
      .map((c) => ({
        name: categoryNames[c.categoryId] || "Sem categoria",
        value: c._count._all,
      }))
      .sort((a, b) => b.value - a.value),
    byLocation: byLocation.map((l) => ({
      name: l.location,
      value: l._count._all,
    })),
    byMonth: fillMonthGaps(
      byMonth.map((m) => ({ month: m.month, value: m.total })),
    ),
  };
}

function styleHeaderRow(sheet) {
  const header = sheet.getRow(1);
  header.font = { bold: true, color: { argb: "FFFFFFFF" } };
  header.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF426ABC" },
  };
  header.alignment = { vertical: "middle" };
}

function formatDate(date) {
  return date ? new Date(date).toLocaleDateString("pt-BR") : "-";
}

async function buildStatsWorkbook() {
  const stats = await getStats();
  const items = await statsRepository.findAllItemsForExport();

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "AcheAq";
  workbook.created = new Date();

  const resumo = workbook.addWorksheet("Resumo");
  resumo.columns = [
    { header: "Métrica", key: "metric", width: 30 },
    { header: "Valor", key: "value", width: 18 },
  ];
  resumo.addRows([
    { metric: "Total de itens", value: stats.summary.totalItems },
    { metric: "Perdidos", value: stats.summary.lost },
    { metric: "Encontrados", value: stats.summary.found },
    { metric: "Em aberto", value: stats.summary.open },
    { metric: "Devolvidos", value: stats.summary.resolved },
    { metric: "Taxa de devolução (%)", value: stats.summary.resolutionRate },
    {
      metric: "Tempo médio até devolução (dias)",
      value: stats.summary.avgResolutionDays ?? "-",
    },
    { metric: "Itens parados (+30 dias)", value: stats.summary.staleOpenItems },
    { metric: "Usuários cadastrados", value: stats.summary.totalUsers },
    { metric: "Categorias", value: stats.summary.totalCategories },
  ]);
  styleHeaderRow(resumo);

  const sheet = workbook.addWorksheet("Itens");
  sheet.columns = [
    { header: "Título", key: "title", width: 30 },
    { header: "Tipo", key: "type", width: 14 },
    { header: "Status", key: "status", width: 14 },
    { header: "Categoria", key: "category", width: 22 },
    { header: "Local", key: "location", width: 26 },
    { header: "Data da ocorrência", key: "occurrenceDate", width: 20 },
    { header: "Anunciante", key: "user", width: 26 },
    { header: "Devolvido em", key: "returnedAt", width: 18 },
  ];
  items.forEach((i) =>
    sheet.addRow({
      title: i.title,
      type: i.type === "LOST" ? "Perdido" : "Encontrado",
      status: i.status === "RESOLVED" ? "Devolvido" : "Em aberto",
      category: i.category?.name || "-",
      location: i.location,
      occurrenceDate: formatDate(i.occurrenceDate),
      user: i.user?.name || "-",
      returnedAt: formatDate(i.returnedAt),
    }),
  );
  styleHeaderRow(sheet);

  const cat = workbook.addWorksheet("Por Categoria");
  cat.columns = [
    { header: "Categoria", key: "name", width: 26 },
    { header: "Qtd. de itens", key: "value", width: 16 },
  ];
  stats.byCategory.forEach((c) => cat.addRow(c));
  styleHeaderRow(cat);

  return workbook;
}

module.exports = {
  getStats,
  buildStatsWorkbook,
};
