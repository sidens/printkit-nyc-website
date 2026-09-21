import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useAvailability } from "./availability";

const payload = {
  generated: "2026-09-20T12:00:00.000Z",
  source: "calendar",
  timezone: "America/New_York",
  horizonDays: 120,
  horizonEnd: "2027-01-18",
  blocked: ["2026-09-24", "2026-10-02"],
};

const mockFetch = (impl: () => Promise<unknown>) => {
  vi.stubGlobal("fetch", vi.fn(async () => (await impl()) as Response));
};

const jsonResponse = (body: unknown, ok = true) =>
  ({ ok, json: async () => body }) as unknown as Response;

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useAvailability", () => {
  it("parses blocked dates and the horizon", async () => {
    mockFetch(async () => jsonResponse(payload));
    const { result } = renderHook(() => useAvailability());

    await waitFor(() => expect(result.current.status).toBe("ready"));
    expect(result.current.blocked).toEqual(payload.blocked);
    expect(result.current.horizonEnd).toBe("2027-01-18");
    expect(result.current.generated).toBe(payload.generated);
  });

  it("falls back to unknown when the file is missing", async () => {
    mockFetch(async () => jsonResponse(null, false));
    const { result } = renderHook(() => useAvailability());
    await waitFor(() => expect(result.current.status).toBe("unknown"));
    expect(result.current.blocked).toEqual([]);
  });

  it("falls back to unknown when the file is malformed", async () => {
    mockFetch(async () => jsonResponse({ blocked: ["not-a-date"], horizonEnd: 5 }));
    const { result } = renderHook(() => useAvailability());
    await waitFor(() => expect(result.current.status).toBe("unknown"));
  });

  it("falls back to unknown for seed data", async () => {
    mockFetch(async () => jsonResponse({ ...payload, source: "seed" }));
    const { result } = renderHook(() => useAvailability());
    await waitFor(() => expect(result.current.status).toBe("unknown"));
  });

  it("falls back to unknown when the request throws", async () => {
    mockFetch(async () => {
      throw new Error("offline");
    });
    const { result } = renderHook(() => useAvailability());
    await waitFor(() => expect(result.current.status).toBe("unknown"));
  });
});
