import * as vscode from 'vscode';
import { SerialPortManager } from './serialPortManager';

export class MMBasicFile extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly isDirectory: boolean,
        public readonly size?: number,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None
    ) {
        super(label, collapsibleState);
        
        this.iconPath = isDirectory 
            ? new vscode.ThemeIcon('folder')
            : new vscode.ThemeIcon('file');
        
        this.contextValue = isDirectory ? 'directory' : 'file';
        
        if (!isDirectory && size !== undefined) {
            this.description = `${size} bytes`;
        }
        
        if (!isDirectory) {
            this.command = {
                command: 'mmbasic.openRemoteFile',
                title: 'Open File',
                arguments: [this.label]
            };
        }
    }
}

export class FileBrowserProvider implements vscode.TreeDataProvider<MMBasicFile> {
    private _onDidChangeTreeData: vscode.EventEmitter<MMBasicFile | undefined | null | void> = new vscode.EventEmitter<MMBasicFile | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<MMBasicFile | undefined | null | void> = this._onDidChangeTreeData.event;

    private files: Map<string, MMBasicFile[]> = new Map();
    private serialManager: SerialPortManager;

    constructor(serialManager: SerialPortManager) {
        this.serialManager = serialManager;
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: MMBasicFile): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: MMBasicFile): Promise<MMBasicFile[]> {
        if (!this.serialManager.isConnected()) {
            return [];
        }

        if (!element) {
            // Root level - show drives
            return [
                new MMBasicFile('A:', true, undefined, vscode.TreeItemCollapsibleState.Collapsed),
                new MMBasicFile('B:', true, undefined, vscode.TreeItemCollapsibleState.Collapsed)
            ];
        }

        // Get files for this directory
        const path = element.label;
        return await this.getFilesForPath(path);
    }

    private async getFilesForPath(path: string): Promise<MMBasicFile[]> {
        return new Promise(async (resolve) => {
            const files: MMBasicFile[] = [];
            let responseBuffer = '';
            let capturing = false;

            // Listen for file listing response
            const dataHandler = (data: string) => {
                if (data.includes('Volume') || data.includes('Directory')) {
                    capturing = true;
                    return;
                }
                
                if (capturing) {
                    responseBuffer += data + '\n';
                    
                    // Check if we've reached the end
                    if (data.includes('bytes free') || data.includes('Total')) {
                        capturing = false;
                        this.serialManager.removeDataListener(dataHandler);
                        
                        // Parse the file listing
                        const lines = responseBuffer.split('\n');
                        for (const line of lines) {
                            const match = line.match(/^\s*(\S+)\s+<DIR>/) || 
                                         line.match(/^\s*(\S+)\s+(\d+)/);
                            
                            if (match) {
                                const name = match[1];
                                const isDir = line.includes('<DIR>');
                                const size = isDir ? undefined : parseInt(match[2] || '0');
                                
                                files.push(new MMBasicFile(
                                    name,
                                    isDir,
                                    size,
                                    isDir ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None
                                ));
                            }
                        }
                        
                        resolve(files);
                    }
                }
            };

            this.serialManager.addDataListener(dataHandler);
            
            // Send FILES command for the path
            await this.serialManager.sendCommand(`FILES "${path}"`);
            
            // Timeout after 3 seconds
            setTimeout(() => {
                this.serialManager.removeDataListener(dataHandler);
                resolve(files);
            }, 3000);
        });
    }

    async downloadFile(filename: string): Promise<string | undefined> {
        return new Promise(async (resolve) => {
            let content = '';
            let capturing = false;

            const dataHandler = (data: string) => {
                if (data.startsWith('>')) {
                    return; // Ignore echo of command
                }
                
                if (capturing) {
                    if (data === '>' || data.includes('Error')) {
                        this.serialManager.removeDataListener(dataHandler);
                        capturing = false;
                        resolve(content || undefined);
                    } else {
                        content += data + '\n';
                    }
                } else if (data.trim() === '') {
                    capturing = true;
                }
            };

            this.serialManager.addDataListener(dataHandler);
            
            // List the file to get its contents
            await this.serialManager.sendCommand(`LIST "${filename}"`);
            
            setTimeout(() => {
                this.serialManager.removeDataListener(dataHandler);
                resolve(content || undefined);
            }, 5000);
        });
    }

    async uploadFile(localPath: string, remoteName: string): Promise<boolean> {
        try {
            const fs = require('fs');
            const content = fs.readFileSync(localPath, 'utf8');
            
            // Clear any existing program
            await this.serialManager.sendCommand('NEW');
            await this.delay(100);
            
            // Send the program
            await this.serialManager.sendProgram(content);
            await this.delay(100);
            
            // Save to the remote filename
            await this.serialManager.sendCommand(`SAVE "${remoteName}"`);
            await this.delay(500);
            
            this.refresh();
            return true;
        } catch (error: any) {
            vscode.window.showErrorMessage(`Failed to upload file: ${error.message}`);
            return false;
        }
    }

    async deleteFile(filename: string): Promise<boolean> {
        try {
            await this.serialManager.sendCommand(`KILL "${filename}"`);
            await this.delay(500);
            this.refresh();
            return true;
        } catch (error: any) {
            vscode.window.showErrorMessage(`Failed to delete file: ${error.message}`);
            return false;
        }
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
