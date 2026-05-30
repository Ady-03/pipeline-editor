import React, { useRef, useCallback, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  EdgeLabelRenderer,
  BaseEdge,
  getBezierPath,
} from "reactflow";
import "reactflow/dist/style.css";

import { useStore } from "./store";
import { InputNode } from "./nodes/InputNode";
import { OutputNode } from "./nodes/OutputNode";
import { LLMNode } from "./nodes/LLMNode";
import { TextNode } from "./nodes/TextNode";
import {
  ApiNode,
  TransformNode,
  ConditionNode,
  DatabaseNode,
  NoteNode,
} from "./nodes/customNodes";
import { submitPipeline } from "./submit";
import { ResultModal } from "./components/ResultModal";

function DeletableEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
}) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const { onEdgesChange } = useStore();

  return (
    <>
      <BaseEdge
        path={edgePath}
        style={{
          stroke: selected ? "#c0392b" : "#b8860b",
          strokeWidth: selected ? 2 : 1.5,
        }}
      />
      {selected && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%,-50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
              zIndex: 10,
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdgesChange([{ id, type: "remove" }]);
              }}
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "#8b1a1a",
                border: "2px solid #f7f3ec",
                color: "white",
                fontSize: 11,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                padding: 0,
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              }}
            >
              ×
            </button>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

const edgeTypes = { default: DeletableEdge };

const nodeTypes = {
  customInput: InputNode,
  customOutput: OutputNode,
  llm: LLMNode,
  text: TextNode,
  api: ApiNode,
  transform: TransformNode,
  condition: ConditionNode,
  database: DatabaseNode,
  note: NoteNode,
};

const PALETTE = [
  {
    type: "customInput",
    label: "Input",
    color: "#1a4a38",
    defaultData: { inputName: "", inputType: "Text" },
  },
  {
    type: "customOutput",
    label: "Output",
    color: "#8b1a1a",
    defaultData: { outputName: "", outputType: "Text" },
  },
  {
    type: "llm",
    label: "LLM",
    color: "#b8860b",
    defaultData: { model: "gpt-4o", temperature: "0.7" },
  },
  { type: "text", label: "Text", color: "#6b4c1a", defaultData: { text: "" } },
  {
    type: "api",
    label: "API",
    color: "#1a2f4a",
    defaultData: { method: "GET", url: "" },
  },
  {
    type: "transform",
    label: "Transform",
    color: "#4a1a6b",
    defaultData: { operation: "json_parse" },
  },
  {
    type: "condition",
    label: "Condition",
    color: "#6b1a1a",
    defaultData: { operator: "equals" },
  },
  {
    type: "database",
    label: "Database",
    color: "#1a3a6b",
    defaultData: { dbType: "postgres" },
  },
  { type: "note", label: "Note", color: "#4a4540", defaultData: { note: "" } },
];

let counter = 1;
const genId = (t) => `${t}_${counter++}`;

export function PipelineUI() {
  const wrapper = useRef(null);
  const [rf, setRf] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode } =
    useStore();

  const onDragStart = useCallback((e, type, data) => {
    e.dataTransfer.setData("nodeType", type);
    e.dataTransfer.setData("nodeData", JSON.stringify(data));
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      const type = e.dataTransfer.getData("nodeType");
      const data = JSON.parse(e.dataTransfer.getData("nodeData") || "{}");
      if (!type || !rf) return;
      const bounds = wrapper.current.getBoundingClientRect();
      const position = rf.project({
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top,
      });
      addNode({ id: genId(type), type, position, data });
    },
    [rf, addNode],
  );

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      setResult(await submitPipeline(nodes, edges));
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* ── Toolbar ── */}
      <div className="toolbar">
        <div className="brand">
          <div className="brand-wordmark">
            Vector<em>Shift</em>
          </div>
          <div className="brand-divider" />
          <div className="brand-sub">Pipeline Editor</div>
        </div>

        <div className="toolbar-center">
          <span className="stat-pill">
            <span>{nodes.length}</span> nodes
          </span>
          <div className="stat-divider" />
          <span className="stat-pill">
            <span>{edges.length}</span> edges
          </span>
        </div>

        <div className="toolbar-right">
          {error && <span className="err-msg">⚠ {error}</span>}
          <span className="hint-text">Select + Delete to remove</span>
          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={submitting || nodes.length === 0}
          >
            <span>
              {submitting ? (
                <>
                  <span className="spin">◌</span> Analyzing
                </>
              ) : (
                "Run Analysis"
              )}
            </span>
          </button>
        </div>
      </div>

      {/* ── Palette ── */}
      <div className="palette">
        <span className="palette-label">Add Node</span>
        {PALETTE.map((n) => (
          <div
            key={n.type}
            className="palette-item"
            draggable
            onDragStart={(e) => onDragStart(e, n.type, n.defaultData)}
          >
            <div className="palette-dot" style={{ background: n.color }} />
            {n.label}
          </div>
        ))}
      </div>

      {/* ── Canvas ── */}
      <div className="canvas-wrap" ref={wrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setRf}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          deleteKeyCode="Delete"
          multiSelectionKeyCode="Shift"
          snapToGrid
          snapGrid={[10, 10]}
          defaultEdgeOptions={{ type: "default", animated: false }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={22}
            size={1}
            color="rgba(28,24,20,0.12)"
          />
          <Controls />
          <MiniMap
            nodeColor={(n) =>
              PALETTE.find((p) => p.type === n.type)?.color || "#b8860b"
            }
            maskColor="rgba(247,243,236,0.85)"
          />
        </ReactFlow>

        {/* Empty state */}
        {nodes.length === 0 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              gap: 14,
            }}
          >
            <div
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: 64,
                fontStyle: "italic",
                color: "rgba(28,24,20,0.07)",
                letterSpacing: "-0.02em",
                lineHeight: 1,
                userSelect: "none",
              }}
            >
              Pipeline
            </div>
            <div
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 10,
                color: "rgba(28,24,20,0.28)",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              Drag nodes from the palette above
            </div>
          </div>
        )}
      </div>

      {result && (
        <ResultModal result={result} onClose={() => setResult(null)} />
      )}
    </>
  );
}
