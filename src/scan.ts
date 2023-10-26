import { NS } from "@ns";

import { dfs } from "./data/findTarget";

/**
 * Recursively scan all servers constructing a network tree
 *
 * How does it work?
 * 1. Scan each server recursively
 * 2. Remove the parent hostname from the scan results
 * 3. Append each scan to an array that is the children of the parent server
 * 4. Return the children to the parent
 *
 * Example of how the result will look:
 * {
 *     "home": {
 *         "pserv-0": {
 *             "pserv-0-0": {...},
 *             "pserv-0-1": {...},
 *             "pserv-0-2": {...},
 *         }
 *     }
 * }
 */
export async function main(ns: NS): Promise<void> {
    function scan(hostname: string, parent: string): Record<string, any> {
        // Scans for a list of servers that is one hop away from hostname
        const scanResult: string[] = ns
            .scan(hostname)
            .filter((server) => server !== parent)
            .filter((server) => !server.startsWith("pserv-"));

        return {
            [hostname]: scanResult
                .map((server) => scan(server, hostname))
                .reduce((obj, item) => Object.assign(obj, item), {}),
        };
    }

    const scannedServers = scan(ns.getHostname(), "");

    if (ns.args.length > 0) {
        for (const target of ns.args) {
            if (typeof target !== "string") {
                ns.tprint(`Invalid target: ${target}`);
                continue;
            }

            const path = dfs(scannedServers, target as string);

            ns.tprint(`Path to ${target}: ${JSON.stringify(path, null, 2)}`);
        }
    } else {
        ns.tprint(`Scanned servers: ${JSON.stringify(scannedServers, null, 2)}`);
    }
}
