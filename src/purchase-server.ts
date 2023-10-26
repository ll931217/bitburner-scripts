import { NS } from "@ns";

export async function main(ns: NS) {
    const ram: number = 8;

    let i = 0;

    // The limit is 25
    ns.print("Server limit: " + ns.getPurchasedServerLimit());

    while (i < ns.getPurchasedServerLimit()) {
        if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
            if (!ns.serverExists("pserv-" + i)) {
                const hostname: string = ns.purchaseServer("pserv-" + i, ram);
                if (!hostname) {
                    ns.print("Maxed out your servers");
                    ns.exit();
                }
                ns.scp("hack.js", hostname);
                ns.exec("hack.js", hostname, 3);
            }
            ++i;
        }
        await ns.sleep(1000);
    }
}
