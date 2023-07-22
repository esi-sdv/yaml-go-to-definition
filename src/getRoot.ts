import { workspace } from "vscode";

export function getRoot() {
  const root = workspace.workspaceFolders![0].uri.fsPath;
  return root;
}
