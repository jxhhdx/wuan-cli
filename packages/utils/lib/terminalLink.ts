import terminalLink from 'terminal-link';

export default function terminalLinkWrapper(key: string, url?: string): string {
  if (!url) {
    return terminalLink(key, key) as string;
  } else {
    return terminalLink(key, url) as string;
  }
}
