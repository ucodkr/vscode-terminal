import * as vscode from 'vscode';
import { SSHTreeProvider } from './sshTreeView';
import { addServer, loadServers, removeServer } from './serverData';

export function activate (context: vscode.ExtensionContext) {
	const sshTreeProvider = new SSHTreeProvider();
	vscode.window.registerTreeDataProvider('sshServers', sshTreeProvider);

	// SSH 서버에 연결
	context.subscriptions.push(vscode.commands.registerCommand('extension.openSSH', async (server) => {
		const terminal = vscode.window.createTerminal({
			name: `${server.name}`,
			location: vscode.TerminalLocation.Editor
		});

		terminal.show();
		terminal.sendText(`ssh ${server.user}@${server.host}`);
	}));

	// 서버 추가
	context.subscriptions.push(vscode.commands.registerCommand('extension.addServer', async () => {
		const name = await vscode.window.showInputBox({ prompt: 'Enter server name' });
		const user = await vscode.window.showInputBox({ prompt: 'Enter SSH username' });
		const host = await vscode.window.showInputBox({ prompt: 'Enter SSH host' });

		if (name && user && host) {
			addServer(name, user, host);
			sshTreeProvider.refresh();
		}
	}));

	// 서버 삭제
	context.subscriptions.push(vscode.commands.registerCommand('extension.removeServer', async (server) => {
		const confirm = await vscode.window.showWarningMessage(`Delete server ${server.name}?`, 'Yes', 'No');
		if (confirm === 'Yes') {
			removeServer(server.name);
			sshTreeProvider.refresh();
		}
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.openSettingsFile', () => {
		const settingsPath = vscode.Uri.file('/path/to/your/settings/file.json'); // 설정 파일 경로 수정
		vscode.workspace.openTextDocument(settingsPath).then(doc => {
			vscode.window.showTextDocument(doc);
		});
	}));
	context.subscriptions.push(vscode.commands.registerCommand('extension.refreshServers', () => {
		loadServers();  // 서버 목록 새로 고침
	}));


}

export function deactivate () { }
