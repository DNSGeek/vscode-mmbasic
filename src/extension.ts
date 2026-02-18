import * as vscode from 'vscode';
import { SerialPortManager } from './serialPortManager';
import { MMBasicCompletionProvider } from './completionProvider';
import { MMBasicHoverProvider } from './hoverProvider';

let serialManager: SerialPortManager;

export function activate(context: vscode.ExtensionContext) {
    console.log('MMBasic extension is now active');

    // Initialize serial port manager
    serialManager = new SerialPortManager();

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
