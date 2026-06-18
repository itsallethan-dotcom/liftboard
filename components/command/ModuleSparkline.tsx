type ModuleSparklineProps = {
  points: number[];
};

export function ModuleSparkline({ points }: ModuleSparklineProps) {
  if (points.length < 2) return null;

  const width = 56;
  const height = 18;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const path = points
    .map((value, index) => {
      const x = (index / (points.length - 1)) * width;
      const y = height - ((value - min) / range) * (height - 2) - 1;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg
      className="command-module__sparkline"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <path d={path} fill="none" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}
