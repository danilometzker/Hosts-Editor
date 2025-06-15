import type { HostRecord } from "@/types/hosts";

const parseHosts = (content: string): HostRecord[] => {
    // Remove caracteres invisíveis (e.g., \r)
    const normalizedContent = content.replace(/\r/g, "");
    const lines = normalizedContent.split("\n");
    const parsed = [];

    const regex = /^\s*(#)?\s*([\d.:]+)?\s*(.*)$/;

    for (const line of lines) {
        const match = line.match(regex);
        if (match) {
            const hasComment = !!match[1];
            const ip = match[2]?.trim() || null;
            const domains = match[3]?.trim().split(/\s+/).filter(Boolean) || [];
            parsed.push({
                checked: false,
                ip: ip || "",
                domains: domains,
                hasComment: hasComment,
            } as HostRecord);
        } else {
            console.log(`Linha não reconhecida: "${line}"`);
        }
    }

    return parsed;
};

export default parseHosts;
