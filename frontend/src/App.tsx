import "./App.css";

import { useState } from "react";

import TrafficPage from "./pages/TrafficPage";
import UrlPage from "./pages/UrlPage";
import ThreatPage from "./pages/ThreatPage";

export default function App() {

  const [tab, setTab] = useState("traffic");

  return (
    <div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          padding: "10px",
          borderBottom: "1px solid #334155",
        }}
      >

        <button
          onClick={() => setTab("traffic")}
        >
          Traffic
        </button>

        <button
          onClick={() => setTab("url")}
        >
          URL
        </button>

        <button
          onClick={() => setTab("threat")}
        >
          Threat
        </button>

      </div>

      {
        tab === "traffic" ? (
          <TrafficPage />
        ) : tab === "url" ? (
          <UrlPage />
        ) : (
          <ThreatPage />
        )
      }

    </div>
  );
}
