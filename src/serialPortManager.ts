import * as vscode from 'vscode';
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';

export class SerialPortManager {
    private port: SerialPort | null = null;
    private outputChannel: vscode.OutputChannel;
    private parser: ReadlineParser | null = null;
    private connectionCallbacks: ((connected: boolean) => void)[] = [];

    constructor() {
        this.outputChannel = vscode.window.createOutputChannel('MMBasic Serial');
        this.outputChannel.show();
    }

    async connect(): Promise<void> {
        if (this.port && this.port.isOpen) {
            vscode.window.showWarningMessage('Already connected to a device');
            return;
        }

        try {
            // Get list of available ports
            const ports = await SerialPort.list();
            
            if (ports.length === 0) {
                vscode.window.showErrorMessage('No serial ports found');
                return;
            }

            // Get configured port or ask user to select
            const config = vscode.workspace.getConfiguration('mmbasic');
            let selectedPort = config.get<string>('serialPort');

            if (!selectedPort || !ports.find(p => p.path === selectedPort)) {
                const portItems = ports.map(p => ({
                    label: p.path,
                    description: p.manufacturer || p.pnpId || '',
                    detail: p.serialNumber || ''
                }));

                const selection = await vscode.window.showQuickPick(portItems, {
                    placeHolder: 'Select a serial port'
                });

                if (!selection) {
                    return;
                }

                selectedPort = selection.label;
            }

            const baudRate = config.get<number>('baudRate', 38400);

            this.outputChannel.appendLine(`Connecting to ${selectedPort} at ${baudRate} baud...`);

            this.port = new SerialPort({
                path: selectedPort,
                baudRate: baudRate,
                dataBits: 8,
                parity: 'none',
                stopBits: 1
            });

            // Set up line parser
            this.parser = this.port.pipe(new ReadlineParser({ delimiter: '\r\n' }));
            
            this.parser.on('data', (data: string) => {
                this.outputChannel.appendLine(data);
            });

            this.port.on('open', () => {
                this.outputChannel.appendLine('✓ Connected successfully');
                vscode.window.showInformationMessage(`Connected to ${selectedPort}`);
                this.notifyConnectionChange(true);
            });

            this.port.on('error', (err) => {
                this.outputChannel.appendLine(`Error: ${err.message}`);
                vscode.window.showErrorMessage(`Serial port error: ${err.message}`);
            });

            this.port.on('close', () => {
                this.outputChannel.appendLine('Connection closed');
                this.notifyConnectionChange(false);
            });

        } catch (error: any) {
            this.outputChannel.appendLine(`Connection failed: ${error.message}`);
            vscode.window.showErrorMessage(`Failed to connect: ${error.message}`);
        }
    }

    async disconnect(): Promise<void> {
        if (!this.port || !this.port.isOpen) {
            vscode.window.showWarningMessage('Not connected to any device');
            return;
        }

        return new Promise((resolve) => {
            this.port!.close((err) => {
                if (err) {
                    this.outputChannel.appendLine(`Error closing port: ${err.message}`);
                    vscode.window.showErrorMessage(`Error disconnecting: ${err.message}`);
                } else {
                    this.outputChannel.appendLine('Disconnected');
                    vscode.window.showInformationMessage('Disconnected from device');
                }
                this.port = null;
                this.parser = null;
                resolve();
            });
        });
    }

    async sendCommand(command: string): Promise<void> {
        if (!this.isConnected()) {
            vscode.window.showErrorMessage('Not connected to device');
            return;
        }

        const config = vscode.workspace.getConfiguration('mmbasic');
        const lineEnding = this.parseLineEnding(config.get<string>('lineEnding', '\\r\\n'));

        this.outputChannel.appendLine(`> ${command}`);
        this.port!.write(command + lineEnding);
    }

    async sendProgram(program: string): Promise<void> {
        if (!this.isConnected()) {
            vscode.window.showErrorMessage('Not connected to device');
            return;
        }

        const lines = program.split('\n');
        const config = vscode.workspace.getConfiguration('mmbasic');
        const lineEnding = this.parseLineEnding(config.get<string>('lineEnding', '\\r\\n'));

        this.outputChannel.appendLine('--- Sending program ---');

        // First, clear the current program with NEW
        this.port!.write('NEW' + lineEnding);
        await this.delay(100);

        // Send each line
        for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine && !trimmedLine.startsWith("'")) {
                this.port!.write(trimmedLine + lineEnding);
                await this.delay(50); // Small delay between lines
            }
        }

        this.outputChannel.appendLine('--- Program sent ---');
        vscode.window.showInformationMessage('Program uploaded successfully');
    }

    async runProgram(): Promise<void> {
        if (!this.isConnected()) {
            vscode.window.showErrorMessage('Not connected to device');
            return;
        }

        const config = vscode.workspace.getConfiguration('mmbasic');
        const lineEnding = this.parseLineEnding(config.get<string>('lineEnding', '\\r\\n'));

        this.outputChannel.appendLine('--- Running program ---');
        this.port!.write('RUN' + lineEnding);
    }

    async stopProgram(): Promise<void> {
        if (!this.isConnected()) {
            vscode.window.showErrorMessage('Not connected to device');
            return;
        }

        // Send Ctrl+C to stop program
        this.outputChannel.appendLine('Stopping program...');
        this.port!.write(String.fromCharCode(3)); // Ctrl+C
    }

    async listFiles(): Promise<void> {
        if (!this.isConnected()) {
            vscode.window.showErrorMessage('Not connected to device');
            return;
        }

        const config = vscode.workspace.getConfiguration('mmbasic');
        const lineEnding = this.parseLineEnding(config.get<string>('lineEnding', '\\r\\n'));

        this.outputChannel.appendLine('--- Files on device ---');
        this.port!.write('FILES' + lineEnding);
    }

    clearTerminal(): void {
        this.outputChannel.clear();
    }

    isConnected(): boolean {
        return this.port !== null && this.port.isOpen;
    }

    onConnectionChange(callback: (connected: boolean) => void): void {
        this.connectionCallbacks.push(callback);
    }

    private notifyConnectionChange(connected: boolean): void {
        this.connectionCallbacks.forEach(cb => cb(connected));
    }

    private parseLineEnding(ending: string): string {
        return ending.replace('\\r', '\r').replace('\\n', '\n');
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    dispose(): void {
        if (this.port && this.port.isOpen) {
            this.port.close();
        }
        this.outputChannel.dispose();
    }
}
