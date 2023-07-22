import {
  AbsolutePathToFileContentLinesMap,
  AbsoluteFilePath,
  FileContentLine,
} from "./getAbsolutePathToFileContentLinesMap";
import { isDefinition } from "./isDefinition";

export type LineNumber = number;
export type AbsolutePathToFoundInLineNumbersMap = {
  [path: AbsoluteFilePath]: LineNumber[];
};

function findMatchingLineNumbers(
  lines: FileContentLine[],
  searchText: string
): LineNumber[] {
  return lines.reduce<LineNumber[]>((accumulator, line, index) => {
    if (isDefinition(line, searchText)) {
      accumulator.push(index + 1);
    }
    return accumulator;
  }, []);
}

export function getAbsolutePathToFoundInLineNumbersMap(
  fileContentRecord: AbsolutePathToFileContentLinesMap,
  searchText: string
): AbsolutePathToFoundInLineNumbersMap {
  return Object.entries(
    fileContentRecord
  ).reduce<AbsolutePathToFoundInLineNumbersMap>(
    (accumulator, [filePath, lines]) => {
      const lineNumbers = findMatchingLineNumbers(lines, searchText);
      if (lineNumbers.length > 0) {
        accumulator[filePath] = lineNumbers;
      }
      return accumulator;
    },
    {}
  );
}
