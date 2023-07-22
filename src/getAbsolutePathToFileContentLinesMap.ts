import * as glob from "glob";
import * as path from "path";
import * as fs from "fs";

export type AbsoluteFilePath = string;
export type FileContentLine = string;
export type AbsolutePathToFileContentLinesMap = Record<
  AbsoluteFilePath,
  FileContentLine[]
>;
type RelativeFilePath = string;

function readFileAndSplitLines(filePath: AbsoluteFilePath): FileContentLine[] {
  const content = fs.readFileSync(filePath, { encoding: "utf8" });
  return content.split("\n");
}

function getYamlFilePaths(root: string): RelativeFilePath[] {
  return glob.sync("**/*.y?(a)ml", {
    cwd: root,
    ignore: "**/node_modules/**",
    dot: true,
  });
}

export function getAbsolutePathToFileContentLinesMap(
  root: string
): AbsolutePathToFileContentLinesMap {
  const files: RelativeFilePath[] = getYamlFilePaths(root);
  console.time("reading and parsing files took: ");

  const fileContentMap = files.reduce<AbsolutePathToFileContentLinesMap>(
    (accumulator, filePath) => {
      const AbsoluteFilePath = path.resolve(root, filePath);
      const lines = readFileAndSplitLines(AbsoluteFilePath);
      accumulator[AbsoluteFilePath] = lines;
      return accumulator;
    },
    {}
  );

  console.timeEnd("reading and parsing files took: ");

  return fileContentMap;
}
