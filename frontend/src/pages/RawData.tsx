import { useQuery } from "@tanstack/react-query";
import { useFilterStore } from "../store/filterStore";
import { fetchRaw } from "../api/climate";
import LoadingSpinner from "../components/UI/LoadingSpinner";

export default function RawData() {
  const month = useFilterStore((s) => s.selectedMonth);
  const { data, isLoading } = useQuery({ queryKey: ["raw", month], queryFn: () => fetchRaw(month, 100) });

  if (isLoading) return <LoadingSpinner />;
  if (!data?.length) return <p style={{ color: "var(--muted)" }}>No data.</p>;

  const keys = Object.keys(data[0]);

  function downloadCsv() {
    const header = keys.join(",");
    const rows = data.map((r: any) => keys.map((k) => r[k] ?? "").join(","));
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "twinnetra_filtered.csv";
    a.click();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ color: "var(--teal)" }}>Dataset Preview (first 100 rows)</h3>
        <button onClick={downloadCsv} style={{
          background: "var(--navy-3)", border: "1px solid rgba(0,201,200,0.28)",
          color: "var(--teal)", borderRadius: 8, padding: "0.4rem 1rem",
          fontSize: "0.72rem", cursor: "pointer", fontFamily: "'Space Mono', monospace",
        }}>
          ↓ Download CSV
        </button>
      </div>
      <div style={{ overflowX: "auto", background: "var(--navy-2)", border: "1px solid rgba(0,201,200,0.12)", borderRadius: 12 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
          <thead>
            <tr style={{ background: "rgba(0,201,200,0.04)" }}>
              {keys.map((k) => (
                <th key={k} style={{ padding: "0.65rem 0.8rem", borderBottom: "1px solid rgba(0,201,200,0.1)", textAlign: "left", fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", textTransform: "uppercase", color: "var(--muted)", whiteSpace: "nowrap" }}>
                  {k}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row: any, i: number) => (
              <tr key={i} style={{ borderBottom: "1px solid rgba(0,201,200,0.05)" }}>
                {keys.map((k) => (
                  <td key={k} style={{ padding: "0.5rem 0.8rem", color: "var(--star)", whiteSpace: "nowrap" }}>
                    {typeof row[k] === "number" ? row[k].toFixed(2) : row[k] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
