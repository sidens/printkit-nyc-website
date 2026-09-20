import { useEffect, useState } from "react";

export type Availability = {
  generated: string;
  source: string;
  timezone: string;
  horizonDays: number;
  horizonEnd: string;
  blocked: string[];
};

type AvailabilityState = {
  status: "loading" | "ready" | "unknown";
  blocked: string[];
  horizonEnd: string;
  generated: string;
};

const UNKNOWN: AvailabilityState = {
  status: "unknown",
  blocked: [],
  horizonEnd: "",
  generated: "",
};

const isYmd = (value: unknown): value is string =>
  typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);

const isAvailability = (value: unknown): value is Availability => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<Availability>;

  return (
    typeof candidate.generated === "string" &&
    typeof candidate.source === "string" &&
    typeof candidate.timezone === "string" &&
    typeof candidate.horizonDays === "number" &&
    isYmd(candidate.horizonEnd) &&
    Array.isArray(candidate.blocked) &&
    candidate.blocked.every(isYmd)
  );
};

export function useAvailability(): AvailabilityState {
  const [availability, setAvailability] = useState<AvailabilityState>({
    ...UNKNOWN,
    status: "loading",
  });

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const response = await fetch("/availability.json", { signal: controller.signal });
        if (!response.ok) throw new Error("Availability request failed");

        const payload: unknown = await response.json();
        if (!isAvailability(payload) || payload.source === "seed") {
          setAvailability(UNKNOWN);
          return;
        }

        setAvailability({
          status: "ready",
          blocked: payload.blocked,
          horizonEnd: payload.horizonEnd,
          generated: payload.generated,
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setAvailability(UNKNOWN);
      }
    };

    void load();
    return () => controller.abort();
  }, []);

  return availability;
}
