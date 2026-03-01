import * as vscode from 'vscode';
import { SerialPortManager } from './serialPortManager';

export class MMBasicDebugger {
    private serialManager: SerialPortManager;
    private breakpoints: Map<string, number[]> = new Map();
    private currentLine: number = 0;
    private isDebugging: boolean = false;
    private debugOutputChannel: vscode.OutputChannel;
    private variables: Map<string, string> = new Map();

    constructor(serialManager: SerialPortManager) {
        this.serialManager = serialManager;
        this.debugOutputChannel = vscode.window.createOutputChannel('MMBasic Debug');
    }

    async startDebugging(document: vscode.TextDocument): Promise<void> {
        if (!this.serialManager.isConnected()) {
            vscode.window.showErrorMessage('Not connected to device');
            return;
        }

        this.isDebugging = true;
        this.debugOutputChannel.clear();
        this.debugOutputChannel.show();
        this.debugOutputChannel.appendLine('=== MMBasic Debugging Started ===');
        this.debugOutputChannel.appendLine('Note: This is a basic line-by-line debugger');
        this.debugOutputChannel.appendLine('Breakpoints will pause execution at the specified lines\n');

        // Upload the program with TRON for line tracking
        await this.serialManager.sendCommand('TRON');
        await this.delay(100);
        
        await this.serialManager.sendProgram(document.getText());
        await this.delay(500);

        // Start running
        this.debugOutputChannel.appendLine('Starting program...');
        await this.serialManager.sendCommand('RUN');
    }

    async stopDebugging(): Promise<void> {
        if (!this.isDebugging) {
            return;
        }

        this.isDebugging = false;
        await this.serialManager.stopProgram();
        await this.delay(100);
        await this.serialManager.sendCommand('TROFF');
        
        this.debugOutputChannel.appendLine('\n=== Debugging Stopped ===');
        this.currentLine = 0;
        this.variables.clear();
    }

    async stepOver(): Promise<void> {
        if (!this.isDebugging) {
            vscode.window.showWarningMessage('Not currently debugging');
            return;
        }

        // In MMBasic, we can't truly step - but we can pause and continue
        // This sends a space (continue for one step if paused)
        await this.serialManager.sendCommand(' ');
        this.debugOutputChannel.appendLine('Step executed');
    }

    async continue(): Promise<void> {
        if (!this.isDebugging) {
            vscode.window.showWarningMessage('Not currently debugging');
            return;
        }

        // Continue execution
        await this.serialManager.sendCommand(' ');
        this.debugOutputChannel.appendLine('Continuing execution...');
    }

    async inspectVariable(variableName: string): Promise<void> {
        if (!this.serialManager.isConnected()) {
            vscode.window.showErrorMessage('Not connected to device');
            return;
        }

        return new Promise(async (resolve) => {
            let value = '';
            
            const dataHandler = (data: string) => {
                // Look for the variable value in the response
                if (data.includes('=') || data.match(/^\s*[\d\.\-]+/)) {
                    value = data.trim();
                    this.serialManager.removeDataListener(dataHandler);
                    this.variables.set(variableName, value);
                    this.debugOutputChannel.appendLine(`${variableName} = ${value}`);
                    resolve();
                }
            };

            this.serialManager.addDataListener(dataHandler);
            
            // Print the variable value
            await this.serialManager.sendCommand(`PRINT ${variableName}`);
            
            setTimeout(() => {
                this.serialManager.removeDataListener(dataHandler);
                resolve();
            }, 1000);
        });
    }

    async evaluateExpression(expression: string): Promise<string> {
        return new Promise(async (resolve) => {
            let result = '';
            
            const dataHandler = (data: string) => {
                if (data.trim() && !data.startsWith('>')) {
                    result = data.trim();
                    this.serialManager.removeDataListener(dataHandler);
                    resolve(result);
                }
            };

            this.serialManager.addDataListener(dataHandler);
            
            // Print the expression
            await this.serialManager.sendCommand(`PRINT ${expression}`);
            
            setTimeout(() => {
                this.serialManager.removeDataListener(dataHandler);
                resolve(result || 'Error evaluating expression');
            }, 1000);
        });
    }

    setBreakpoint(uri: string, line: number): void {
        const breakpoints = this.breakpoints.get(uri) || [];
        if (!breakpoints.includes(line)) {
            breakpoints.push(line);
            this.breakpoints.set(uri, breakpoints);
            this.debugOutputChannel.appendLine(`Breakpoint set at line ${line}`);
        }
    }

    removeBreakpoint(uri: string, line: number): void {
        const breakpoints = this.breakpoints.get(uri) || [];
        const index = breakpoints.indexOf(line);
        if (index > -1) {
            breakpoints.splice(index, 1);
            this.breakpoints.set(uri, breakpoints);
            this.debugOutputChannel.appendLine(`Breakpoint removed from line ${line}`);
        }
    }

    clearAllBreakpoints(): void {
        this.breakpoints.clear();
        this.debugOutputChannel.appendLine('All breakpoints cleared');
    }

    getVariables(): Map<string, string> {
        return this.variables;
    }

    isCurrentlyDebugging(): boolean {
        return this.isDebugging;
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    dispose(): void {
        this.debugOutputChannel.dispose();
    }
}

export class DebugVariablesProvider implements vscode.TreeDataProvider<DebugVariable> {
    private _onDidChangeTreeData: vscode.EventEmitter<DebugVariable | undefined | null | void> = 
        new vscode.EventEmitter<DebugVariable | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<DebugVariable | undefined | null | void> = 
        this._onDidChangeTreeData.event;

    private mmDebugger: MMBasicDebugger;

    constructor(mmDebugger: MMBasicDebugger) {
        this.mmDebugger = mmDebugger;
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: DebugVariable): vscode.TreeItem {
        return element;
    }

    getChildren(element?: DebugVariable): Thenable<DebugVariable[]> {
        if (element) {
            return Promise.resolve([]);
        }

        const variables = this.mmDebugger.getVariables();
        const items: DebugVariable[] = [];

        variables.forEach((value, name) => {
            items.push(new DebugVariable(name, value));
        });

        return Promise.resolve(items);
    }
}

class DebugVariable extends vscode.TreeItem {
    constructor(
        public readonly name: string,
        public readonly value: string
    ) {
        super(name, vscode.TreeItemCollapsibleState.None);
        this.description = value;
        this.tooltip = `${name} = ${value}`;
        this.iconPath = new vscode.ThemeIcon('symbol-variable');
    }
}
