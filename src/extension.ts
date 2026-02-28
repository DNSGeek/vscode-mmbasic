import * as vscode from 'vscode';
import { SerialPortManager } from './serialPortManager';
import { MMBasicCompletionProvider } from './completionProvider';
import { MMBasicHoverProvider } from './hoverProvider';
import { FileBrowserProvider, MMBasicFile } from './fileBrowserProvider';
import { MMBasicDebugger, DebugVariablesProvider } from './debugger';

let serialManager: SerialPortManager;
let fileBrowser: FileBrowserProvider;
let debugger: MMBasicDebugger;
let debugVariables: DebugVariablesProvider;

export function activate(context: vscode.ExtensionContext) {
    console.log('MMBasic extension is now active');

    // Initialize serial port manager
    serialManager = new SerialPortManager();

    // Initialize file browser
    fileBrowser = new FileBrowserProvider(serialManager);
    const fileBrowserView = vscode.window.createTreeView('mmbasic.fileBrowser', {
        treeDataProvider: fileBrowser
    });
    context.subscriptions.push(fileBrowserView);

    // Initialize debugger
    debugger = new MMBasicDebugger(serialManager);
    debugVariables = new DebugVariablesProvider(debugger);
    const debugVariablesView = vscode.window.createTreeView('mmbasic.debugVariables', {
        treeDataProvider: debugVariables
    });
    context.subscriptions.push(debugVariablesView);

    // Register commands
    const commands = [
        vscode.commands.registerCommand('mmbasic.connectSerial', async () => {
            await serialManager.connect();
        }),
        
        vscode.commands.registerCommand('mmbasic.disconnectSerial', async () => {
            await serialManager.disconnect();
        }),
        
        vscode.commands.registerCommand('mmbasic.sendFile', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('No active editor');
                return;
            }
            
            if (editor.document.languageId !== 'mmbasic') {
                vscode.window.showErrorMessage('Current file is not a MMBasic file');
                return;
            }
            
            const text = editor.document.getText();
            await serialManager.sendProgram(text);
        }),
        
        vscode.commands.registerCommand('mmbasic.sendSelection', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('No active editor');
                return;
            }
            
            const selection = editor.selection;
            const text = editor.document.getText(selection);
            
            if (text) {
                await serialManager.sendCommand(text);
            } else {
                // If no selection, send current line
                const line = editor.document.lineAt(selection.active.line);
                await serialManager.sendCommand(line.text);
            }
        }),
        
        vscode.commands.registerCommand('mmbasic.runProgram', async () => {
            await serialManager.runProgram();
        }),
        
        vscode.commands.registerCommand('mmbasic.stopProgram', async () => {
            await serialManager.stopProgram();
        }),
        
        vscode.commands.registerCommand('mmbasic.listFiles', async () => {
            await serialManager.listFiles();
        }),
        
        vscode.commands.registerCommand('mmbasic.clearTerminal', () => {
            serialManager.clearTerminal();
        }),

        // File Browser Commands
        vscode.commands.registerCommand('mmbasic.refreshFiles', () => {
            fileBrowser.refresh();
        }),

        vscode.commands.registerCommand('mmbasic.uploadFile', async () => {
            const fileUri = await vscode.window.showOpenDialog({
                canSelectFiles: true,
                canSelectFolders: false,
                canSelectMany: false,
                filters: { 'MMBasic Files': ['bas', 'mmb'] }
            });

            if (fileUri && fileUri[0]) {
                const remoteName = await vscode.window.showInputBox({
                    prompt: 'Enter remote filename',
                    value: fileUri[0].fsPath.split(/[\\/]/).pop()
                });

                if (remoteName) {
                    const success = await fileBrowser.uploadFile(fileUri[0].fsPath, remoteName);
                    if (success) {
                        vscode.window.showInformationMessage(`File uploaded: ${remoteName}`);
                    }
                }
            }
        }),

        vscode.commands.registerCommand('mmbasic.downloadFile', async (file: MMBasicFile) => {
            if (file && !file.isDirectory) {
                const content = await fileBrowser.downloadFile(file.label);
                if (content) {
                    const doc = await vscode.workspace.openTextDocument({
                        content: content,
                        language: 'mmbasic'
                    });
                    await vscode.window.showTextDocument(doc);
                }
            }
        }),

        vscode.commands.registerCommand('mmbasic.deleteFile', async (file: MMBasicFile) => {
            if (file && !file.isDirectory) {
                const confirm = await vscode.window.showWarningMessage(
                    `Delete ${file.label}?`,
                    'Delete', 'Cancel'
                );

                if (confirm === 'Delete') {
                    const success = await fileBrowser.deleteFile(file.label);
                    if (success) {
                        vscode.window.showInformationMessage(`Deleted: ${file.label}`);
                    }
                }
            }
        }),

        vscode.commands.registerCommand('mmbasic.openRemoteFile', async (filename: string) => {
            const content = await fileBrowser.downloadFile(filename);
            if (content) {
                const doc = await vscode.workspace.openTextDocument({
                    content: content,
                    language: 'mmbasic'
                });
                await vscode.window.showTextDocument(doc);
            }
        }),

        // Debugger Commands
        vscode.commands.registerCommand('mmbasic.startDebugging', async () => {
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document.languageId === 'mmbasic') {
                await debugger.startDebugging(editor.document);
            } else {
                vscode.window.showErrorMessage('No MMBasic file open');
            }
        }),

        vscode.commands.registerCommand('mmbasic.stopDebugging', async () => {
            await debugger.stopDebugging();
        }),

        vscode.commands.registerCommand('mmbasic.debugStepOver', async () => {
            await debugger.stepOver();
            debugVariables.refresh();
        }),

        vscode.commands.registerCommand('mmbasic.debugContinue', async () => {
            await debugger.continue();
        }),

        vscode.commands.registerCommand('mmbasic.inspectVariable', async () => {
            const variable = await vscode.window.showInputBox({
                prompt: 'Enter variable name to inspect'
            });

            if (variable) {
                await debugger.inspectVariable(variable);
                debugVariables.refresh();
            }
        }),

        vscode.commands.registerCommand('mmbasic.evaluateExpression', async () => {
            const expression = await vscode.window.showInputBox({
                prompt: 'Enter expression to evaluate'
            });

            if (expression) {
                const result = await debugger.evaluateExpression(expression);
                vscode.window.showInformationMessage(`Result: ${result}`);
            }
        })
    ];

    commands.forEach(cmd => context.subscriptions.push(cmd));

    // Register completion provider
    const completionProvider = vscode.languages.registerCompletionItemProvider(
        'mmbasic',
        new MMBasicCompletionProvider(),
        '.' // Trigger on dot for things like I2C.
    );
    context.subscriptions.push(completionProvider);

    // Register hover provider
    const hoverProvider = vscode.languages.registerHoverProvider(
        'mmbasic',
        new MMBasicHoverProvider()
    );
    context.subscriptions.push(hoverProvider);

    // Auto-connect if configured
    const config = vscode.workspace.getConfiguration('mmbasic');
    if (config.get('autoConnect')) {
        serialManager.connect();
    }

    // Status bar item
    const statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        100
    );
    statusBarItem.command = 'mmbasic.connectSerial';
    statusBarItem.text = '$(plug) MMBasic: Disconnected';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    // Update status bar on connection state change
    serialManager.onConnectionChange((connected: boolean) => {
        if (connected) {
            statusBarItem.text = '$(check) MMBasic: Connected';
            statusBarItem.tooltip = 'Click to disconnect';
            statusBarItem.command = 'mmbasic.disconnectSerial';
        } else {
            statusBarItem.text = '$(plug) MMBasic: Disconnected';
            statusBarItem.tooltip = 'Click to connect';
            statusBarItem.command = 'mmbasic.connectSerial';
        }
    });
}

export function deactivate() {
    if (serialManager) {
        serialManager.dispose();
    }
}
