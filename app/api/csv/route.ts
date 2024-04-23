import type { NextRequest } from "next/server";

function makeCSV(csvConfig: {
  start: string;
  stop: string;
  wert?: number;
  anlage?: string;
}) {
  const { start, stop, wert, anlage } = csvConfig;

  if (!start.trim() || !stop.trim() || !anlage || !wert) {
    window.alert(
      "Startzeit, Endzeit, Anlage und Leistung müssen angegeben werden."
    );
    return "";
  }

  const t0 = new Date(start);

  const startDate = new Date(start);
  const stopDate = new Date(stop);

  t0.setMinutes(0);
  t0.setHours(0);
  t0.setSeconds(0);
  t0.setMilliseconds(0);

  const times = Array.from(
    { length: 4 * 24 },
    (_, i) => new Date(t0.getTime() + i * 15 * 60 * 1000)
  );

  const separator = ";";
  const header = `Zeit${separator}Wert`;

  const res = [
    header,
    ...times.map((t) => {
      return `${new Date(t.toUTCString()).toISOString()}${separator}${
        t <= stopDate && t >= startDate ? wert : 0
      }`;
    }),
  ].join("\n");

  return res;
}

export async function POST(request: NextRequest) {
  const payload = await request.json();

  const { start, stop, anlage, wert } = payload;

  const s = makeCSV({ start: start, stop: stop, anlage: anlage, wert: wert });

  return new Response(s, {
    status: 200,
    headers: { "Content-Type": "text/csv", "Response-Type": "blob" },
  });
}
