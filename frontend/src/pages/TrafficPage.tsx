import React, { useEffect, useState } from "react";

interface LogEntry {
  time_generated?: number;

  source_ip?: string;
  source_location?: string;
  users?: string;
  from_zone?: string;

  dest_ip?: string;
  dest_port?: number;
  to_zone?: string;

  protocol?: string;
  app?: string;
  url_category?: string;
  outbound_if?: string;

  action?: string;
  action_source?: string;

  rule_matched?: string;
  sub_type?: string;
  session_end_reason?: string;

  bytes_total?: number;
  bytes_received?: number;
  bytes_sent?: number;

  packets_total?: number;
  packets_received?: number;
  packets_sent?: number;
}

const formatTime = (timestamp?: number) => {
  if (!timestamp) return "-";

  return new Date(timestamp / 1000).toLocaleString("ko-KR");
};

const formatBytes = (bytes?: number) => {
  if (!bytes) return "0 B";

  if (bytes >= 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  }

  if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  }

  return `${bytes} B`;
};

const countryFlag = (code?: string) => {
  const flags: Record<string, string> = {
    US: "🇺🇸",
    GB: "🇬🇧",
    IT: "🇮🇹",
    KR: "🇰🇷",
    JP: "🇯🇵",
    CN: "🇨🇳",
    HK: "🇭🇰",
  };

  return `${flags[code || ""] || "🌍"} ${code || ""}`;
};

function App() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const [action, setAction] = useState("");
  const [limit, setLimit] = useState(50);
  const [timeRange, setTimeRange] = useState("60m");
  const [searchIp, setSearchIp] = useState("");
  const [destIp, setDestIp] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [ruleFilter, setRuleFilter] = useState("");
  const [reasonFilter, setReasonFilter] = useState("");
  const [destPortFilter, setDestPortFilter] = useState("");
  const [appFilter, setAppFilter] = useState("");
  const [expandedRow, setExpandedRow] =
    useState<number | null>(null);

  const [lastUpdated, setLastUpdated] =
    useState("-");

  const loadLogs = async () => {
    setLoading(true);

    try {
	const response = await fetch(
  	`/api/logs/traffic?` +
  	`action=${action}` +
        `&limit=${limit}` +
	`&time_range=${timeRange}` +
  	`&source_ip=${encodeURIComponent(searchIp)}` +
  	`&dest_ip=${encodeURIComponent(destIp)}` +
  	`&user=${encodeURIComponent(userFilter)}` +
  	`&rule=${encodeURIComponent(ruleFilter)}` +
  	`&reason=${encodeURIComponent(reasonFilter)}` +
	`&dest_port=${encodeURIComponent(destPortFilter)}` +
	`&app=${encodeURIComponent(appFilter)}`
);

      const data = await response.json();

      setLogs(data.logs || []);

      setLastUpdated(
        new Date().toLocaleString("ko-KR")
      );
    } catch (error) {
      console.error("Failed to load logs:", error);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {

  loadLogs();

  const timer = setInterval(() => {
    loadLogs();
  }, 300000);

  return () => clearInterval(timer);

}, []);



  const filteredLogs = logs.filter((log) =>
    log.source_ip?.includes(searchIp)
  );

  return (
  <div
    style={{
      padding: "20px",
      color: "#e5e7eb"
    }}
  >
      <h1>Prisma Access Traffic Logs</h1>

      <div
        style={{
          marginBottom: "15px",
          color: "#666",
        }}
      >
        Last Updated : {lastUpdated}
      </div>

<div
  style={{
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    alignItems: "center",
    flexWrap: "wrap",
  }}
>
  <select
    value={action}
    onChange={(e) => setAction(e.target.value)}
  >
    <option value="">ALL</option>
    <option value="deny">DENY</option>
    <option value="allow">ALLOW</option>
    <option value="drop">DROP</option>
  </select>

  <select
    value={limit}
    onChange={(e) =>
      setLimit(Number(e.target.value))
    }
  >
    <option value={10}>10 Rows</option>
    <option value={50}>50 Rows</option>
    <option value={100}>100 Rows</option>
    <option value={500}>500 Rows</option>
  </select>

  <select
  value={timeRange}
  onChange={(e) =>
    setTimeRange(e.target.value)
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
    type="text"
    placeholder="Source IP"
    value={searchIp}
    onChange={(e) => setSearchIp(e.target.value)}
    style={{ padding: "6px" }}
  />

  <input
    type="text"
    placeholder="Destination IP"
    value={destIp}
    onChange={(e) => setDestIp(e.target.value)}
    style={{ padding: "6px" }}
  />

  <input
  type="text"
  placeholder="Destination Port"
  value={destPortFilter}
  onChange={(e) =>
    setDestPortFilter(e.target.value)
  }
  style={{ padding: "6px" }}
/>

<input
  type="text"
  placeholder="Application"
  value={appFilter}
  onChange={(e) =>
    setAppFilter(e.target.value)
  }
  style={{ padding: "6px" }}
/>

  <input
    type="text"
    placeholder="User"
    value={userFilter}
    onChange={(e) => setUserFilter(e.target.value)}
    style={{ padding: "6px" }}
  />

  <input
    type="text"
    placeholder="Rule"
    value={ruleFilter}
    onChange={(e) => setRuleFilter(e.target.value)}
    style={{ padding: "6px" }}
  />

  <input
    type="text"
    placeholder="Session Reason"
    value={reasonFilter}
    onChange={(e) => setReasonFilter(e.target.value)}
    style={{ padding: "6px" }}
  />

  <button onClick={loadLogs}>
    Search
  </button>
</div>

      {loading && (
        <div
          style={{
            marginBottom: "10px",
            color: "#888",
          }}
        >
          Updating logs...
        </div>
      )}

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th>Time</th>
              <th>Source IP</th>
              <th>Country</th>
              <th>User</th>
              <th>Destination IP</th>
	      <th>Destination Port</th>
              <th>App</th>
	      <th>Outbound IF</th>
              <th>Action</th>
              <th>Rule</th>
              <th>Bytes</th>
              <th>Reason</th>
            </tr>
          </thead>

          <tbody>
            {filteredLogs.map((log, idx) => (
              <React.Fragment key={idx}>
                <tr
                  onClick={() =>
                    setExpandedRow(
                      expandedRow === idx
                        ? null
                        : idx
                    )
                  }
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <td>{formatTime(log.time_generated)}</td>
                  <td>{log.source_ip}</td>
                  <td>
                    {countryFlag(
                      log.source_location
                    )}
                  </td>
                  <td>{log.users}</td>
                  <td>{log.dest_ip}</td>
		  <td>{log.dest_port}</td>
                  <td>{log.app}</td>
		  <td>{log.outbound_if}</td>

                  <td>
		   <span
  style={{
    background:
      log.action === "allow"
        ? "#16a34a"
        : log.action === "deny"
        ? "#dc2626"
        : log.action === "drop"
        ? "#dc2626"
        : "#6b7280",

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

                  <td>{log.rule_matched}</td>

                  <td>
                    {formatBytes(
                      log.bytes_total
                    )}
                  </td>

                  <td>
                    {log.session_end_reason}
                  </td>
                </tr>

                {expandedRow === idx && (
                  <tr>
                    <td colSpan={10}>
                      <div
                        style={{
                          background:
                            "#ffffff",
			  color: "#111827",
                          border:
                            "1px solid #e5e7eb",
                          borderRadius:
                            "12px",
                          boxShadow:
                            "0 1px 3px rgba(0,0,0,0.08)",
                          padding:
                            "20px",
                          margin:
                            "10px 0",
                        }}
                      >
                        <h3>
                          Session Details
                        </h3>

                        <table
                          style={{
                            width:
                              "100%",
			    color: "#111827",
                          }}
                        >
                          <tbody>
                            <tr>
                              <td>
                                <b>Time</b>
                              </td>
                              <td>
                                {formatTime(
                                  log.time_generated
                                )}
                              </td>

                              <td>
                                <b>Action</b>
                              </td>
                              <td>
                                {log.action}
                              </td>
                            </tr>

                            <tr>
                              <td>
                                <b>Rule</b>
                              </td>
                              <td>
                                {
                                  log.rule_matched
                                }
                              </td>

                              <td>
                                <b>Action Source</b>
                              </td>
                              <td>
                                {
                                  log.action_source
                                }
                              </td>
                            </tr>

                            <tr>
                              <td>
                                <b>Sub Type</b>
                              </td>
                              <td>
                                {log.sub_type}
                              </td>

                              <td>
                                <b>Session Reason</b>
                              </td>
                              <td>
                                {
                                  log.session_end_reason
                                }
                              </td>
                            </tr>

                            <tr>
                              <td>
                                <b>Source IP</b>
                              </td>
                              <td>
                                {
                                  log.source_ip
                                }
                              </td>

                              <td>
                                <b>Source Country</b>
                              </td>
                              <td>
                                {
                                  log.source_location
                                }
                              </td>
                            </tr>

                            <tr>
                              <td>
                                <b>User</b>
                              </td>
                              <td>
                                {log.users}
                              </td>

                              <td>
                                <b>From Zone</b>
                              </td>
                              <td>
                                {
                                  log.from_zone
                                }
                              </td>
                            </tr>

			    <tr>
  <td>
    <b>Destination IP</b>
  </td>
  <td>
    {log.dest_ip}
  </td>

  <td>
    <b>Destination Port</b>
  </td>
  <td>
    {log.dest_port || "-"}
  </td>
</tr>

<tr>
  <td>
    <b>Outbound Interface</b>
  </td>
  <td>
    {log.outbound_if || "-"}
  </td>

  <td>
    <b>To Zone</b>
  </td>
  <td>
    {log.to_zone}
  </td>
</tr>
                            <tr>
                              <td>
                                <b>Protocol</b>
                              </td>
                              <td>
                                {log.protocol}
                              </td>

                              <td>
                                <b>Application</b>
                              </td>
                              <td>{log.app}</td>
                            </tr>

                            <tr>
                              <td>
                                <b>URL Category</b>
                              </td>
                              <td>
                                {
                                  log.url_category
                                }
                              </td>

                              <td>
                                <b>Total Bytes</b>
                              </td>
                              <td>
                                {formatBytes(
                                  log.bytes_total
                                )}
                              </td>
                            </tr>

                            <tr>
                              <td>
                                <b>Bytes Sent</b>
                              </td>
                              <td>
                                {formatBytes(
                                  log.bytes_sent
                                )}
                              </td>

                              <td>
                                <b>Bytes Received</b>
                              </td>
                              <td>
                                {formatBytes(
                                  log.bytes_received
                                )}
                              </td>
                            </tr>

                            <tr>
                              <td>
                                <b>Total Packets</b>
                              </td>
                              <td>
                                {
                                  log.packets_total
                                }
                              </td>

                              <td>
                                <b>Packets Sent</b>
                              </td>
                              <td>
                                {
                                  log.packets_sent
                                }
                              </td>
                            </tr>

                            <tr>
                              <td>
                                <b>Packets Received</b>
                              </td>
                              <td>
                                {
                                  log.packets_received
                                }
                              </td>

                              <td></td>
                              <td></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
