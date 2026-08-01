import { ImageResponse } from "next/og";

export const alt = "Motivational Weapons";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #16110c 0%, #1f1710 55%, #2a1a0c 100%)",
        color: "#f3ecdf",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            width: 90,
            height: 90,
            borderRadius: "9999px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #e8622c 0%, #d9a441 100%)",
            fontSize: 52,
          }}
        >
          🔥
        </div>
      </div>
      <div
        style={{
          marginTop: 36,
          fontSize: 72,
          fontWeight: 700,
          letterSpacing: -1,
          display: "flex",
        }}
      >
        MOTIVATIONAL WEAPONS
      </div>
      <div
        style={{
          marginTop: 20,
          fontSize: 32,
          color: "#c9bda8",
          display: "flex",
        }}
      >
        Turn your struggles into your strength
      </div>
    </div>,
    { ...size }
  );
}
