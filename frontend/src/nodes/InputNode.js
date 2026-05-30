import React from "react";
import { BaseNode } from "./BaseNode";
import { useStore } from "../store";

export function InputNode({ id, data, selected }) {
  const updateNodeField = useStore((s) => s.updateNodeField);

  return (
    <BaseNode
      data={{
        ...data,
        onChange: (key, value) => updateNodeField(id, key, value),
      }}
      selected={selected}
      nodeType="Input"
      icon="→"
      accentColor="var(--accent-green)"
      iconBg="rgba(67, 233, 123, 0.18)"
      fields={[
        {
          key: "inputName",
          label: "Name",
          type: "text",
          placeholder: "input_name",
        },
        {
          key: "inputType",
          label: "Type",
          type: "select",
          options: [
            { value: "Text", label: "Text" },
            { value: "File", label: "File" },
            { value: "Image", label: "Image" },
          ],
        },
      ]}
      outputs={[{ id: "value", label: "Value" }]}
    />
  );
}
