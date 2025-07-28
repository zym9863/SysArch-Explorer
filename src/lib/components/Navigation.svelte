<script lang="ts">
  import { Monitor, Cpu, Settings, Moon, Sun } from 'lucide-svelte';
  import { uiState } from '$lib/stores/ui';

  function switchToHierarchy() {
    uiState.update(state => ({
      ...state,
      viewMode: { ...state.viewMode, current: 'hierarchy' }
    }));
  }

  function switchToSimulator() {
    uiState.update(state => ({
      ...state,
      viewMode: { ...state.viewMode, current: 'simulator' }
    }));
  }

  function toggleDarkMode() {
    uiState.update(state => ({
      ...state,
      darkMode: !state.darkMode
    }));
  }

  function toggleSidebar() {
    uiState.update(state => ({
      ...state,
      sidebarOpen: !state.sidebarOpen
    }));
  }
</script>

<nav class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
  <div class="flex items-center justify-between">
    <!-- 左侧：Logo和标题 -->
    <div class="flex items-center space-x-4">
      <div class="flex items-center space-x-2">
        <Cpu class="w-8 h-8 text-primary-600" />
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">
          系统架构浏览器
        </h1>
      </div>
    </div>

    <!-- 中间：主导航 -->
    <div class="flex items-center space-x-1">
      <button
        class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 {$uiState.viewMode.current === 'hierarchy' 
          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
          : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'}"
        onclick={switchToHierarchy}
      >
        <Monitor class="w-5 h-5" />
        <span class="font-medium">层次结构</span>
      </button>
      
      <button
        class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 {$uiState.viewMode.current === 'simulator' 
          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
          : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'}"
        onclick={switchToSimulator}
      >
        <Cpu class="w-5 h-5" />
        <span class="font-medium">指令模拟器</span>
      </button>
    </div>

    <!-- 右侧：控制按钮 -->
    <div class="flex items-center space-x-2">
      <!-- 侧边栏切换 -->
      <button
        class="p-2 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        onclick={toggleSidebar}
        title="切换侧边栏"
      >
        <Settings class="w-5 h-5" />
      </button>

      <!-- 深色模式切换 -->
      <button
        class="p-2 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        onclick={toggleDarkMode}
        title="切换深色模式"
      >
        {#if $uiState.darkMode}
          <Sun class="w-5 h-5" />
        {:else}
          <Moon class="w-5 h-5" />
        {/if}
      </button>
    </div>
  </div>
</nav>
