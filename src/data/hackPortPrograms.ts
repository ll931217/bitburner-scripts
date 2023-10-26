import { NS } from "@ns";

export default function(ns: NS) {
    return [
        {
            program: "BruteSSH.exe",
            fn: (hostname: string) => ns.brutessh(hostname),
        },
        {
            program: "FTPCrack.exe",
            fn: (hostname: string) => ns.ftpcrack(hostname),
        },
        {
            program: "relaySMTP.exe",
            fn: (hostname: string) => ns.relaysmtp(hostname),
        },
        {
            program: "HTTPWorm.exe",
            fn: (hostname: string) => ns.httpworm(hostname),
        },
        {
            program: "SQLInject.exe",
            fn: (hostname: string) => ns.sqlinject(hostname),
        },
    ];
}
