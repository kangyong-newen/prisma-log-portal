import React, { useEffect, useState } from "react";

interface LogEntry {
  time_generated?: number;

  action?: string;
  severity?: string;

  threat_name?: string;
  threat_id?: string;
  threat_category?: string;

  rule_matched?: string;

  from_zone?: string;
  to_zone?: string;

  source_ip?: string;
  dest_ip?: string;
  dest_port?: number;

  source_user?: string;

  app?: string;

  direction_of_attack?: string;

  file_name?: string;
  file_type?: string;

  verdict?: string;

  url_domain?: string;
}

const formatTime = (timestamp?: number) => {
  if (!timestamp) return "-";

  return new Date(
    timestamp / 1000
  ).toLocaleString("ko-KR");
};

export default function ThreatPage() {

  const [logs, setLogs] =
    useState<LogEntry[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [expandedRow, setExpandedRow] =
    useState<number | null>(null);

  const [lastUpdated, setLastUpdated] =
    useState("-");

  const [action, setAction] =
    useState("");

  const [severity, setSeverity] =
    useState("");

  const [threatName, setThreatName] =
    useState("");

  const [ruleFilter, setRuleFilter] =
    useState("");

  const [sourceIp, setSourceIp] =
    useState("");

  const [destIp, setDestIp] =
    useState("");

  const [destPort, setDestPort] =
    useState("");

  const [userFilter, setUserFilter] =
    useState("");

  const [appFilter, setAppFilter] =
    useState("");

  const [directionFilter, setDirectionFilter] =
    useState("");

  const [fileNameFilter, setFileNameFilter] =
    useState("");

  const [fileTypeFilter, setFileTypeFilter] =
    useState("");

  const [verdictFilter, setVerdictFilter] =
    useState("");

  const [urlDomainFilter, setUrlDomainFilter] =
    useState("");

  const [limit, setLimit] =
    useState(50);

  const [timeRange, setTimeRange] =
    useState("60m");

  const loadLogs = async () => {

    setLoading(true);

    try {

      const response =
        await fetch(
          `/api/logs/threat?` +
          `action=${action}` +
          `&severity=${severity}` +
          `&threat_name=${encodeURIComponent(threatName)}` +
          `&rule=${encodeURIComponent(ruleFilter)}` +
          `&source_ip=${encodeURIComponent(sourceIp)}` +
          `&dest_ip=${encodeURIComponent(destIp)}` +
          `&dest_port=${encodeURIComponent(destPort)}` +
          `&user=${encodeURIComponent(userFilter)}` +
          `&app=${encodeURIComponent(appFilter)}` +
          `&direction_of_attack=${encodeURIComponent(directionFilter)}` +
          `&file_name=${encodeURIComponent(fileNameFilter)}` +
          `&file_type=${encodeURIComponent(fileTypeFilter)}` +
          `&verdict=${encodeURIComponent(verdictFilter)}` +
          `&url_domain=${encodeURIComponent(urlDomainFilter)}` +
          `&limit=${limit}` +
          `&time_range=${timeRange}`
        );

      const data =
        await response.json();

      setLogs(
        data.logs || []
      );

      setLastUpdated(
        new Date().toLocaleString("ko-KR")
      );

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    loadLogs();

    const timer =
      setInterval(
        loadLogs,
        300000
      );

    return () =>
      clearInterval(timer);

  }, [
    action,
    severity,
    threatName,
    ruleFilter,
    sourceIp,
    destIp,
    destPort,
    userFilter,
    appFilter,
    directionFilter,
    fileNameFilter,
    fileTypeFilter,
    verdictFilter,
    urlDomainFilter,
    limit,
    timeRange,
  ]);

  return (

    <div
      style={{
        padding: "20px",
        color: "#e5e7eb",
      }}
    >

      <h1>
        Prisma Threat Logs
      </h1>

      <div
        style={{
          marginBottom: "15px",
          color: "#94a3b8",
        }}
      >
        Last Updated : {lastUpdated}
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >

        <select
          value={action}
          onChange={(e) =>
            setAction(
              e.target.value
            )
          }
        >
          <option value="">
            ALL Action
          </option>

          <option value="alert">
            ALERT
          </option>

          <option value="deny">
            DENY
          </option>

          <option value="reset-both">
            RESET-BOTH
          </option>

          <option value="reset-client">
            RESET-CLIENT
          </option>

          <option value="reset-server">
            RESET-SERVER
          </option>

          <option value="sinkhole">
            SINKHOLE
          </option>
        </select>

        <select
          value={severity}
          onChange={(e) =>
            setSeverity(
              e.target.value
            )
          }
        >
          <option value="">
            ALL Severity
          </option>

          <option value="Critical">
            Critical
          </option>

          <option value="High">
            High
          </option>

          <option value="Medium">
            Medium
          </option>

          <option value="Low">
            Low
          </option>
        </select>

        <select
          value={limit}
          onChange={(e) =>
            setLimit(
              Number(
                e.target.value
              )
            )
          }
        >
          <option value={10}>
            10 Rows
          </option>

          <option value={50}>
            50 Rows
          </option>

          <option value={100}>
            100 Rows
          </option>

          <option value={500}>
            500 Rows
          </option>
        </select>

        <select
          value={timeRange}
          onChange={(e) =>
            setTimeRange(
              e.target.value
            )
          }
        >
          <option value="5m">
            Last 5 Minutes
          </option>

          <option value="60m">
            Last 60 Minutes
          </option>

          <option value="24h">
            Last 24 Hours
          </option>

          <option value="7d">
            Last 7 Days
          </option>
        </select>

        <input
          placeholder="Threat Name"
          value={threatName}
          onChange={(e) =>
            setThreatName(
              e.target.value
            )
          }
        />

        <input
          placeholder="Source IP"
          value={sourceIp}
          onChange={(e) =>
            setSourceIp(
              e.target.value
            )
          }
        />

        <input
          placeholder="Destination IP"
          value={destIp}
          onChange={(e) =>
            setDestIp(
              e.target.value
            )
          }
        />

        <input
          placeholder="User"
          value={userFilter}
          onChange={(e) =>
            setUserFilter(
              e.target.value
            )
          }
        />

        <input
          placeholder="Application"
          value={appFilter}
          onChange={(e) =>
            setAppFilter(
              e.target.value
            )
          }
        />

        <input
          placeholder="URL Domain"
          value={urlDomainFilter}
          onChange={(e) =>
            setUrlDomainFilter(
              e.target.value
            )
          }
        />

        <button
          onClick={loadLogs}
        >
          Search
        </button>

      </div>

      {loading && (
        <div>
          Updating logs...
        </div>
      )}

      <div
        style={{
          overflowX: "auto",
        }}
      >

        <table
          style={{
            width: "100%",
            borderCollapse:
              "collapse",
          }}
        >
          <thead>

            <tr>
              <th>Time</th>
              <th>Action</th>
              <th>Severity</th>
              <th>Threat Name</th>
              <th>Rule</th>

              <th>From Zone</th>
              <th>Source IP</th>

              <th>To Zone</th>
              <th>Destination IP</th>
              <th>Destination Port</th>

              <th>User</th>
              <th>Application</th>

              <th>Direction</th>

              <th>File Name</th>
              <th>File Type</th>

              <th>Verdict</th>

              <th>URL Domain</th>
            </tr>

          </thead>

          <tbody>

            {logs.map(
              (log, idx) => (

                <React.Fragment
                  key={idx}
                >

                  <tr
                    onClick={() =>
                      setExpandedRow(
                        expandedRow === idx
                          ? null
                          : idx
                      )
                    }
                  >

                    <td>
                      {formatTime(
                        log.time_generated
                      )}
                    </td>

		    <td>
  <span
    style={{
      background:
        log.action === "sinkhole"
          ? "#dc2626"
        : log.action === "reset-both"
          ? "#dc2626"
        : log.action === "reset-client"
          ? "#ea580c"
        : log.action === "reset-server"
          ? "#ea580c"
        : log.action === "deny"
          ? "#dc2626"
        : "#f59e0b",

      color: "white",
      padding: "3px 8px",
      borderRadius: "6px",
      fontWeight: "bold",
      fontSize: "12px",
    }}
  >
    {(log.action || "").toUpperCase()}
  </span>
</td>

		    <td>
  <span
    style={{
      background:
        log.severity === "Critical"
          ? "#dc2626"
        : log.severity === "High"
          ? "#ea580c"
        : log.severity === "Medium"
          ? "#f59e0b"
        : "#16a34a",

      color: "white",
      padding: "3px 8px",
      borderRadius: "6px",
      fontWeight: "bold",
      fontSize: "12px",
    }}
  >
    {log.severity}
  </span>
</td>

                    <td>
                      {log.threat_name}
                    </td>

                    <td>
                      {log.rule_matched}
                    </td>

                    <td>
                      {log.from_zone}
                    </td>

                    <td>
                      {log.source_ip}
                    </td>

                    <td>
                      {log.to_zone}
                    </td>

                    <td>
                      {log.dest_ip}
                    </td>

                    <td>
                      {log.dest_port}
                    </td>

                    <td>
                      {log.source_user}
                    </td>

                    <td>
                      {log.app}
                    </td>

                    <td>
                      {log.direction_of_attack}
                    </td>

                    <td>
                      {log.file_name}
                    </td>

                    <td>
                      {log.file_type}
                    </td>

                    <td>
                      {log.verdict}
                    </td>

                    <td>
                      {log.url_domain}
                    </td>

                  </tr>
		{expandedRow === idx && (

<tr>

<td colSpan={17}>

  <div
    style={{
      background: "#ffffff",
      color: "#111827",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "20px",
      margin: "10px 0",
    }}
  >

    <h3>
      Threat Detail
    </h3>

    <table
      style={{
        width: "100%"
      }}
    >
      <tbody>

        <tr>
          <td><b>Time</b></td>
          <td>
            {formatTime(
              log.time_generated
            )}
          </td>

          <td><b>Action</b></td>
          <td>{log.action}</td>
        </tr>

        <tr>
          <td>
            <b>Threat Name</b>
          </td>
          <td>
            {log.threat_name}
          </td>

          <td>
            <b>Threat ID</b>
          </td>
          <td>
            {log.threat_id}
          </td>
        </tr>

        <tr>
          <td>
            <b>Severity</b>
          </td>
          <td>
            {log.severity}
          </td>

          <td>
            <b>Threat Category</b>
          </td>
          <td>
            {log.threat_category}
          </td>
        </tr>

        <tr>
          <td>
            <b>Rule</b>
          </td>
          <td>
            {log.rule_matched}
          </td>

          <td>
            <b>Direction</b>
          </td>
          <td>
            {log.direction_of_attack}
          </td>
        </tr>

        <tr>
          <td>
            <b>Source IP</b>
          </td>
          <td>
            {log.source_ip}
          </td>

          <td>
            <b>Destination IP</b>
          </td>
          <td>
            {log.dest_ip}
          </td>
        </tr>

        <tr>
          <td>
            <b>User</b>
          </td>
          <td>
            {log.source_user}
          </td>

          <td>
            <b>Application</b>
          </td>
          <td>
            {log.app}
          </td>
        </tr>

        <tr>
          <td>
            <b>Verdict</b>
          </td>
          <td>
            {log.verdict}
          </td>

          <td>
            <b>URL Domain</b>
          </td>
          <td>
            {log.url_domain}
          </td>
        </tr>

      </tbody>

    </table>

  </div>

</td>

</tr>

)}
                </React.Fragment>
		
              )
            )}

          </tbody>

        </table>

      </div>

    </div>

  );
}
