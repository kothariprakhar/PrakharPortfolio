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
          background: "#FAF8F3",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Soft vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, transparent 50%, rgba(160,82,45,0.06) 100%)",
          }}
        />

        {/* Accent line top */}
        <div
          style={{
            width: 120,
            height: 2,
            background: "#A0522D",
            borderRadius: 1,
            marginBottom: 32,
          }}
        />

        {/* Name */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#1A1815",
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
            color: "#A0522D",
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
            color: "#4A453D",
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
              "linear-gradient(to right, transparent, rgba(160,82,45,0.4), transparent)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
