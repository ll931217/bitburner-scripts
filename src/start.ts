import { NS } from "@ns";

import getHackPortPrograms from "./data/hackPortPrograms";
import getServerChildren from "./data/scanAll";
import { ServerData } from "./types";

export async function main(ns: NS): Promise<void> {
    ns.tail();

    try {
        const spawns = ["purchase-hacknet.js", "purchase-server.js", "quest.js"];
        for (const spawn of spawns) {
            if (!ns.isRunning(spawn)) ns.run(spawn);
        }

        const availablePrograms: string[] = [];
        const hackPortPrograms = getHackPortPrograms(ns);

        /**
         * Recursively scan all servers adding in the server name and require ports
         */
        const scannedServers: { [hostname: string]: ServerData } = {};
        const checkServerChildren = getServerChildren(ns, scannedServers);
        checkServerChildren();

        if (!Object.keys(scannedServers).length) {
            ns.alert("No servers found!");
            ns.exit();
        }

        const topMoolaServer = {
            hostname: "joesguns",
            max: scannedServers["joesguns"].maxMoney,
            security: scannedServers["joesguns"].minSecurity,
        };

        let currentAvailablePrograms = availablePrograms.length;

        while (true) {
            for (const hack of hackPortPrograms) {
                if (
                    ns.fileExists(hack.program) &&
                    !availablePrograms.includes(hack.program)
                ) {
                    availablePrograms.push(hack.program);
                }
            }

            for (const [hostname, data] of Object.entries(scannedServers)) {
                try {
                    if (!ns.hasRootAccess(hostname)) {
                        const { requiredPorts, ranPrograms } = data;

                        for (const hack of hackPortPrograms) {
                            if (ranPrograms.includes(hack.program)) continue;

                            if (availablePrograms.includes(hack.program)) {
                                hack.fn(hostname);
                                ranPrograms.push(hack.program);
                            }
                        }

                        if (requiredPorts <= availablePrograms.length) {
                            ns.nuke(hostname);
                            data.nuked = true;
                        } else {
                            continue;
                        }
                    }

                    if (!ns.fileExists("hack.js", hostname)) ns.scp("hack.js", hostname);

                    // Don't run hack.js if it's already running
                    if (
                        ns.isRunning(
                            "hack.js",
                            hostname,
                            topMoolaServer.hostname,
                            topMoolaServer.max,
                            topMoolaServer.security,
                        )
                    ) {
                        if (currentAvailablePrograms !== availablePrograms.length) {
                            currentAvailablePrograms = availablePrograms.length;
                            ns.run("delete-hacks.js");
                            ns.scp("hack.js", hostname);
                        } else {
                            continue;
                        }
                    }

                    // Determine target
                    if (
                        ns.hasRootAccess(hostname) &&
                        ns.getServerMaxMoney(hostname) > topMoolaServer.max &&
                        ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(hostname)
                    ) {
                        const { maxMoney, minSecurity } = data;
                        topMoolaServer.hostname = hostname;
                        topMoolaServer.max = maxMoney;
                        topMoolaServer.security = minSecurity;
                    }

                    // Calculate how many hack.js script the server can handle
                    const { maxRam } = data;
                    const usedRam = ns.getServerUsedRam(hostname);
                    const hackScriptRamCost = ns.getScriptRam("hack.js", hostname);
                    const availableRam = maxRam - usedRam;
                    const threadCount = Math.floor(availableRam / hackScriptRamCost);

                    ns.print(
                        `[${hostname}] Max RAM: ${maxRam}, Used RAM: ${usedRam}, Available RAM: ${availableRam}, Threads: ${threadCount}`,
                    );

                    if (availableRam < hackScriptRamCost || threadCount < 1) {
                        continue;
                    }

                    ns.exec(
                        "hack.js",
                        hostname,
                        threadCount,
                        topMoolaServer.hostname,
                        topMoolaServer.max,
                        topMoolaServer.security,
                    );
                } catch (e) {
                    ns.tprint(e);
                }
            }

            // Prevent infinite loop issues
            await ns.sleep(6000);
        }
    } catch (e) {
        // Print error to terminal for better visibility
        ns.tprint(e);
    }
}
