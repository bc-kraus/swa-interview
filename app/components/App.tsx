"use client";

import { useState, useRef } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

type TStage = "testing" | "development" | "production";

export const _getCurrentDateNicely = () => {
  const t0 = new Date();
  t0.setSeconds(0);
  return t0.toISOString().split(".")[0];
};

function App() {
  const [start, setStart] = useState(new Date().toISOString());
  const [stop, setStop] = useState(new Date().toISOString());
  const [wert, setWert] = useState<number | undefined>(undefined);
  const [anlage, setAnlage] = useState<string | undefined>(undefined);
  const [downloadURL, setDownloadURL] = useState("");
  const csvRef = useRef<null | HTMLAnchorElement>(null);

  async function _downloadFormular() {
    const r = await fetch("/api/csv", {
      method: "POST",
      body: JSON.stringify({
        start: start,
        stop: stop,
        anlage: anlage,
        wert: wert,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const blob = await r.blob();
    const url = window.URL.createObjectURL(blob);
    setDownloadURL(url);

    if (csvRef.current) {
      csvRef.current.click();
    }
  }

  return (
    <Box className="m-6">
      <h1 className="text-xl">Redispatch CSV Exporter</h1>
      <Box className="gap-6 flex">
        <TextField
          onChange={(e) => setStart(e.target.value)}
          type="datetime-local"
          defaultValue={_getCurrentDateNicely()}
        ></TextField>

        <TextField
          onChange={(e) => setStop(e.target.value)}
          type="datetime-local"
          defaultValue={_getCurrentDateNicely()}
        ></TextField>
        <TextField
          type="text"
          onChange={(e) => setAnlage(e.target.value)}
          placeholder={"Anlagen ID"}
        ></TextField>
        <TextField
          type="number"
          onChange={(e) => setWert(parseFloat(e.target.value))}
          placeholder={"Leistung in kwH"}
        ></TextField>
        <Button
          onClick={(e) => {
            if (!start.trim() || !stop.trim() || !anlage || !wert) {
              window.alert(
                "Startzeit, Endzeit, Anlage und Leistung müssen angegeben werden."
              );
              return "";
            }

            _downloadFormular();
          }}
          variant="contained"
        >
          Download CSV
        </Button>
      </Box>
      <a
        hidden={true}
        ref={csvRef}
        href={downloadURL}
        download={`${anlage}_${new Date().toISOString().split("T")[0]}.csv`}
      ></a>
    </Box>
  );
}

export default App;
