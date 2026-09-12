import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const title = new URL(request.url).searchParams.get("title") ?? "Daily Motivation";
  return new ImageResponse(
    <div style={{ background: "#101010", color: "#f5f5f5", display: "flex", flexDirection: "column", height: "100%", justifyContent: "center", padding: "80px", width: "100%" }}>
      <div style={{ color: "#f97316", fontSize: 28, letterSpacing: 4 }}>MOTIVATIONAL WEAPONS</div>
      <div style={{ fontSize: 58, fontWeight: 700, marginTop: 30 }}>{title}</div>
      <div style={{ color: "#a3a3a3", fontSize: 25, marginTop: 36 }}>Turn struggle into strength.</div>
    </div>
  );
}