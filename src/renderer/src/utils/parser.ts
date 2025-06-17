import type { HostRecord } from '@/types/hosts';

const parseHosts = (content: string): HostRecord[] => {
  // Remove caracteres invisíveis (e.g., \r)
  const normalizedContent = content.replace(/\r/g, '');
  const lines = normalizedContent.split('\n');
  const parsed = [];

  const regex = /^\s*(#)?\s*([\d.:]+)?\s*([^\s#]*)?(.*?)(#.*)?$/;

  for (const line of lines) {
    const match = line.match(regex);
    if (match) {
      const hasComment = !!match[1];
      const ip = hasComment && !match[2] ? '' : match[2]?.trim() || '';
      const domains = hasComment && !match[2] ? [] : match[3]?.split(/\s+/).filter(Boolean) || [];
      const trailingComment =
        match[1] && !match[2] && domains.length === 0
          ? line.replace(/^\s*#/, '').trim()
          : match[5]?.replace(/^#/, '').trim() || '';

      parsed.push({
        checked: false,
        ip: ip || '',
        domains: domains,
        hasComment: hasComment,
        comment: trailingComment
      } as HostRecord);
    } else {
      console.log(`Linha não reconhecida: "${line}"`);
    }
  }

  return parsed;
};

export default parseHosts;
