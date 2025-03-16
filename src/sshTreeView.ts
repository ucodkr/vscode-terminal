import * as vscode from 'vscode';
import { loadServers, addServer, removeServer } from './store';

export class SSHTreeProvider implements vscode.TreeDataProvider<ServerItem> {
    private context: vscode.ExtensionContext;

    private _onDidChangeTreeData: vscode.EventEmitter<ServerItem | undefined | void> = new vscode.EventEmitter<ServerItem | undefined | void>();

    readonly onDidChangeTreeData: vscode.Event<ServerItem | undefined | void> = this._onDidChangeTreeData.event;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }


    getTreeItem (element: ServerItem): vscode.TreeItem {
        return element;
    }

    getChildren (parent?: ServerItem): ServerItem[] {
        console.log(parent);
        if (parent) {
            return parent.children;
        }
        let list = loadServers(this.context).map(server => new ServerItem(server.name, server.connection));
        list.map((item: ServerItem) => {
            return item.children = [new ServerItem("a", "b")];
        });
        console.log(list);
        return list;
    }

    refresh (): void {
        this.getChildren();
        this._onDidChangeTreeData.fire();
    }
}

class ServerItem extends vscode.TreeItem {
    constructor(
        public readonly name: string,
        public readonly connection: string,
        public children: ServerItem[] = []
    ) {

        super(name, children && children.length >= 0 ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None);
        this.contextValue = 'server';  // 👈 각 서버가 "server"로 인식됨
        this.iconPath = new vscode.ThemeIcon('terminal');
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

        this.iconPath = new vscode.ThemeIcon('terminal');
    }
}