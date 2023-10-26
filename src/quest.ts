import { NS } from "@ns";

/**
 * Main focus of this script is to complete quests
 */
export async function main(ns: NS) {
    const hasSingularityFn = !!ns.singularity.getOwnedSourceFiles()[4];

    if (!hasSingularityFn) {
        ns.tprint("No singularity functions found");
        ns.exit();
    }

    while (true) {
        // Clear CSEC quest
        if (ns.hasRootAccess("CSEC")) {
            if (ns.singularity.connect("CSEC")) {
                await ns.singularity.installBackdoor();
                ns.singularity.joinFaction("CyberSec");
            }
        }

        if (ns.hasRootAccess("avmnite-02h")) {
            if (ns.singularity.connect("avmnite-02h")) {
                await ns.singularity.installBackdoor();
                ns.singularity.joinFaction("NiteSec");
            }
        }

        await ns.sleep(1000);
    }
}
