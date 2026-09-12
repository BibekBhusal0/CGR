const LICHESS_ID = /^[A-Za-z0-9]{8}$/;
const CHESSCOM_ID = /^\d{9,}$/;

export type ParsedGameLink =
  { platform: "lichess"; id: string } | { platform: "chess.com"; id: string };

function parseLichessPath(pathname: string): string | null {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] === "game" && parts[1] === "export" && parts[2] && LICHESS_ID.test(parts[2])) {
    return parts[2];
  }
  if (
    parts.length >= 1 &&
    parts[0] &&
    LICHESS_ID.test(parts[0]) &&
    (parts.length === 1 || parts[1] === "white" || parts[1] === "black")
  ) {
    return parts[0];
  }
  return null;
}

export function parseGameLink(raw: string): ParsedGameLink | null {
  const input = raw.trim();
  if (!input) return null;

  const looksLikeUrl =
    /^[a-z][a-z0-9+.-]*:\/\//i.test(input) ||
    input.includes("lichess.org") ||
    input.includes("chess.com");
  if (looksLikeUrl) {
    let url: URL;
    try {
      url = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(input) ? input : `https://${input}`);
    } catch {
      return null;
    }
    const host = url.hostname.toLowerCase();
    if (host === "lichess.org" || host.endsWith(".lichess.org")) {
      const id = parseLichessPath(url.pathname);
      return id ? { platform: "lichess", id } : null;
    }
    if (host === "chess.com" || host.endsWith(".chess.com")) {
      const match = url.pathname.match(/(\d{7,})/);
      return match?.[1] ? { platform: "chess.com", id: match[1] } : null;
    }
    return null;
  }

  if (LICHESS_ID.test(input)) return { platform: "lichess", id: input };
  if (CHESSCOM_ID.test(input)) return { platform: "chess.com", id: input };
  return null;
}
