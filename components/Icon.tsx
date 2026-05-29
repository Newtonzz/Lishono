// Lucide-style stroke icons (functional UI only), ported from the design.
import Svg, { Circle, Line, Path, Polygon, Polyline, Rect } from "react-native-svg";
import { colors } from "@/lib/theme";

export type IconName =
  | "search" | "play" | "chevronRight" | "chevronLeft" | "arrowUp"
  | "plus" | "check" | "mic" | "upload" | "reply" | "book" | "quill" | "sound";

export function Icon({ name, size = 20, stroke = 2, color = colors.ink2 }: { name: IconName; size?: number; stroke?: number; color?: string }) {
  const common = { stroke: color, strokeWidth: stroke, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  const body = () => {
    switch (name) {
      case "search":
        return (<><Circle cx={11} cy={11} r={7} {...common} /><Line x1={21} y1={21} x2={16.65} y2={16.65} {...common} /></>);
      case "play":
        return <Polygon points="7 5 19 12 7 19 7 5" fill={color} />;
      case "chevronRight":
        return <Polyline points="9 6 15 12 9 18" {...common} />;
      case "chevronLeft":
        return <Polyline points="15 6 9 12 15 18" {...common} />;
      case "arrowUp":
        return (<><Line x1={12} y1={19} x2={12} y2={5} {...common} /><Polyline points="6 11 12 5 18 11" {...common} /></>);
      case "plus":
        return (<><Line x1={12} y1={5} x2={12} y2={19} {...common} /><Line x1={5} y1={12} x2={19} y2={12} {...common} /></>);
      case "check":
        return <Polyline points="20 6 9 17 4 12" {...common} />;
      case "mic":
        return (<><Rect x={9} y={2} width={6} height={12} rx={3} {...common} /><Path d="M5 10a7 7 0 0 0 14 0" {...common} /><Line x1={12} y1={17} x2={12} y2={22} {...common} /></>);
      case "upload":
        return (<><Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" {...common} /><Polyline points="17 8 12 3 7 8" {...common} /><Line x1={12} y1={3} x2={12} y2={15} {...common} /></>);
      case "reply":
        return (<><Polyline points="9 17 4 12 9 7" {...common} /><Path d="M20 18v-2a4 4 0 0 0-4-4H4" {...common} /></>);
      case "quill":
        return (<><Path d="M3 21l4-1 11-11a2.5 2.5 0 0 0-3.5-3.5L3.5 16.5 3 21z" {...common} /><Line x1={13} y1={6} x2={18} y2={11} {...common} /></>);
      case "sound":
        return (<><Polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill={color} /><Path d="M15.54 8.46a5 5 0 0 1 0 7.07" {...common} /></>);
      default:
        return null;
    }
  };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {body()}
    </Svg>
  );
}
