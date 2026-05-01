import {
  Line,
  LineChart,
  ResponsiveContainer,
} from 'recharts';

export default function SparklineChart({ data, positive }) {
  const stroke = positive ? '#34d399' : '#f87171';

  return (
    <div className="h-10 w-28">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <Line
            type="monotone"
            dataKey="v"
            stroke={stroke}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
