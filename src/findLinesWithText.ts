import { FileAbsolutePath, FileContentLine } from "./getFilesWithContent";
import { isDefinition } from "./isDefinition";

export type LineNumber = number;
export type FilePathToFoundInLineNumbersMap = { [path: string]: LineNumber[] };

export function findLinesWithText(
  fileContentMap: Map<FileAbsolutePath, FileContentLine[]>,
  searchText: string
): FilePathToFoundInLineNumbersMap {
  return Array.from(
    fileContentMap.entries()
  ).reduce<FilePathToFoundInLineNumbersMap>(
    (accumulator, [filePath, lines]) => {
      const lineNumbers = lines.reduce<LineNumber[]>(
        (lineAccumulator, line, index) => {
          if (isDefinition(line, searchText)) {
            lineAccumulator.push(index + 1);
          }
          return lineAccumulator;
        },
        []
      );

      if (lineNumbers.length > 0) {
        accumulator[filePath] = lineNumbers;
      }

      return accumulator;
    },
    {}
  );
}
