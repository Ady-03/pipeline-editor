import React from "react";
import { Handle, Position } from "reactflow";

export function BaseNode({
  data,
  selected,
  nodeType,
  icon,
  accentColor,
  iconBg,
  fields = [],
  inputs = [],
  outputs = [],
  extraHandles = [],
  minWidth,
  children,
}) {
  const GAP = 30;
  const allInputs = [...inputs, ...extraHandles];
  const color = accentColor || "#b8860b";

  return (
    <div
      className={`pipeline-node${selected ? " selected" : ""}`}
      style={{ minWidth: minWidth || 228 }}
    >
      <div className="node-accent" style={{ background: color }} />

      <div className="node-header">
        <div
          className="node-icon"
          style={{ background: iconBg || "rgba(184,134,11,0.1)" }}
        >
          {icon || "◈"}
        </div>
        <span className="node-title">{nodeType}</span>
      </div>

      <div className="node-body">
        {fields.map((f) => (
          <Field key={f.key} field={f} data={data} />
        ))}
        {children}
      </div>

      {/* Input handles */}
      {allInputs.map((h, i) => (
        <div
          key={h.id}
          style={{
            position: "absolute",
            left: 0,
            top: 54 + i * GAP,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Handle
            type="target"
            position={Position.Left}
            id={h.id}
            style={{
              position: "relative",
              left: -7,
              top: 0,
              transform: "none",
              background: h.style?.background || color,
              flexShrink: 0,
            }}
          />
          <span className="handle-label" style={{ marginLeft: 5 }}>
            {h.label}
          </span>
        </div>
      ))}

      {/* Output handles */}
      {outputs.map((h, i) => (
        <div
          key={h.id}
          style={{
            position: "absolute",
            right: 0,
            top: 54 + i * GAP,
            display: "flex",
            alignItems: "center",
            flexDirection: "row-reverse",
          }}
        >
          <Handle
            type="source"
            position={Position.Right}
            id={h.id}
            style={{
              position: "relative",
              right: -7,
              top: 0,
              transform: "none",
              background: h.style?.background || color,
              flexShrink: 0,
            }}
          />
          <span className="handle-label" style={{ marginRight: 5 }}>
            {h.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function Field({ field, data }) {
  const val = data?.[field.key] ?? field.defaultValue ?? "";
  const onChange = (e) => data?.onChange?.(field.key, e.target.value);

  if (field.type === "select")
    return (
      <div className="node-field">
        {field.label && <label>{field.label}</label>}
        <select value={val} onChange={onChange}>
          {(field.options || []).map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    );

  if (field.type === "textarea")
    return (
      <div className="node-field">
        {field.label && <label>{field.label}</label>}
        <textarea
          value={val}
          onChange={onChange}
          placeholder={field.placeholder}
          rows={field.rows || 3}
        />
      </div>
    );

  return (
    <div className="node-field">
      {field.label && <label>{field.label}</label>}
      <input
        type="text"
        value={val}
        onChange={onChange}
        placeholder={field.placeholder}
      />
    </div>
  );
}
