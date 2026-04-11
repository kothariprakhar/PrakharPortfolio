import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Prakhar Kothari — AI Product Manager";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0A0A0F",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(10,10,15,0.7) 100%)",
          }}
        />

        {/* Accent line top */}
        <div
          style={{
            width: 120,
            height: 2,
            background: "linear-gradient(to right, #00D4FF, #7B2FFF)",
            borderRadius: 1,
            marginBottom: 32,
          }}
        />

        {/* Name */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#E8E8F0",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          Prakhar Kothari
        </div>

        {/* Role */}
        <div
          style={{
            marginTop: 16,
            fontSize: 18,
            fontWeight: 400,
            color: "#00D4FF",
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
          }}
        >
          AI Product Manager
        </div>

        {/* Subtitle */}
        <div
          style={{
            marginTop: 20,
            fontSize: 16,
            color: "#9898B0",
            maxWidth: 500,
            textAlign: "center" as const,
            lineHeight: 1.5,
          }}
        >
          Building at the intersection of AI &amp; Product.
          Kellogg MBA + AI at Northwestern.
        </div>

        {/* Accent line bottom */}
        <div
          style={{
            width: 80,
            height: 1,
            marginTop: 32,
            background:
              "linear-gradient(to right, transparent, rgba(0,212,255,0.3), rgba(123,47,255,0.3), transparent)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
