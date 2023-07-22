import * as vscode from "vscode";
import {
  AbsoluteFilePath,
  getAbsolutePathToFileContentLinesMap,
} from "./getAbsolutePathToFileContentLinesMap";
import { getRoot } from "./getRoot";
import {
  AbsolutePathToFoundInLineNumbersMap,
  LineNumber,
  getAbsolutePathToFoundInLineNumbersMap,
} from "./findLinesWithText";

export class YamlDefinitionProvider implements vscode.DefinitionProvider {
  provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.Location[] {
    console.time("Total time: provideDefinition");
    const root = getRoot();
    const name = this.getClicked(document, position);

    console.time("Total time: getFilePathToLineNumbersMap");
    const filePathToLineNumbersMap = getAbsolutePathToFoundInLineNumbersMap(
      getAbsolutePathToFileContentLinesMap(root),
      name
    );
    console.timeEnd("Total time: getFilePathToLineNumbersMap");

    const locations = this.getLocations(filePathToLineNumbersMap);

    console.timeEnd("Total time: provideDefinition");
    return locations;
  }

  private createLocationFromFilePathAndLineNumber(
    filePath: AbsoluteFilePath,
    lineNumber: LineNumber
  ): vscode.Location {
    const uri = vscode.Uri.file(filePath);
    const pos = new vscode.Position(lineNumber - 1, 0);
    return new vscode.Location(uri, pos);
  }

  private createLocationsFromFilePath(
    filePath: AbsoluteFilePath,
    lineNumbers: LineNumber[]
  ): vscode.Location[] {
    return lineNumbers.map((lineNumber) =>
      this.createLocationFromFilePathAndLineNumber(filePath, lineNumber)
    );
  }

  private getLocations(
    filePathToLineNumbersMap: AbsolutePathToFoundInLineNumbersMap
  ) {
    return Object.entries(filePathToLineNumbersMap).flatMap(
      ([filePath, lineNumbers]) =>
        this.createLocationsFromFilePath(filePath, lineNumbers)
    );
  }

  private getClicked(document: vscode.TextDocument, position: vscode.Position) {
    const range = document.getWordRangeAtPosition(position, /[^ \{\}\[\]\,]+/);
    const name = document.getText(range);

    return name;
  }
}
