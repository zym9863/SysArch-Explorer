<script lang="ts">
  import { Monitor, Cpu, Settings, Moon, Sun, Sparkles } from 'lucide-svelte';
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

<nav class="glass-strong border-b border-white/20 dark:border-gray-700/20 px-4 sm:px-6 py-4 relative overflow-hidden">
  <!-- 背景装饰 -->
  <div class="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-accent-500/5 to-primary-500/5 animate-pulse-slow"></div>
  <div class="absolute -top-10 -right-10 w-20 h-20 bg-primary-400/10 rounded-full blur-xl animate-float"></div>
  <div class="absolute -bottom-5 -left-5 w-16 h-16 bg-accent-400/10 rounded-full blur-lg animate-float" style="animation-delay: 1s;"></div>
  
  <div class="relative flex items-center justify-between">
    <!-- 左侧：Logo和标题 -->
    <div class="flex items-center space-x-2 sm:space-x-4">
      <div class="flex items-center space-x-2 sm:space-x-3 group">
        <div class="relative">
          <div class="absolute inset-0 bg-primary-500/20 rounded-2xl blur animate-pulse-glow"></div>
          <div class="relative bg-gradient-to-br from-primary-500 to-primary-700 p-2 sm:p-2.5 rounded-2xl shadow-lg">
            <Cpu class="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
        </div>
        <div class="space-y-0.5">
          <h1 class="text-lg sm:text-xl font-bold text-gradient-primary">
            <span class="hidden sm:inline">系统架构浏览器</span>
            <span class="sm:hidden">SysArch</span>
          </h1>
          <p class="text-xs text-gray-500 dark:text-gray-400 font-medium hidden sm:block">
            SysArch Explorer
          </p>
        </div>
      </div>
    </div>

    <!-- 中间：主导航 -->
    <div class="flex items-center space-x-1 sm:space-x-2 bg-white/50 dark:bg-gray-800/50 rounded-xl sm:rounded-2xl p-1 sm:p-1.5 backdrop-blur-sm border border-white/30 dark:border-gray-700/30">
      <button
        class="relative flex items-center space-x-1 sm:space-x-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-300 group {$uiState.viewMode.current === 'hierarchy' 
          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg transform scale-105' 
          : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-white/70 dark:hover:bg-gray-700/50'}"
        onclick={switchToHierarchy}
        aria-label="切换到层次结构视图"
        aria-pressed={$uiState.viewMode.current === 'hierarchy'}
      >
        {#if $uiState.viewMode.current === 'hierarchy'}
          <div class="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-primary-600/20 rounded-lg sm:rounded-xl blur animate-pulse-glow"></div>
        {/if}
        <div class="relative flex items-center space-x-1 sm:space-x-2">
          <Monitor class="w-4 h-4 sm:w-5 sm:h-5 {$uiState.viewMode.current === 'hierarchy' ? 'animate-bounce-in' : 'group-hover:scale-110'} transition-transform duration-200" />
          <span class="text-sm sm:text-base">
            <span class="hidden sm:inline">层次结构</span>
            <span class="sm:hidden">层次</span>
          </span>
        </div>
      </button>
      
      <button
        class="relative flex items-center space-x-1 sm:space-x-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-300 group {$uiState.viewMode.current === 'simulator' 
          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg transform scale-105' 
          : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-white/70 dark:hover:bg-gray-700/50'}"
        onclick={switchToSimulator}
        aria-label="切换到指令模拟器视图"
        aria-pressed={$uiState.viewMode.current === 'simulator'}
      >
        {#if $uiState.viewMode.current === 'simulator'}
          <div class="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-primary-600/20 rounded-lg sm:rounded-xl blur animate-pulse-glow"></div>
        {/if}
        <div class="relative flex items-center space-x-1 sm:space-x-2">
          <Cpu class="w-4 h-4 sm:w-5 sm:h-5 {$uiState.viewMode.current === 'simulator' ? 'animate-bounce-in' : 'group-hover:scale-110'} transition-transform duration-200" />
          <span class="text-sm sm:text-base">
            <span class="hidden sm:inline">指令模拟器</span>
            <span class="sm:hidden">模拟器</span>
          </span>
        </div>
      </button>
    </div>

    <!-- 右侧：控制按钮 -->
    <div class="flex items-center space-x-1 sm:space-x-2">
      <!-- 装饰元素 -->
      <div class="hidden lg:flex items-center space-x-2 px-3 py-2 bg-white/30 dark:bg-gray-800/30 rounded-xl backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
        <Sparkles class="w-4 h-4 text-primary-500 animate-pulse-slow" />
        <span class="text-xs text-gray-600 dark:text-gray-400 font-medium">现代化UI</span>
      </div>

      <!-- 侧边栏切换 -->
      <button
        class="relative p-2 sm:p-3 rounded-lg sm:rounded-xl text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-all duration-200 group hover:bg-white/50 dark:hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-transparent"
        onclick={toggleSidebar}
        title="切换侧边栏"
        aria-label="切换侧边栏"
        aria-expanded={$uiState.sidebarOpen}
      >
        <div class="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-primary-500/10 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        <Settings class="relative w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-300" />
      </button>

      <!-- 深色模式切换 -->
      <button
        class="relative p-2 sm:p-3 rounded-lg sm:rounded-xl text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-all duration-200 group hover:bg-white/50 dark:hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-transparent"
        onclick={toggleDarkMode}
        title="切换深色模式"
        aria-label={$uiState.darkMode ? '切换到浅色模式' : '切换到深色模式'}
      >
        <div class="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-primary-500/10 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        <div class="relative">
          {#if $uiState.darkMode}
            <Sun class="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-180 transition-transform duration-500" />
          {:else}
            <Moon class="w-4 h-4 sm:w-5 sm:h-5 group-hover:-rotate-12 transition-transform duration-300" />
          {/if}
        </div>
      </button>
    </div>
  </div>
</nav>
