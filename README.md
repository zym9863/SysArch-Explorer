# SysArch Explorer

[English](./README_EN.md) | 中文

一个基于 Tauri + SvelteKit + TypeScript 构建的系统架构探索工具。

## 项目简介

SysArch Explorer 是一个用于探索和可视化系统架构的桌面应用程序，使用现代化的技术栈构建。

## 技术栈

- **前端**: SvelteKit + TypeScript + Tailwind CSS
- **后端**: Rust (Tauri)
- **构建工具**: Vite

## 推荐的 IDE 设置

[VS Code](https://code.visualstudio.com/) + [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## 开发环境

确保已安装以下依赖：
- Node.js (推荐 18+ 版本)
- Rust
- pnpm

## 快速开始

1. 克隆项目
```bash
git clone https://github.com/zym9863/SysArch-Explorer.git
cd SysArch Explorer
```

2. 安装依赖
```bash
pnpm install
```

3. 启动开发环境
```bash
pnpm tauri dev
```

## 构建

```bash
pnpm tauri build
```
