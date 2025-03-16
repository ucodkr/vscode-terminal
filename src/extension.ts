import * as vscode from 'vscode';
import { SSHTreeProvider } from './sshTreeView';
import { addServer, loadServers, removeServer, getConfigFile, CONFIG_FILE, updateServer } from './store';



const PROMPT_NAME = "Enter Display Name";
const PROMPT_CONNECTION = "Enter Connection String";
export function activate (context: vscode.ExtensionContext) {
	const sshTreeProvider = new SSHTreeProvider(context);

	vscode.window.registerTreeDataProvider('sshServers', sshTreeProvider);

	// SSH 서버에 연결
	context.subscriptions.push(vscode.commands.registerCommand('extension.openSSH', async (server) => {
		const terminal = vscode.window.createTerminal({
			name: `${server.name}`,
			location: vscode.TerminalLocation.Editor
		});

		terminal.show();
		terminal.sendText(`ssh ${server.connection}`);
	}));

	// 서버 추가
	context.subscriptions.push(vscode.commands.registerCommand('extension.addServer', async () => {
		const name = await vscode.window.showInputBox({
			placeHolder: "user@ucod.kr", prompt: PROMPT_NAME,
		});
		const connect = await vscode.window.showInputBox({
			placeHolder: "user@ucod.kr", prompt: PROMPT_CONNECTION, value: name
		});



		if (name && connect) {
			addServer(context, name, connect);
			sshTreeProvider.refresh();
		}
	}));

	// 서버 삭제
	context.subscriptions.push(vscode.commands.registerCommand('extension.removeServer', async (server) => {
		const confirm = await vscode.window.showWarningMessage(`Delete Connetion ${server.name}?`, 'Yes', 'No');
		if (confirm === 'Yes') {
			removeServer(context, server.name);
			sshTreeProvider.refresh();
		}
	}));
	//
	context.subscriptions.push(vscode.commands.registerCommand('extension.openConfigFile', () => {
		const settingsPath = vscode.Uri.file(getConfigFile(context, CONFIG_FILE)); // 설정 파일 경로 수정
		vscode.workspace.openTextDocument(settingsPath).then(doc => {
			vscode.window.showTextDocument(doc);
		});
	}));

	//
	context.subscriptions.push(vscode.commands.registerCommand('extension.refreshServers', () => {
		loadServers(context);  // 서버 목록 새로 고침
		sshTreeProvider.refresh();
	}));

	//
	context.subscriptions.push(vscode.commands.registerCommand('extension.edit', async (server, index) => {

		const name =
			await vscode.window.showInputBox({ prompt: PROMPT_NAME, value: server.name });

		const connection = await vscode.window.showInputBox({ placeHolder: "user@ucod.kr", prompt: PROMPT_CONNECTION, value: server.connection });


		if (name && connection) {
			updateServer(context, server, { name: name, connection: connection });
			sshTreeProvider.refresh();
		}
	}));


}

export function deactivate () { }
