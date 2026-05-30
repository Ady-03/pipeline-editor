export async function submitPipeline(nodes, edges) {
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

  const response = await fetch(`${BASE_URL}/pipelines/parse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nodes, edges }),
  });

  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }

  return response.json();
}
