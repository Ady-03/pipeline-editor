# VectorShift Pipeline Editor

A full-stack visual AI pipeline editor — build AI workflows by connecting nodes on a canvas, similar to n8n or LangChain. Built for VectorShift's internship assessment.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-orange?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)

**[Live Demo](https://pipeline-editor-lyart.vercel.app)** · **[API Docs](https://pipeline-editor-zflq.onrender.com/docs)**

---

## What it does

Drag nodes onto a canvas, connect them with edges to describe an AI workflow, then hit **Run Analysis** to validate the pipeline. The backend checks whether your pipeline is a valid **Directed Acyclic Graph (DAG)** — no circular dependencies that would make execution impossible.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React, ReactFlow, Zustand |
| Backend | Python, FastAPI |
| Deployment | Vercel (frontend), Render (backend) |

---

## Node types

**Original**
- `Input` — entry point for data
- `Output` — terminal node
- `LLM` — language model call
- `Text` — template with `{{variable}}` dynamic handles

**Custom**
- `API` — external HTTP request
- `Transform` — data transformation
- `Condition` — boolean branching
- `Database` — query a data store
- `Note` — canvas annotation (no handles)

---

## Features

- Drag and drop nodes from the toolbar onto the canvas
- Connect nodes by drawing edges between handles
- Text node auto-resizes as you type and generates input handles for every `{{variable}}` detected
- Delete nodes or edges with the `Delete` key
- Click an edge to select it → `×` button appears to remove it
- Submit pipeline to backend → modal shows node count, edge count, and DAG status
- Empty canvas watermark

---

## Project structure

```
pipeline-editor/
├── backend/
│   └── main.py          # FastAPI app, /pipelines/parse endpoint, DFS cycle detection
└── frontend/
    ├── public/
    └── src/
        ├── components/  # PipelineToolbar, result modal
        ├── nodes/        # BaseNode + 9 node type configs
        ├── App.js
        ├── store.js      # Zustand global state (nodes + edges)
        └── submit.js     # Serialises pipeline and POSTs to backend
```

---

## Running locally

**Backend**

```bash
cd backend
pip install fastapi uvicorn
python -m uvicorn main:app --reload
# runs on http://localhost:8000
```

**Frontend**

```bash
cd frontend
npm install
npm start
# runs on http://localhost:3000
```

The frontend talks to `http://localhost:8000` by default. To point it at a different backend, create `frontend/.env`:

```
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

---

## API

### `POST /pipelines/parse`

**Request**
```json
{
  "nodes": [{ "id": "1" }, { "id": "2" }],
  "edges": [{ "source": "1", "target": "2" }]
}
```

**Response**
```json
{
  "num_nodes": 2,
  "num_edges": 1,
  "is_dag": true
}
```

`is_dag` is `false` if the pipeline contains a cycle. Detection uses **Depth-First Search** — O(V + E) time, O(V) space.

---

## How the BaseNode abstraction works

Every node on the canvas is rendered by a single `BaseNode.js` component. Each node type just passes a config object:

```js
// LLMNode.js — ~15 lines
const config = {
  label: "LLM",
  color: "#534AB7",
  fields: [{ name: "model", type: "select" }, { name: "prompt", type: "textarea" }],
  handles: [{ type: "target", position: "left" }, { type: "source", position: "right" }],
};
export default () => <BaseNode config={config} />;
```

Adding a new node type never touches `BaseNode.js` — open for extension, closed for modification.

---

## Deployment notes

- Frontend deployed on **Vercel** — auto-deploys on every push to `main`
- Backend deployed on **Render** (free tier) — spins down after 15 min of inactivity; first request after sleep takes ~30s
- CORS is configured to allow requests from the Vercel domain only
