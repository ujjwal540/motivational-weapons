import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const title = new URL(request.url).searchParams.get("title") ?? "Daily Motivation";
  return new ImageResponse(
    <div
      style={{
        background: "#11100e",
        color: "#fff8eb",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        overflow: "hidden",
        padding: "72px",
        position: "relative",
        width: "100%",
      }}
    >
      <div style={{ background: "#e85d24", height: 520, position: "absolute", right: -180, top: -220, transform: "rotate(28deg)", width: 520 }} />
      <div style={{ border: "2px solid #f2b84b", bottom: 54, height: 180, position: "absolute", right: 70, transform: "rotate(45deg)", width: 180 }} />
      <div style={{ color: "#f2b84b", fontSize: 28, fontWeight: 700, letterSpacing: 7 }}>MOTIVATIONAL WEAPONS</div>
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 1030, position: "relative" }}>
        <div style={{ color: "#e85d24", fontSize: 24, fontWeight: 700, letterSpacing: 5 }}>DAILY WEAPON</div>
        <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.08, marginTop: 24 }}>{title}</div>
        <div style={{ color: "#c9bda9", fontSize: 28, marginTop: 32 }}>Turn struggle into strength.</div>
      </div>
      <div style={{ color: "#f2b84b", fontSize: 22, letterSpacing: 3, position: "relative" }}>DISCIPLINE OVER MOOD</div>
    </div>
  );
}