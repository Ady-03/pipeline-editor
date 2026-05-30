import React from "react";
import { BaseNode } from "./BaseNode";
import { useStore } from "../store";

export function LLMNode({ id, data, selected }) {
  const updateNodeField = useStore((s) => s.updateNodeField);

  return (
    <BaseNode
      data={{
        ...data,
        onChange: (key, value) => updateNodeField(id, key, value),
      }}
      selected={selected}
      nodeType="LLM"
      icon="✦"
      accentColor="var(--accent-primary)"
      iconBg="rgba(108, 99, 255, 0.18)"
      fields={[
        {
          key: "model",
          label: "Model",
          type: "select",
          options: [
            { value: "gpt-4o", label: "GPT-4o" },
            { value: "gpt-4o-mini", label: "GPT-4o mini" },
            { value: "claude-sonnet-4", label: "Claude Sonnet 4" },
            { value: "gemini-2.0", label: "Gemini 2.0" },
          ],
        },
        {
          key: "temperature",
          label: "Temperature",
          type: "text",
          placeholder: "0.7",
        },
      ]}
      inputs={[
        { id: "system", label: "System Prompt" },
        { id: "prompt", label: "User Prompt" },
      ]}
      outputs={[{ id: "response", label: "Response" }]}
    />
  );
}
