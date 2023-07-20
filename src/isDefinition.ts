export function isDefinition(line: string, searchText: string): boolean {
  if (line.startsWith(searchText)) {
    return true;
  }
  return false;
}
