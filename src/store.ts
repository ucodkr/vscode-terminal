import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export const CONFIG_FILE = "ucod.connect.json";

export const getConfigFile = (context: vscode.ExtensionContext, filename: string) => {
    const filePath = path.join(context.globalStorageUri.fsPath, filename);
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(context.globalStorageUri.fsPath, { recursive: true });
        fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    }
    return filePath;
};

// 서버 목록을 불러오는 함수
export function loadServers (context: vscode.ExtensionContext): any[] {
    const filePath = getConfigFile(context, CONFIG_FILE);
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData);
}
// 서버 목록을 저장하는 함수
export function saveServers (context: vscode.ExtensionContext, servers: any[]) {
    const filePath = getConfigFile(context, CONFIG_FILE);
    fs.writeFileSync(filePath, JSON.stringify(servers, null, 2));
}

// 서버 추가 함수
export function addServer (context: vscode.ExtensionContext,
    name: string, connection: string) {
    const servers = loadServers(context);
    servers.push({ name, connection });
    saveServers(context, servers);
}
export function updateServer (context: vscode.ExtensionContext,
    org: any, target: any) {
    const servers = loadServers(context);

    const newList = servers.map(data => {
        if (org.name === data.name && org.connection === data.connection) {
            return target;
        } else {
            return data;
        }
    });

    saveServers(context, newList);
}

// 서버 삭제 함수
export function removeServer (context: vscode.ExtensionContext, name: string) {
    let servers = loadServers(context);
    servers = servers.filter(server => server.name !== name);
    saveServers(context, servers);
}
