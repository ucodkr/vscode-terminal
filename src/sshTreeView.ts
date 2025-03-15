import * as vscode from 'vscode';
import { loadServers, addServer, removeServer } from './serverData';

export class SSHTreeProvider implements vscode.TreeDataProvider<ServerItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<ServerItem | undefined | void> = new vscode.EventEmitter<ServerItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<ServerItem | undefined | void> = this._onDidChangeTreeData.event;

    getTreeItem (element: ServerItem): vscode.TreeItem {
        return element;
    }

    getChildren (): ServerItem[] {

        const list = loadServers().map(server => new ServerItem(server.name, server.user, server.host));

        return list;
    }

    refresh (): void {
        this._onDidChangeTreeData.fire();
    }
}

class ServerItem extends vscode.TreeItem {
    constructor(
        public readonly name: string,
        public readonly user: string,
        public readonly host: string
    ) {
        super(name, vscode.TreeItemCollapsibleState.None);
        this.contextValue = 'server';  // 👈 각 서버가 "server"로 인식됨
        this.iconPath = {
            light: vscode.Uri.file('/resources/ssh-icon-light.svg'),
            dark: vscode.Uri.file('/resources/ssh-icon-dark.svg')
        }; // 아이콘 경로 설정
        // this.command = {
        //     command: 'extension.openSSH',
        //     title: 'Connect to SSH',
        //     arguments: [{ name, user, host }]
        // };
    }
}

// 그룹 아이템을 추가하기 위한 예시
class GroupItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly children: vscode.TreeItem[] = []
    ) {
        super(label, vscode.TreeItemCollapsibleState.Collapsed);

        this.iconPath = {
            light: vscode.Uri.file('/resources/group-icon-light.svg'),
            dark: vscode.Uri.file('/resources/group-icon-dark.svg')
        }; // 그룹 아이콘 설정
    }
}