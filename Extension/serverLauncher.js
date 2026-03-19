const fs = require('fs');
const os = require('os');
const path = require('path');
const vscode = require('vscode');
const { LanguageClient, TransportKind } = require('vscode-languageclient/node');

function activate(context) {
    const workspaceRoot = getPrimaryWorkspaceFolder();
    const config = vscode.workspace.getConfiguration('tusmo.hover');

    const hoverBinary = resolveHoverBinary();
    const pythonExecutablePath = hoverBinary
        ? null
        : resolvePythonExecutable(config.get('pythonPath'), workspaceRoot);
    const serverScriptPath = hoverBinary
        ? null
        : resolveServerScript(config.get('serverScript'), workspaceRoot, context);

    if (!hoverBinary && (!pythonExecutablePath || !serverScriptPath)) {
        return;
    }

    const serverOptions = hoverBinary
        ? {
              command: hoverBinary,
              args: ['--stdio'],
              options: workspaceRoot ? { cwd: workspaceRoot } : undefined,
              transport: TransportKind.stdio
          }
        : {
              command: pythonExecutablePath,
              args: [serverScriptPath, '--stdio'],
              options: workspaceRoot ? { cwd: workspaceRoot } : undefined,
              transport: TransportKind.stdio
          };

    const clientOptions = {
        documentSelector: [{ scheme: 'file', language: 'tusmo' }],
        synchronize: {
            fileEvents: vscode.workspace.createFileSystemWatcher('**/*.tus')
        },
        outputChannelName: 'Tusmo Hover Server'
    };

    const client = new LanguageClient(
        'tusmoLanguageServer',
        'Tusmo Language Server',
        serverOptions,
        clientOptions
    );

    client.start();
    context.subscriptions.push(client);
}

function getPrimaryWorkspaceFolder() {
    const folders = vscode.workspace.workspaceFolders;
    if (!folders || folders.length === 0) {
        return undefined;
    }
    return folders[0].uri.fsPath;
}

function resolveHoverBinary() {
    const tusmoHome =
        process.env.TUSMO_HOME || path.join(os.homedir(), '.tusmo');
    const candidates = [
        path.join(
            tusmoHome,
            'bin',
            process.platform === 'win32' ? 'tusmo-hover.exe' : 'tusmo-hover'
        ),
        path.join(
            os.homedir(),
            '.tusmo',
            'bin',
            process.platform === 'win32' ? 'tusmo-hover.exe' : 'tusmo-hover'
        )
    ];
    for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
            return candidate;
        }
    }
    return null;
}

function resolvePythonExecutable(settingValue, workspaceRoot) {
    const fromSetting = resolvePathSetting(settingValue, workspaceRoot);
    if (fromSetting) {
        if (pathLooksLikeFile(fromSetting) && !fs.existsSync(fromSetting)) {
            vscode.window.showErrorMessage(
                `Tusmo hover: configured Python path not found (${fromSetting}).`
            );
            return undefined;
        }
        return fromSetting;
    }

    if (workspaceRoot) {
        const candidates = buildVirtualEnvCandidates(workspaceRoot);
        for (const candidate of candidates) {
            if (fs.existsSync(candidate)) {
                return candidate;
            }
        }
    }

    return process.platform === 'win32' ? 'python' : 'python3';
}

function resolveServerScript(settingValue, workspaceRoot, context) {
    const fromSetting = resolvePathSetting(settingValue, workspaceRoot);
    if (fromSetting) {
        if (!fs.existsSync(fromSetting)) {
            vscode.window.showErrorMessage(
                `Tusmo hover: server script not found at ${fromSetting}.`
            );
            return undefined;
        }
        return fromSetting;
    }

    if (workspaceRoot) {
        const workspaceScript = path.join(workspaceRoot, 'tusmo_hover_server.py');
        if (fs.existsSync(workspaceScript)) {
            return workspaceScript;
        }
    } else {
        vscode.window.showWarningMessage(
            'Tusmo hover: open a Tusmo workspace or set tusmo.hover.serverScript.'
        );
    }

    const bundledScript = context.asAbsolutePath(path.join('server', 'tusmo_hover_server.py'));
    if (fs.existsSync(bundledScript)) {
        return bundledScript;
    }

    vscode.window.showErrorMessage(
        'Tusmo hover: could not find tusmo_hover_server.py. Set tusmo.hover.serverScript in your settings.'
    );
    return undefined;
}

function resolvePathSetting(value, workspaceRoot) {
    if (!value || typeof value !== 'string') {
        return undefined;
    }
    const trimmed = value.trim();
    if (!trimmed) {
        return undefined;
    }

    const expanded = expandHome(trimmed);
    if (path.isAbsolute(expanded)) {
        return expanded;
    }

    if (expanded.startsWith('.') || expanded.includes(path.sep)) {
        if (!workspaceRoot) {
            return undefined;
        }
        return path.join(workspaceRoot, expanded);
    }

    return expanded;
}

function expandHome(targetPath) {
    if (!targetPath.startsWith('~')) {
        return targetPath;
    }
    return path.join(os.homedir(), targetPath.slice(1));
}

function pathLooksLikeFile(targetPath) {
    return path.isAbsolute(targetPath) || targetPath.includes(path.sep);
}

function buildVirtualEnvCandidates(workspaceRoot) {
    const scriptsDir = process.platform === 'win32' ? 'Scripts' : 'bin';
    const executable = process.platform === 'win32' ? 'python.exe' : 'python';
    const envDirs = ['.env', '.venv', 'venv'];
    return envDirs.map((envDir) =>
        path.join(workspaceRoot, envDir, scriptsDir, executable)
    );
}

module.exports = {
    activate
};
