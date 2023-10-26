import { NS } from "@ns";

import { dfs } from "./data/findTarget";

export async function main(ns: NS): Promise<void> {
    const hasSingularityFn = !!ns.singularity.getOwnedSourceFiles()[4];

    if (!hasSingularityFn) {
        ns.tprint("No singularity functions found");
        ns.exit();
    }

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

    const target: string = ns.args[0] as string;

    const path = dfs(scannedServers, target);

    if (!path) {
        ns.tprint(`No path to ${target}`);
    }

    for (const server of path as string[]) {
        ns.singularity.connect(server);
    }
}
