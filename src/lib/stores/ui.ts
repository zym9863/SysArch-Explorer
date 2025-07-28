import { writable } from 'svelte/store';
import type { UIState } from '$lib/types/system';

// 全局UI状态管理
export const uiState = writable<UIState>({
  viewMode: {
    current: 'hierarchy',
    hierarchyView: 'overview',
    simulatorView: 'editor'
  },
  selectedLayer: null,
  selectedInstruction: null,
  sidebarOpen: true,
  darkMode: false,
  language: 'zh'
});
