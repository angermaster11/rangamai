import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/seo";

/**
 * Default social share image, generated at build time. Individual pages fall
 * back to this when they don't supply their own `ogImage`. Uses the brand
 * gradient + wordmark so shared links look intentional, not blank.
 */
export const alt = "RANGAMAI — AI & Software Solutions";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 55%, #0e7490 140%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 34,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#a78bfa",
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 68,
            fontWeight: 700,
            lineHeight: 1.1,
            maxWidth: 900,
          }}
        >
          AI-powered software, built to ship.
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 30,
            color: "#cbd5e1",
            maxWidth: 860,
          }}
        >
          Intelligent agents, AI systems, web & mobile apps, and custom software.
        </div>
      </div>
    ),
    { ...size },
  );
}
