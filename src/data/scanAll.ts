import { NS } from "@ns";

export default function(ns: NS, scannedServers: any) {
    return function checkServerChildren(hostname = "home") {
        ns.scan(hostname)
            // Remove all scanned servers
            .filter((server) => !Object.keys(scannedServers).includes(server))
            // Scan each server
            .forEach((server) => {
                if (server !== "home") {
                    scannedServers[server] = {
                        requiredPorts: ns.getServerNumPortsRequired(server),
                        maxRam: ns.getServerMaxRam(server),
                        maxMoney: ns.getServerMaxMoney(server),
                        minSecurity: ns.getServerMinSecurityLevel(server),
                        nuked: ns.hasRootAccess(server),
                        ranPrograms: [],
                    };

                    // Clean all servers first before we start
                    ns.scriptRunning("hack.js", server) &&
                        ns.scriptKill("hack.js", server);
                }

                checkServerChildren(server);
            });
    };
}
