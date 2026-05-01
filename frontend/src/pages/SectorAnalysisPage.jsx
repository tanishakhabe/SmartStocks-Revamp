import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';
import { SECTOR_BAR_DATA, SECTOR_SCATTER_DATA, SECTOR_TABLE_ROWS } from '../constants/placeholderData';

const BAR_FILL = '#3b82f6';

export default function SectorAnalysisPage() {
  return (
    <div className="min-h-full space-y-10">
      <div>
        <h1 className="text-xl font-semibold text-white md:text-2xl">Sector analysis</h1>
        <p className="mt-1 text-sm text-zinc-400">Momentum and risk lenses across industries.</p>
      </div>

      <section className="rounded-lg border border-zinc-700/80 bg-zinc-800 p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Avg momentum by sector
        </h2>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SECTOR_BAR_DATA} margin={{ top: 8, right: 8, left: 0, bottom: 64 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
              <XAxis
                dataKey="sector"
                tick={{ fill: '#a1a1aa', fontSize: 10 }}
                interval={0}
                angle={-35}
                textAnchor="end"
                height={70}
              />
              <YAxis tick={{ fill: '#a1a1aa', fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  border: '1px solid #3f3f46',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="momentum" radius={[4, 4, 0, 0]}>
                {SECTOR_BAR_DATA.map((_, i) => (
                  <Cell key={i} fill={BAR_FILL} fillOpacity={0.85 - i * 0.02} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-lg border border-zinc-700/80 bg-zinc-800 p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Volatility vs momentum
        </h2>
        <div className="mt-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 16, right: 16, bottom: 16, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
              <XAxis
                type="number"
                dataKey="volatility"
                name="Avg volatility"
                tick={{ fill: '#a1a1aa', fontSize: 10 }}
                label={{ value: 'Avg volatility', position: 'bottom', fill: '#71717a', fontSize: 11 }}
              />
              <YAxis
                type="number"
                dataKey="momentum"
                name="Avg momentum"
                tick={{ fill: '#a1a1aa', fontSize: 10 }}
                label={{
                  value: 'Avg momentum',
                  angle: -90,
                  position: 'insideLeft',
                  fill: '#71717a',
                  fontSize: 11,
                }}
              />
              <ZAxis type="number" range={[60, 60]} />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{
                  backgroundColor: '#18181b',
                  border: '1px solid #3f3f46',
                  borderRadius: '8px',
                }}
                formatter={(value, name) => [value, name === 'momentum' ? 'Momentum' : 'Volatility']}
              />
              <Scatter data={SECTOR_SCATTER_DATA} fill="#3b82f6">
                <LabelList dataKey="sector" position="top" fill="#d4d4d8" fontSize={9} />
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <ul className="mt-4 flex flex-wrap gap-2">
          {SECTOR_SCATTER_DATA.map((s) => (
            <li
              key={s.sector}
              className="rounded-full border border-zinc-600 bg-zinc-900 px-2 py-0.5 text-xs text-zinc-300"
            >
              {s.sector}
            </li>
          ))}
        </ul>
      </section>

      <section className="overflow-hidden rounded-lg border border-zinc-700/80 bg-zinc-800">
        <h2 className="border-b border-zinc-700 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Sector snapshot
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-700 text-zinc-400">
                <th className="px-4 py-3 font-medium">Sector</th>
                <th className="px-4 py-3 font-medium">Avg P/E</th>
                <th className="px-4 py-3 font-medium">Avg momentum</th>
                <th className="px-4 py-3 font-medium">Avg vol</th>
                <th className="px-4 py-3 font-medium">Match score</th>
              </tr>
            </thead>
            <tbody>
              {SECTOR_TABLE_ROWS.map((row) => (
                <tr key={row.sector} className="border-b border-zinc-700/60 last:border-0">
                  <td className="px-4 py-3 font-medium text-white">{row.sector}</td>
                  <td className="px-4 py-3 text-zinc-300">{row.avgPe}</td>
                  <td className="px-4 py-3 text-zinc-300">{row.avgMomentum}</td>
                  <td className="px-4 py-3 text-zinc-300">{row.avgVol}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-blue-500/15 px-2 py-0.5 font-medium text-blue-400">
                      {row.matchScore}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
