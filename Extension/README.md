# Tusmo VS Code extension

Provides syntax highlighting, basic language configuration, icon theme, and language server launcher wiring for Tusmo.

## Build a VSIX
```bash
cd Extension
npm install                 # pulls dependencies
npx vsce package            # outputs a .vsix in this folder
```
If you don't have `vsce`, install it: `npm install -g @vscode/vsce`.

## Install in VS Code
1. Open VS Code → Extensions → "Install from VSIX".
2. Select the generated `.vsix` file.
3. Reload VS Code. Files with the Tusmo language ID will get highlighting and the icon from `tusmo-icon-theme.json`.

## Files
- `syntaxes/` — TextMate grammar for highlighting
- `language-configuration.json` — brackets/comments, etc.
- `tusmo-icon-theme.json` — icon mapping
- `server/` & `serverLauncher.js` — language server entry points (if you hook up LSP)
- `package.json` — extension manifest

## Notes
- Update the version in `package.json` before packaging.
- Re-run `vsce package` after changes to grammars or icons.
- To publish to the VS Code Marketplace, use `vsce publish` with a publisher token.
