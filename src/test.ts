import { NS } from "@ns";

/**
 * Tests netscript functions
 */
export async function main(ns: NS) {
    ns.tprint(`Arguments: ${JSON.stringify(ns.args, null, 2)}`);

    // const player = ns.getPlayer();
    // const resetInfo = ns.getResetInfo();
    // const sourceFiles = ns.singularity.getOwnedSourceFiles();
    //
    // ns.tprint(`Player: ${JSON.stringify(player, null, 2)}`);
    // ns.tprint(`Reset Info: ${JSON.stringify(resetInfo, null, 2)}`);
    // ns.tprint(`Source Files: ${JSON.stringify(sourceFiles, null, 2)}`);
    //
    // ns.tprint(`Has singularity functions: ${!!sourceFiles[4]}`);
}
