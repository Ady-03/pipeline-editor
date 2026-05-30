import React from "react";
import { BaseNode } from "./BaseNode";
import { useStore } from "../store";

export function ApiNode({ id, data, selected }) {
  const updateNodeField = useStore((s) => s.updateNodeField);
  return (
    <BaseNode
      data={{ ...data, onChange: (k, v) => updateNodeField(id, k, v) }}
      selected={selected}
      nodeType="API Request"
      icon="⇌"
      accentColor="var(--accent-cyan)"
      iconBg="rgba(56, 249, 215, 0.15)"
      fields={[
        {
          key: "url",
          label: "Endpoint URL",
          type: "text",
          placeholder: "https://api.example.com",
        },
        {
          key: "method",
          label: "Method",
          type: "select",
          options: [
            { value: "GET", label: "GET" },
            { value: "POST", label: "POST" },
            { value: "PUT", label: "PUT" },
            { value: "DELETE", label: "DELETE" },
          ],
        },
      ]}
      inputs={[{ id: "body", label: "Request Body" }]}
      outputs={[
        { id: "response", label: "Response" },
        { id: "status", label: "Status Code" },
      ]}
    />
  );
}

export function TransformNode({ id, data, selected }) {
  const updateNodeField = useStore((s) => s.updateNodeField);
  return (
    <BaseNode
      data={{ ...data, onChange: (k, v) => updateNodeField(id, k, v) }}
      selected={selected}
      nodeType="Transform"
      icon="⟳"
      accentColor="var(--accent-orange)"
      iconBg="rgba(255, 154, 68, 0.15)"
      fields={[
        {
          key: "operation",
          label: "Operation",
          type: "select",
          options: [
            { value: "json_parse", label: "JSON Parse" },
            { value: "uppercase", label: "Uppercase" },
            { value: "lowercase", label: "Lowercase" },
            { value: "trim", label: "Trim Whitespace" },
          ],
        },
      ]}
      inputs={[{ id: "input", label: "Input Data" }]}
      outputs={[{ id: "output", label: "Transformed Data" }]}
    />
  );
}

export function ConditionNode({ id, data, selected }) {
  const updateNodeField = useStore((s) => s.updateNodeField);
  return (
    <BaseNode
      data={{ ...data, onChange: (k, v) => updateNodeField(id, k, v) }}
      selected={selected}
      nodeType="Condition"
      icon="⊕"
      accentColor="var(--accent-pink)"
      iconBg="rgba(255, 110, 180, 0.15)"
      fields={[
        {
          key: "condition",
          label: "Condition",
          type: "text",
          placeholder: "value > 10",
        },
        {
          key: "operator",
          label: "Operator",
          type: "select",
          options: [
            { value: "equals", label: "Equals" },
            { value: "contains", label: "Contains" },
            { value: "greater", label: "Greater Than" },
            { value: "less", label: "Less Than" },
          ],
        },
      ]}
      inputs={[{ id: "input", label: "Input" }]}
      outputs={[
        { id: "true", label: "True" },
        { id: "false", label: "False" },
      ]}
    />
  );
}

export function DatabaseNode({ id, data, selected }) {
  const updateNodeField = useStore((s) => s.updateNodeField);
  return (
    <BaseNode
      data={{ ...data, onChange: (k, v) => updateNodeField(id, k, v) }}
      selected={selected}
      nodeType="Database"
      icon="⬡"
      accentColor="#60a5fa"
      iconBg="rgba(96, 165, 250, 0.15)"
      fields={[
        {
          key: "dbType",
          label: "Database",
          type: "select",
          options: [
            { value: "postgres", label: "PostgreSQL" },
            { value: "mysql", label: "MySQL" },
            { value: "sqlite", label: "SQLite" },
          ],
        },
        {
          key: "query",
          label: "SQL Query",
          type: "textarea",
          placeholder: "SELECT * FROM users",
          rows: 3,
        },
      ]}
      inputs={[{ id: "params", label: "Query Params" }]}
      outputs={[{ id: "rows", label: "Rows" }]}
    />
  );
}

export function NoteNode({ id, data, selected }) {
  const updateNodeField = useStore((s) => s.updateNodeField);
  return (
    <BaseNode
      data={{ ...data, onChange: (k, v) => updateNodeField(id, k, v) }}
      selected={selected}
      nodeType="Note"
      icon="✎"
      accentColor="#94a3b8"
      iconBg="rgba(148, 163, 184, 0.15)"
      fields={[
        {
          key: "note",
          label: "Content",
          type: "textarea",
          placeholder: "Add notes here...",
          rows: 4,
        },
      ]}
      inputs={[]}
      outputs={[]}
    />
  );
}
