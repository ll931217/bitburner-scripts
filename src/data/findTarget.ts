/**
 * Implement DFS in TypeScript that returns the path to a target
 * The Graph looks like this:
 * {
 *     "home": {
 *         "pserv-0": {
 *             "pserv-0-0": {...},
 *             "pserv-0-1": {...},
 *             "pserv-0-2": {...},
 *         }
 *     }
 * }
 *
 * Each key in the graph is a node
 */
interface Graph {
    [key: string]: Graph | undefined;
}

export function dfs(
    graph: Graph,
    target: string,
    path: string[] = [],
): string[] | undefined {
    for (const node in graph) {
        if (node === target) {
            path.push(node);
            return path;
        }
        if (typeof graph[node] === "object") {
            const result = dfs(graph[node] as Graph, target, [...path, node]);

            if (result) {
                return result;
            }
        }
    }

    return undefined;
}
