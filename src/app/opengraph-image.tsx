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
          background: "#F6F2E9",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 96px",
          fontFamily: "serif",
          position: "relative",
        }}
      >
        {/* Top-left smallcaps label */}
        <div
          style={{
            fontSize: 14,
            color: "#5C564C",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          Portfolio
        </div>

        {/* Hero name + body, left-flush */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 500,
              color: "#14110D",
              letterSpacing: "-0.03em",
              lineHeight: 1.0,
              display: "flex",
              flexWrap: "wrap",
              gap: "0.25em",
            }}
          >
            <span>Prakhar</span>
            <span style={{ fontStyle: "italic" }}>Kothari</span>
          </div>

          <div
            style={{
              marginTop: 28,
              fontSize: 28,
              fontStyle: "italic",
              color: "#2E2A24",
              lineHeight: 1.4,
              maxWidth: 720,
              letterSpacing: "-0.005em",
            }}
          >
            Building AI products end-to-end. Kellogg + McCormick, 2026.
          </div>
        </div>

        {/* Bottom row: location + URL on left, clay square on right */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{
                fontSize: 13,
                color: "#5C564C",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              Evanston · IL
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#5C564C",
                letterSpacing: "0.06em",
                fontWeight: 500,
              }}
            >
              prakharkothari.com
            </div>
          </div>

          {/* Single small clay square */}
          <div
            style={{
              width: 10,
              height: 10,
              background: "#A0522D",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
