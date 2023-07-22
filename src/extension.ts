import * as vscode from "vscode";
import { YamlDefinitionProvider } from "./yaml-definition-provider";


export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(
      "yaml",
      new YamlDefinitionProvider()
    )
  );
}

