import { NS } from "@ns";

export async function main(ns: NS) {
    ns.print(ns.args.join(", "));

    const target: string = ns.args[0] as string;
    const moneyThresh: number = parseInt(ns.args[1] as string);
    const securityThresh: number = parseInt(ns.args[2] as string);

    while (true) {
        if (ns.getServerSecurityLevel(target) > securityThresh) {
            // If the server's security level is above our threshold, weaken it
            await ns.weaken(target);
        } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
            // If the server's money is less than our threshold, grow it
            await ns.grow(target);
        } else {
            // Otherwise, hack it
            await ns.hack(target);
        }
    }
}
