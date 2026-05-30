from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Tuple

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://*.vercel.app"
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Node(BaseModel):
    id: str
    type: str
    data: Dict[str, Any]

class Edge(BaseModel):
    source: str
    target: str

class Pipeline(BaseModel):
    nodes: List[Node]
    edges: List[Edge]

def find_cycle(nodes, edges):
    adj = {n.id: [] for n in nodes}
    for e in edges:
        adj[e.source].append(e.target)
    visited, rec_stack = set(), set()
    cycle_path = []

    def dfs(node, path):
        visited.add(node); rec_stack.add(node); path.append(node)
        for nb in adj.get(node, []):
            if nb not in visited:
                if not dfs(nb, path[:]): return False
            elif nb in rec_stack:
                nonlocal cycle_path
                idx = path.index(nb)
                cycle_path = path[idx:] + [nb]
                return False
        rec_stack.remove(node)
        return True

    for n in adj:
        if n not in visited:
            if not dfs(n, []): return False, cycle_path
    return True, []

def calculate_depth(nodes, edges):
    if not edges: return 1 if nodes else 0
    adj = {n.id: [] for n in nodes}
    in_deg = {n.id: 0 for n in nodes}
    for e in edges:
        adj[e.source].append(e.target)
        in_deg[e.target] += 1
    queue = [n for n in in_deg if in_deg[n] == 0]
    depth = {n: 1 for n in in_deg}
    while queue:
        node = queue.pop(0)
        for nb in adj[node]:
            depth[nb] = max(depth[nb], depth[node] + 1)
            in_deg[nb] -= 1
            if in_deg[nb] == 0: queue.append(nb)
    return max(depth.values()) if depth else 1

def complexity(num_nodes, num_edges, depth):
    score = num_nodes + num_edges * 0.5 + depth * 0.3
    if score <= 5: return "Simple"
    elif score <= 15: return "Moderate"
    return "Complex"

@app.post("/pipelines/parse")
async def parse_pipeline(pipeline: Pipeline):
    n, e = len(pipeline.nodes), len(pipeline.edges)
    is_dag, cycle_nodes = find_cycle(pipeline.nodes, pipeline.edges)
    depth = calculate_depth(pipeline.nodes, pipeline.edges) if is_dag else 0
    has_in = {ed.target for ed in pipeline.edges}
    has_out = {ed.source for ed in pipeline.edges}
    all_ids = {nd.id for nd in pipeline.nodes}
    node_counts = {}
    for nd in pipeline.nodes:
        node_counts[nd.type] = node_counts.get(nd.type, 0) + 1
    return {
        "num_nodes": n,
        "num_edges": e,
        "is_dag": is_dag,
        "cycle_nodes": cycle_nodes,
        "depth": depth,
        "complexity": complexity(n, e, depth),
        "node_counts": node_counts,
        "entry_nodes": list(all_ids - has_in),
        "exit_nodes": list(all_ids - has_out),
    }