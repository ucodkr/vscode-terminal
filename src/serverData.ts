import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

const serversFilePath = path.join(__dirname, '..', 'servers.json');

// 서버 목록을 불러오는 함수
export function loadServers (): any[] {
    if (!fs.existsSync(serversFilePath)) {
        fs.writeFileSync(serversFilePath, JSON.stringify([], null, 2));
    }
    const rawData = fs.readFileSync(serversFilePath, 'utf-8');
    return JSON.parse(rawData);
}

// 서버 목록을 저장하는 함수
export function saveServers (servers: any[]) {
    fs.writeFileSync(serversFilePath, JSON.stringify(servers, null, 2));
}

// 서버 추가 함수
export function addServer (name: string, user: string, host: string) {
    const servers = loadServers();
    servers.push({ name, user, host });
    saveServers(servers);
}

// 서버 삭제 함수
export function removeServer (name: string) {
    let servers = loadServers();
    servers = servers.filter(server => server.name !== name);
    saveServers(servers);
}
