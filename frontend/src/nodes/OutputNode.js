import React from "react";
import { BaseNode } from "./BaseNode";
import { useStore } from "../store";

export function OutputNode({ id, data, selected }) {
  const updateNodeField = useStore((s) => s.updateNodeField);

  return (
    <BaseNode
      data={{
        ...data,
        onChange: (key, value) => updateNodeField(id, key, value),
      }}
      selected={selected}
      nodeType="Output"
      icon="⊙"
      accentColor="var(--accent-secondary)"
      iconBg="rgba(255, 101, 132, 0.18)"
      fields={[
        {
          key: "outputName",
          label: "Name",
          type: "text",
          placeholder: "output_name",
        },
        {
          key: "outputType",
          label: "Type",
          type: "select",
          options: [
            { value: "Text", label: "Text" },
            { value: "File", label: "File" },
            { value: "Image", label: "Image" },
          ],
        },
      ]}
      inputs={[{ id: "value", label: "Value" }]}
    />
  );
}
