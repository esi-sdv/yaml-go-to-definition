import * as glob from "glob";
import * as path from "path";
import * as fs from "fs";

export type FileAbsolutePath = string;
export type FileContentLine = string;

export async function getFilesWithContent(
  root: string
): Promise<Map<FileAbsolutePath, FileContentLine[]>> {
  const files = glob.sync("**/*.y?(a)ml", {
    cwd: root,
    ignore: "**/node_modules/**",
    dot: true,
  });

  console.time("reading files took: ");
  const fileDatas = files.map((filePath) => {
    filePath = path.resolve(root, filePath);
    const content = fs.readFileSync(filePath, {
      encoding: "utf8",
    });
    return { path: filePath, content };
  });
  console.timeEnd("reading files took: ");

  console.time("spliting files took: ");
  const fileLines = fileDatas.map((fileData) => {
    const lines = fileData.content.split("\n");
    return { path: fileData.path, lines };
  });
  console.timeEnd("spliting files took: ");

  const resultMap = new Map(
    fileLines.map((fileData) => [fileData.path, fileData.lines])
  );

  return resultMap;
}
