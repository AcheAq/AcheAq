import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  Package,
  Search,
  CheckCircle,
  TrendingUp,
  Users,
  Download,
} from "lucide-react";

import StatCard from "../../components/StatCard/StatCard";
import statsService from "../../services/statsService";
import styles from "./Dashboard.module.css";

const PIE_COLORS = ["#426ABC", "#ea7c3f"];
const STATUS_COLORS = ["#f59e0b", "#22c55e"];

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await statsService.getStats();
        setStats(data);
      } catch (err) {
        setError(
          err?.response?.data?.message || "Erro ao carregar estatísticas.",
        );
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await statsService.exportExcel();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `acheaq-relatorio-${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Não foi possível gerar a planilha.");
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return <p className={styles.state}>Carregando estatísticas...</p>;
  }

  if (error) {
    return <p className={styles.stateError}>{error}</p>;
  }

  const { summary, byType, byStatus, byCategory, byMonth } = stats;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>
            Visão geral dos itens perdidos e encontrados da instituição.
          </p>
        </div>
        <button
          type="button"
          className={styles.exportBtn}
          onClick={handleExport}
          disabled={exporting}
        >
          <Download size={18} />
          {exporting ? "Gerando..." : "Exportar Excel"}
        </button>
      </header>

      <section className={styles.cards}>
        <StatCard
          icon={Package}
          value={summary.totalItems}
          label="Total de itens"
          variant="primary"
        />
        <StatCard
          icon={Search}
          value={summary.lost}
          label="Perdidos"
          variant="orange"
        />
        <StatCard
          icon={CheckCircle}
          value={summary.resolved}
          label="Devolvidos"
          variant="success"
        />
        <StatCard
          icon={TrendingUp}
          value={`${summary.resolutionRate}%`}
          label="Taxa de devolução"
          variant="info"
        />
        <StatCard
          icon={Users}
          value={summary.totalUsers}
          label="Usuários"
          variant="primary"
        />
      </section>

      <section className={styles.charts}>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Perdidos x Encontrados</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={byType}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {byType.map((entry, index) => (
                  <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Status dos itens</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={byStatus}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                label
              >
                {byStatus.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={STATUS_COLORS[index % STATUS_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={`${styles.chartCard} ${styles.chartWide}`}>
          <h3 className={styles.chartTitle}>Itens por categoria</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={byCategory}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis allowDecimals={false} fontSize={12} />
              <Tooltip />
              <Bar name="Itens" dataKey="value" fill="#426ABC" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={`${styles.chartCard} ${styles.chartWide}`}>
          <h3 className={styles.chartTitle}>Itens por mês</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={byMonth}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis allowDecimals={false} fontSize={12} />
              <Tooltip />
              <Line
                name="Itens"
                type="monotone"
                dataKey="value"
                stroke="#426ABC"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
