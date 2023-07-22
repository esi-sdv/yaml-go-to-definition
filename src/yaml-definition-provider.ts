import * as vscode from "vscode";
import { getFilesWithContent } from "./getFilesWithContent";
import {
  FilePathToFoundInLineNumbersMap,
  findLinesWithText,
} from "./findLinesWithText";

export class YamlDefinitionProvider implements vscode.DefinitionProvider {
  async provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): Promise<vscode.Location[]> {
    console.time("Total time: provideDefinition")

    const name = this.getClicked(document, position);

    console.time("Total time: getFilePathToLineNumbersMap");
    const filePathToLineNumbersMap = await this.getFilePathToLineNumbersMap(
      name
    );
    console.timeEnd("Total time: getFilePathToLineNumbersMap");

    const locations = await this.getLocations(filePathToLineNumbersMap);

    console.timeEnd("Total time: provideDefinition")
    return locations;
  }

  private async getLocations(
    filePathToLineNumbersMap: FilePathToFoundInLineNumbersMap
  ) {
    const locations: vscode.Location[] = Object.entries(
      filePathToLineNumbersMap
    ).flatMap(([filePath, lineNumbers]) => {
      const uri = vscode.Uri.file(filePath);
      return lineNumbers.map((lineNumber) => {
        const pos = new vscode.Position(lineNumber - 1, 0);
        return new vscode.Location(uri, pos);
      });
    });

    return locations;
  }

  private async getFilePathToLineNumbersMap(
    name: string
  ): Promise<FilePathToFoundInLineNumbersMap> {
    const root = vscode.workspace.workspaceFolders![0].uri.fsPath;
    const fileContentMap = await getFilesWithContent(root);
    const filePathToLineNumbersMap = findLinesWithText(fileContentMap, name);

    return filePathToLineNumbersMap;
  }

  private getClicked(document: vscode.TextDocument, position: vscode.Position) {
    const range = document.getWordRangeAtPosition(position, /[^ \{\}\[\]\,]+/);
    const name = document.getText(range);

    return name;
  }
}
