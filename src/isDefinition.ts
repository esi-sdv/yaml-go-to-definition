export function isDefinition(line: string, searchText: string): boolean {
  const searchTextWithColon =
    searchText.at(-1) === ":" ? searchText : searchText + ":";

  if (line.startsWith(searchTextWithColon)) {
    return true;
  }
  return false;
}
