// Aramean emblem — winged torch + four-star tablet — and the Beth-Nahrin
// homeland map. Ported faithfully from the design's generative SVG to
// react-native-svg. Drawn, not an asset, so it scales crisply everywhere.
import Svg, { Circle, G, Path, Rect, Text as SvgText } from "react-native-svg";
import { colors } from "@/lib/theme";

function starPath(cx: number, cy: number, r: number): string {
  const pts: [number, number][] = [];
  for (let i = 0; i < 10; i++) {
    const ang = -Math.PI / 2 + (i * Math.PI) / 5;
    const rad = i % 2 === 0 ? r : r * 0.42;
    pts.push([cx + rad * Math.cos(ang), cy + rad * Math.sin(ang)]);
  }
  return "M" + pts.map((p) => p[0].toFixed(1) + "," + p[1].toFixed(1)).join("L") + "Z";
}

// Row of four stars inside a tablet — the divider ornament.
export function Stars4({ size = 76, color = colors.gold }: { size?: number; color?: string }) {
  const W = 200, H = 56;
  const xs = [40, 80, 120, 160];
  return (
    <Svg width={size} height={(size * H) / W} viewBox={`0 0 ${W} ${H}`}>
      <Rect x={6} y={8} width={188} height={40} rx={3} stroke={color} strokeWidth={2.5} fill="none" />
      {xs.map((x, i) => (
        <Path key={i} d={starPath(x, 28, 12)} fill={color} />
      ))}
    </Svg>
  );
}

// The full emblem: flaming torch, spread wings, tail, four-star tablet.
export function Emblem({ size = 220, color = colors.accent }: { size?: number; color?: string }) {
  const W = 640, H = 320, cx = 320;
  const bars: React.ReactNode[] = [];
  const rows = 8, inner = 40, dashLen = 25, dashH = 5, gap = 6;
  const maxReach = 272, shoulderY = 98, rowStep = 9, droopMax = 26;
  ([-1, 1] as const).forEach((s) => {
    for (let r = 0; r < rows; r++) {
      const rowY = shoulderY + r * rowStep;
      const reach = maxReach * (1 - r * 0.062);
      const n = Math.max(2, Math.floor(reach / (dashLen + gap)));
      for (let i = 0; i < n; i++) {
        const dist = inner + i * (dashLen + gap);
        const t = n > 1 ? i / (n - 1) : 0;
        const by = rowY + Math.pow(t, 2) * (droopMax + r * 5.5);
        const bx = cx + s * dist;
        const ang = s * (2 + t * 13 + r * 0.7);
        bars.push(
          <Rect
            key={`${s}-${r}-${i}`}
            x={bx - dashLen / 2}
            y={by - dashH / 2}
            width={dashLen}
            height={dashH}
            rx={dashH / 2}
            fill={color}
            transform={`rotate(${ang} ${bx} ${by})`}
          />
        );
      }
    }
  });

  const tail: React.ReactNode[] = [];
  for (let i = -2; i <= 2; i++) {
    tail.push(<Rect key={`t${i}`} x={cx + i * 13 - 3.5} y={166} width={7} height={84} rx={2} fill={color} />);
  }

  const tongue = (bx: number, baseY: number, h: number, w: number) =>
    `M${bx},${baseY} C${bx - w},${baseY - h * 0.45} ${bx - w * 0.35},${baseY - h} ${bx},${baseY - h} ` +
    `C${bx + w * 0.35},${baseY - h} ${bx + w},${baseY - h * 0.45} ${bx},${baseY} Z`;

  return (
    <Svg width={size} height={(size * H) / W} viewBox={`0 0 ${W} ${H}`}>
      <G>{bars}</G>
      <G>{tail}</G>
      <G>
        <Rect x={cx - 62} y={256} width={124} height={42} rx={4} fill="none" stroke={color} strokeWidth={6} />
        {[-1.5, -0.5, 0.5, 1.5].map((m, i) => (
          <Path key={i} d={starPath(cx + m * 28, 277, 12)} fill={color} />
        ))}
      </G>
      <Path d={`M${cx - 34},90 Q${cx},134 ${cx + 34},90 Z`} fill={color} />
      <Rect x={cx - 36} y={84} width={72} height={8} rx={4} fill={color} />
      <Path d={tongue(cx, 88, 78, 17)} fill={color} />
      <Path d={tongue(cx - 15, 86, 50, 13)} fill={color} />
      <Path d={tongue(cx + 15, 86, 54, 13)} fill={color} />
    </Svg>
  );
}

// Historical homeland map — Beth-Nahrin / Tur Abdin, ancient places.
export function HomelandMap({ width = 660 }: { width?: number }) {
  const places = [
    { x: 150, y: 96, name: "Urhoy", sub: "Edessa", big: false },
    { x: 360, y: 118, name: "Nsibin", sub: "Nisibis", big: false },
    { x: 300, y: 150, name: "Mardin", sub: "", big: false },
    { x: 392, y: 168, name: "Midyat", sub: "Tur Abdin", big: true },
    { x: 452, y: 184, name: "Mor Gabriel", sub: "monastery, 397 AD", big: false },
    { x: 560, y: 96, name: "Nineveh", sub: "Ninwe", big: false },
  ];
  return (
    <Svg width={width} height={(width * 300) / 660} viewBox="0 0 660 300">
      <Path
        d="M320 130 Q400 110 500 150 Q520 200 440 220 Q360 230 300 200 Q290 160 320 130 Z"
        fill={colors.accentTint}
        stroke={colors.accent}
        strokeWidth={1.2}
        strokeDasharray="2 4"
      />
      <SvgText x={404} y={208} textAnchor="middle" fontFamily="NotoSansSyriac_400Regular" fontSize={15} fill={colors.accent} opacity={0.8}>
        ܛܘܪ ܥܒܕܝܢ
      </SvgText>

      <Path d="M70 30 C110 90 90 150 140 210 C170 250 150 280 190 300" fill="none" stroke={colors.ink3} strokeWidth={2.2} strokeLinecap="round" />
      <Path d="M600 30 C560 80 590 140 540 200 C510 245 540 275 500 300" fill="none" stroke={colors.ink3} strokeWidth={2.2} strokeLinecap="round" />
      <SvgText x={92} y={250} fontFamily="Newsreader_400Regular_Italic" fontSize={13} fill={colors.ink3} transform="rotate(60 92 250)">Euphrates</SvgText>
      <SvgText x={556} y={250} fontFamily="Newsreader_400Regular_Italic" fontSize={13} fill={colors.ink3} transform="rotate(-58 556 250)">Tigris</SvgText>

      <SvgText x={330} y={44} textAnchor="middle" fontFamily="Newsreader_500Medium" fontSize={17} fill={colors.ink2}>
        BETH — NAHRIN
      </SvgText>
      <SvgText x={330} y={64} textAnchor="middle" fontSize={12} fill={colors.ink3} fontFamily="Newsreader_400Regular_Italic">
        "the land between the rivers" · Mesopotamia
      </SvgText>

      {places.map((p, i) => (
        <G key={i}>
          <Circle cx={p.x} cy={p.y} r={p.big ? 5.5 : 3.5} fill={p.big ? colors.accent : colors.ink} />
          {p.big && <Circle cx={p.x} cy={p.y} r={10} fill="none" stroke={colors.accent} strokeWidth={1.2} />}
          <SvgText x={p.x + 9} y={p.y - 2} fontFamily="Newsreader_500Medium" fontSize={p.big ? 15 : 13} fill={colors.ink}>
            {p.name}
          </SvgText>
          {!!p.sub && (
            <SvgText x={p.x + 9} y={p.y + 12} fontSize={11} fill={colors.ink3} fontFamily="Newsreader_400Regular_Italic">
              {p.sub}
            </SvgText>
          )}
        </G>
      ))}
    </Svg>
  );
}
