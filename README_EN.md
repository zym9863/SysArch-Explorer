# SysArch Explorer

English | [中文](./README.md)

A system architecture exploration tool built with Tauri + SvelteKit + TypeScript.

## Project Overview

SysArch Explorer is a desktop application for exploring and visualizing system architectures, built with modern technology stack.

## Technology Stack

- **Frontend**: SvelteKit + TypeScript + Tailwind CSS
- **Backend**: Rust (Tauri)
- **Build Tool**: Vite

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Development Environment

Make sure the following dependencies are installed:
- Node.js (18+ recommended)
- Rust
- pnpm

## Quick Start

1. Clone the project
```bash
git clone https://github.com/zym9863/SysArch-Explorer.git
cd SysArch Explorer
```

2. Install dependencies
```bash
pnpm install
```

3. Start development environment
```bash
pnpm tauri dev
```

## Build

```bash
pnpm tauri build
```