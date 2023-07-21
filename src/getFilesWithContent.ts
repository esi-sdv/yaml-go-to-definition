import * as glob from "glob";
import * as path from "path";
import { promisify } from "util";
import * as fs from "fs";

export type FileAbsolutePath = string;
export type FileContentLine = string;

export async function getFilesWithContent(
  root: string
): Promise<Map<FileAbsolutePath, FileContentLine[]>> {
  const globP = promisify(glob);

  const files = await globP("**/*.y?(a)ml", {
    cwd: root,
    ignore: "**/node_modules/**",
    dot: true,
  });

  const filePromises = files.map(async (filePath) => {
    filePath = path.resolve(root, filePath);
    const content = await fs.promises.readFile(filePath, {
      encoding: "utf8",
    });
    const lines = content.split(/\r?\n/);
    return { path: filePath, lines: lines };
  });

  const fileDatas = await Promise.all(filePromises);
  const resultMap = new Map(
    fileDatas.map((fileData) => [fileData.path, fileData.lines])
  );

  return resultMap;
}
