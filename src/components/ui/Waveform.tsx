const fallbackBars = [12, 18, 9, 22, 30, 16, 10, 26, 34, 21, 14, 20, 12, 28, 17, 24, 8, 18];

export function Waveform({ active = false, bars = fallbackBars }: { active?: boolean; bars?: number[] }) {
  return (
    <div className={`waveform ${active ? "active" : ""}`} aria-hidden="true">
      {bars.map((height, index) => (
        <span key={`${height}-${index}`} style={{ height: `${height}px` }} />
      ))}
    </div>
  );
}
