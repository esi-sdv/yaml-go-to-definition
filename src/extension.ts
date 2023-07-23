import * as vscode from "vscode";
import { YamlDefinitionProvider } from "./yaml-definition-provider";
import { Cache } from "./cache";
import { Logger } from "./logger";

export function activate(context: vscode.ExtensionContext) {
  const isInDebugMode = process.env.VSCODE_DEBUG_MODE === "true";

  const _console = isInDebugMode ? console : undefined;
  const logger = new Logger(_console);

  const cacheTime = isInDebugMode ? 5000 * 1 : 5000 * 1;
  const cache = new Cache<vscode.Location[]>(cacheTime);

  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(
      "yaml",
      new YamlDefinitionProvider(cache, logger)
    )
  );
}
