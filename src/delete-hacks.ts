import { NS } from "@ns";

export async function main(ns: NS) {
    const scannedServers: string[] = [];

    function checkServerChildren(hostname = "home") {
        ns.scan(hostname)
            .filter((server) => !scannedServers.includes(server))
            // Scan each server
            .forEach((server) => {
                scannedServers.push(server);

                if (server !== "home" && ns.fileExists("hack.js", server)) {
                    ns.print(`[${hostname}] Removing hack.js on ${server}`);

                    ns.scriptRunning("hack.js", server) &&
                        ns.scriptKill("hack.js", server);
                    ns.rm("hack.js", server);

                    ns.print(`[${hostname}] Removed hack.js on ${server}`);
                }

                checkServerChildren(server);
            });
    }

    checkServerChildren();
}
