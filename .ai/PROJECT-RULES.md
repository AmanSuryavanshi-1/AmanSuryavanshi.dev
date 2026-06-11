## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

## OmniPost Asset Sync Rule
- **CRITICAL:** Whenever a new image or video asset is added to `public/Project`, you MUST immediately update `A:\_SecondBrain\04-Knowledge\mcp-asset-index.md` to reflect the addition. Include the semantic context, asset ID, and any YouTube/Local timestamp mapping. This ensures the OmniPost AI pipeline always has access to the latest visuals.
