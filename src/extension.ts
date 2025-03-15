import * as vscode from 'vscode';
import * as cp from 'child_process';

export function activate (context: vscode.ExtensionContext) {
	const sshServers = [
		{ name: 'ucodkr', host: '192.168.1.251', user: 'ubuntu' },
	];
	const openTerminalInEditorCommand = vscode.commands.registerCommand('extension.openTerminalInEditor', async () => {
		// Execute the command to open a terminal in the editor area
		await vscode.commands.executeCommand('workbench.action.terminal.newInEditor');
	});

	// Command to open terminal and connect to an SSH server
	const openTerminalCommand = vscode.commands.registerCommand('extension.openSshTerminal', async (server: { host: string, user: string, name: string }) => {
		// Create terminal
		const terminal = vscode.window.createTerminal({
			name: `SSH: ${server.name}`,
			location: vscode.TerminalLocation.Editor // 🚀 본문 영역에서 터미널 실행
		});

		// Start SSH command
		terminal.sendText(`ssh ${server.user}@${server.host}`);
		vscode.window.showTextDocument(
			vscode.Uri.parse(`vscode-terminal://${terminal.name}`),
			{ viewColumn: vscode.ViewColumn.Active }
		);
		// Show terminal in editor area
		terminal.show();
	});

	// Command to show a quick pick with server names
	const showServerListCommand = vscode.commands.registerCommand('extension.showServerList', async () => {

		const serverNames = sshServers.map(s => s.name);
		const selectedServerName = await vscode.window.showQuickPick(serverNames, {
			placeHolder: 'Select an SSH server to connect to',
		});

		if (!selectedServerName) return;

		const selectedServer = sshServers.find(s => s.name === selectedServerName);
		if (selectedServer) {
			vscode.commands.executeCommand('extension.openSshTerminal', selectedServer);
		}
	});

	context.subscriptions.push(openTerminalCommand, showServerListCommand);
}

export function deactivate () { }
