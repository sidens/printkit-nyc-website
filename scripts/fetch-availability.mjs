#!/usr/bin/env node
/**
 * Regenerates public/availability.json from the PrintKit NYC bookings calendar.
 *
 * Runs inside .github/workflows/deploy.yml immediately before `npm run build`, so the
 * file that ships is always generated in the same run that deploys it. Nothing is
 * committed back to the repo, which sidesteps the fact that commits made with the
 * default GITHUB_TOKEN do not trigger other workflows.
 *
 * FAILURE POLICY, and it matters more than anything else in this file:
 * any error exits non-zero and writes nothing. The workflow then stops before the
 * deploy step, and the site already live on Pages keeps serving its own copy. An
 * empty or partial write would advertise booked days as available, which is the
 * expensive direction of this bug.
 */
 
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
 
const CALENDAR_ID =
  '6882953a10f7c7e9d29c6dd4d4c1d540d438a0f51267869a8b956d59427d00fc@group.calendar.google.com';
 
const TZ = 'America/New_York';
 
// freeBusy rejects a window longer than roughly 90 days with HTTP 400 timeRangeTooLong.
// 88 leaves room without needing to chunk the request.
const HORIZON_DAYS = 88;
 
const OUT_PATH = 'public/availability.json';
 
const apiKey = process.env.GOOGLE_CALENDAR_API_KEY;
 
function fail(message, detail) {
  console.error(`availability: ${message}`);
  if (detail !== undefined) {
    console.error(typeof detail === 'string' ? detail : JSON.stringify(detail, null, 2));
  }
  process.exit(1);
}
 
const dayFmt = new Intl.DateTimeFormat('en-CA', {
  timeZone: TZ,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});
 
const timeFmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: TZ,
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});
 
/** A Date rendered as YYYY-MM-DD in America/New_York. */
const ymd = (date) => dayFmt.format(date);
 
/** True when the instant falls exactly on local midnight. */
const isLocalMidnight = (date) => timeFmt.format(date) === '00:00';
 
/**
 * Shift a YYYY-MM-DD string by whole days. Deliberately uses Date.UTC, which has no
 * DST, so the two clock changes a year cannot move a date by an hour and round wrong.
 */
function shiftDay(dateStr, delta) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d) + delta * 86_400_000).toISOString().slice(0, 10);
}
 
async function main() {
  if (!apiKey) {
    fail('GOOGLE_CALENDAR_API_KEY is not set. Add it under Settings > Secrets and variables > Actions.');
  }
 
  const now = new Date();
  const today = ymd(now);
  const utcToday = now.toISOString().slice(0, 10);
 
  const timeMin = `${utcToday}T00:00:00Z`;
  const timeMax = `${shiftDay(utcToday, HORIZON_DAYS)}T00:00:00Z`;
 
  let res;
  try {
    res = await fetch(
      `https://www.googleapis.com/calendar/v3/freeBusy?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timeMin,
          timeMax,
          timeZone: TZ,
          items: [{ id: CALENDAR_ID }],
        }),
      },
    );
  } catch (err) {
    fail('Network error calling the Calendar API', err?.message || String(err));
  }
 
  const raw = await res.text();
  if (!res.ok) fail(`Google returned HTTP ${res.status}`, raw.slice(0, 1000));
 
  let json;
  try {
    json = JSON.parse(raw);
  } catch {
    fail('Response was not JSON', raw.slice(0, 500));
  }
 
  const cal = json?.calendars?.[CALENDAR_ID];
  if (!cal) {
    fail(
      'Calendar missing from the response. Check the ID, and remember sharing changes can take up to 4 hours to propagate.',
      json,
    );
  }
  if (Array.isArray(cal.errors) && cal.errors.length) {
    fail('Google reported an error for this calendar', cal.errors);
  }
  if (!Array.isArray(cal.busy)) {
    fail('No busy array in the response', cal);
  }
 
  const blocked = new Set();
 
  for (const range of cal.busy) {
    const start = new Date(range.start);
    const end = new Date(range.end);
    if (Number.isNaN(+start) || Number.isNaN(+end)) {
      fail('Unparseable busy range', range);
    }
 
    const firstDay = ymd(start);
    let lastDay = ymd(end);
 
    // An all-day event ends at local midnight on the day AFTER the last booked day.
    // A timed event ending at 2pm genuinely occupies that day, so only pull back on
    // an exact midnight boundary.
    if (isLocalMidnight(end)) lastDay = shiftDay(lastDay, -1);
 
    for (let d = firstDay; d <= lastDay; d = shiftDay(d, 1)) blocked.add(d);
  }
 
  const dates = [...blocked].filter((d) => d >= today).sort();
 
  const payload = {
    generated: now.toISOString(),
    source: 'google-calendar-freebusy',
    timezone: TZ,
    horizonDays: HORIZON_DAYS,
    horizonEnd: shiftDay(today, HORIZON_DAYS),
    blocked: dates,
  };
 
  mkdirSync(dirname(OUT_PATH), { recursive: true });
  writeFileSync(OUT_PATH, `${JSON.stringify(payload, null, 2)}\n`);
 
  console.log(
    `availability: ${dates.length} blocked day(s) through ${payload.horizonEnd}` +
      (dates.length ? ` (${dates[0]} .. ${dates[dates.length - 1]})` : ''),
  );
}
 
main().catch((err) => fail('Unexpected failure', err?.stack || String(err)));
 
