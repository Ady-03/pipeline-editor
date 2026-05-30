import React from "react";

const NODE_LABELS = {
  customInput: "Input",
  customOutput: "Output",
  llm: "LLM",
  text: "Text",
  api: "API",
  transform: "Transform",
  condition: "Condition",
  database: "Database",
  note: "Note",
};

const NODE_COLORS = {
  customInput: "#1a4a38",
  customOutput: "#8b1a1a",
  llm: "#b8860b",
  text: "#6b4c1a",
  api: "#1a2f4a",
  transform: "#4a1a6b",
  condition: "#6b1a1a",
  database: "#1a3a6b",
  note: "#4a4540",
};

const CX = {
  Simple: {
    bg: "rgba(26,74,56,0.08)",
    color: "#1a4a38",
    border: "rgba(26,74,56,0.2)",
  },
  Moderate: {
    bg: "rgba(184,134,11,0.08)",
    color: "#b8860b",
    border: "rgba(184,134,11,0.2)",
  },
  Complex: {
    bg: "rgba(139,26,26,0.08)",
    color: "#8b1a1a",
    border: "rgba(139,26,26,0.2)",
  },
};

function MiniGraph({ entryNodes, exitNodes, numNodes, depth }) {
  const middle = Math.max(0, numNodes - entryNodes.length - exitNodes.length);
  const layers = [
    entryNodes.length && {
      label: "Entry",
      count: entryNodes.length,
      color: "#1a4a38",
      tag: "IN",
    },
    middle > 0 && {
      label: `${middle} Inner`,
      count: middle,
      color: "#b8860b",
      tag: "●",
    },
    exitNodes.length && {
      label: "Exit",
      count: exitNodes.length,
      color: "#8b1a1a",
      tag: "OUT",
    },
  ].filter(Boolean);

  return (
    <div className="modal-section">
      <div className="modal-section-title">Pipeline Structure</div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 12,
        }}
      >
        {layers.map((layer, i) => (
          <React.Fragment key={i}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                flexShrink: 0,
              }}
            >
              {Array.from({ length: Math.min(layer.count, 3) }).map((_, j) => (
                <div
                  key={j}
                  style={{
                    width: 38,
                    height: 22,
                    borderRadius: 3,
                    background: layer.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: 8,
                    color: "rgba(247,243,236,0.9)",
                    letterSpacing: "0.06em",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                  }}
                >
                  {layer.tag}
                </div>
              ))}
              {layer.count > 3 && (
                <div
                  style={{
                    fontSize: 8,
                    color: "#a09890",
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  +{layer.count - 3} more
                </div>
              )}
              <div
                style={{
                  fontSize: 9,
                  color: "#6b6358",
                  fontFamily: "JetBrains Mono, monospace",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {layer.label}
              </div>
            </div>
            {i < layers.length - 1 && (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  minWidth: 24,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    borderTop: "1.5px dashed rgba(184,134,11,0.4)",
                  }}
                />
                <span style={{ color: "#b8860b", fontSize: 10, flexShrink: 0 }}>
                  →
                </span>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 10,
          color: "#6b6358",
          paddingTop: 10,
          borderTop: "1px solid rgba(28,24,20,0.06)",
        }}
      >
        Longest path:{" "}
        <span style={{ color: "#1c1814", fontWeight: 500 }}>
          {depth} step{depth !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}

export function ResultModal({ result, onClose }) {
  if (!result) return null;
  const {
    num_nodes,
    num_edges,
    is_dag,
    cycle_nodes = [],
    depth = 0,
    complexity = "Simple",
    node_counts = {},
    entry_nodes = [],
    exit_nodes = [],
  } = result;

  const cx = CX[complexity] || CX.Simple;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-inner">
          {/* Header */}
          <div className="modal-head">Pipeline Analysis</div>
          <div className="modal-subhead">VectorShift · Graph Report</div>

          {/* 3 stat boxes */}
          <div className="modal-stats-row">
            <div className="modal-stat">
              <div className="modal-stat-num" style={{ color: "#1a4a38" }}>
                {num_nodes}
              </div>
              <div className="modal-stat-label">Nodes</div>
            </div>
            <div className="modal-stat">
              <div className="modal-stat-num" style={{ color: "#1a2f4a" }}>
                {num_edges}
              </div>
              <div className="modal-stat-label">Edges</div>
            </div>
            <div className="modal-stat">
              <div className="modal-stat-num" style={{ color: "#b8860b" }}>
                {depth}
              </div>
              <div className="modal-stat-label">Depth</div>
            </div>
          </div>

          {/* DAG + Complexity */}
          <div className="modal-row2">
            <div className="modal-badge-card">
              <div className="modal-badge-title">DAG Validation</div>
              <span className={`dag-badge ${is_dag ? "valid" : "invalid"}`}>
                {is_dag ? "✓ Valid DAG" : "✗ Has Cycles"}
              </span>
            </div>
            <div className="modal-badge-card">
              <div className="modal-badge-title">Complexity</div>
              <span
                className="complexity-badge"
                style={{
                  background: cx.bg,
                  color: cx.color,
                  border: `1px solid ${cx.border}`,
                }}
              >
                {complexity === "Simple"
                  ? "◎"
                  : complexity === "Moderate"
                    ? "◉"
                    : "●"}{" "}
                {complexity}
              </span>
            </div>
          </div>

          {/* Mini graph */}
          <MiniGraph
            entryNodes={entry_nodes}
            exitNodes={exit_nodes}
            numNodes={num_nodes}
            depth={depth}
          />

          {/* Node breakdown */}
          {Object.keys(node_counts).length > 0 && (
            <div className="modal-section">
              <div className="modal-section-title">Node Breakdown</div>
              <div className="breakdown-chips">
                {Object.entries(node_counts).map(([type, count]) => (
                  <div key={type} className="breakdown-chip">
                    <div
                      className="chip-dot"
                      style={{ background: NODE_COLORS[type] || "#4a4540" }}
                    />
                    <span className="chip-name">
                      {NODE_LABELS[type] || type}
                    </span>
                    <span className="chip-count">×{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cycle detail */}
          {!is_dag && cycle_nodes.length > 0 && (
            <div className="cycle-section">
              <div className="cycle-title">⚠ Cycle Detected</div>
              <div className="cycle-chain">
                {cycle_nodes.map((node, i) => (
                  <React.Fragment key={i}>
                    <span className="cycle-node">{node}</span>
                    {i < cycle_nodes.length - 1 && (
                      <span className="cycle-arrow">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="cycle-msg">
                This loop will cause infinite execution. Remove one of the
                connections above to make the pipeline valid.
              </div>
            </div>
          )}

          <button className="modal-close" onClick={onClose}>
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
}
