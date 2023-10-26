import { NS } from "@ns";

// TODO: Make script run for each hacknet node concurrently
export async function main(ns: NS) {
    const maxCore: number[] = [];
    const maxRam: number[] = [];
    const maxLevel: number[] = [];

    const maxNodes = ns.hacknet.maxNumNodes();

    ns.tprint(`Max Nodes: ${maxNodes}`);

    while (
        ns.hacknet.numNodes() <= maxNodes ||
        (maxCore.length < maxNodes &&
            maxRam.length < maxNodes &&
            maxLevel.length < maxNodes)
    ) {
        /**
         * 1. Purchase a new node if have enough money
         * 2. If node core, level, and ram is not max then upgrade. Max returned cost would be Infinity.
         * 3. If maxNumNodes have been reached make sure that
         */

        if (
            ns.hacknet.numNodes() < ns.hacknet.maxNumNodes() &&
            ns.getServerMoneyAvailable("home") >= ns.hacknet.getPurchaseNodeCost()
        ) {
            ns.hacknet.purchaseNode();
        }

        let currentNode = 0;

        while (currentNode < ns.hacknet.numNodes()) {
            const moneyAvailable = ns.getServerMoneyAvailable("home");

            if (
                moneyAvailable >= ns.hacknet.getCoreUpgradeCost(currentNode) &&
                !maxCore.includes(currentNode)
            ) {
                if (!ns.hacknet.upgradeCore(currentNode)) {
                    maxCore.push(currentNode);
                }
            } else if (
                moneyAvailable >= ns.hacknet.getRamUpgradeCost(currentNode) &&
                !maxRam.includes(currentNode)
            ) {
                if (!ns.hacknet.upgradeRam(currentNode)) {
                    maxRam.push(currentNode);
                }
            } else if (
                moneyAvailable >= ns.hacknet.getLevelUpgradeCost(currentNode) &&
                !maxLevel.includes(currentNode)
            ) {
                if (!ns.hacknet.upgradeLevel(currentNode)) {
                    maxLevel.push(currentNode);
                }
            }
            currentNode++;
        }

        await ns.sleep(1000);
    }
}
