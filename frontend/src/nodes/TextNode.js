import React, { useMemo, useRef, useEffect } from "react";
import { BaseNode } from "./BaseNode";
import { useStore } from "../store";

function extractVariables(text = "") {
  const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
  const vars = new Set();
  let match;
  while ((match = regex.exec(text)) !== null) {
    vars.add(match[1]);
  }
  return Array.from(vars);
}

export function TextNode({ id, data, selected }) {
  const updateNodeField = useStore((s) => s.updateNodeField);
  const textareaRef = useRef(null);
  const text = data?.text || "";

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight, 60)}px`;
  }, [text]);

  const variables = useMemo(() => extractVariables(text), [text]);
  const extraHandles = variables.map((v) => ({
    id: `var-${v}`,
    label: v,
    style: { background: "var(--accent-amber)" },
  }));

  const longestLine = text
    .split("\n")
    .reduce((max, line) => Math.max(max, line.length), 0);
  const dynamicWidth = Math.min(Math.max(220, longestLine * 7.5 + 40), 520);

  return (
    <BaseNode
      data={{
        ...data,
        onChange: (key, value) => updateNodeField(id, key, value),
      }}
      selected={selected}
      nodeType="Text"
      icon="T"
      accentColor="var(--accent-amber)"
      iconBg="rgba(246, 211, 101, 0.18)"
      outputs={[{ id: "output", label: "Output" }]}
      extraHandles={extraHandles}
      minWidth={dynamicWidth}
    >
      <div className="node-field">
        <label>Text</label>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => updateNodeField(id, "text", e.target.value)}
          placeholder="Enter text... use {{variable}} to create inputs"
          style={{
            minHeight: 60,
            resize: "none",
            overflow: "hidden",
            width: "100%",
          }}
        />
      </div>
      {variables.length > 0 && (
        <div style={{ fontSize: 9, color: "gray", textTransform: "uppercase" }}>
          Variables: {variables.join(", ")}
        </div>
      )}
    </BaseNode>
  );
}
