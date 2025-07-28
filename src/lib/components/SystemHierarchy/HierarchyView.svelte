<script lang="ts">
  import { hierarchyData } from '$lib/data/hierarchy';
  import LayerCard from './LayerCard.svelte';
  import LayerDetail from './LayerDetail.svelte';
  import { uiState } from '$lib/stores/ui';
  import type { SystemLayer } from '$lib/types/system';

  let selectedLayer = $state<SystemLayer | null>(null);

  // 监听选中的层级变化
  $effect(() => {
    const layerId = $uiState.selectedLayer;
    if (layerId) {
      selectedLayer = hierarchyData.layers.find(layer => layer.id === layerId) || null;
    } else {
      selectedLayer = null;
    }
  });

  function selectLayer(layer: SystemLayer) {
    uiState.update(state => ({
      ...state,
      selectedLayer: layer.id,
      viewMode: { ...state.viewMode, hierarchyView: 'detail' }
    }));
  }

  function backToOverview() {
    uiState.update(state => ({
      ...state,
      selectedLayer: null,
      viewMode: { ...state.viewMode, hierarchyView: 'overview' }
    }));
  }
</script>

<div class="flex flex-col lg:flex-row h-full">
  <!-- 主内容区域 -->
  <div class="flex-1 overflow-auto">
    {#if $uiState.viewMode.hierarchyView === 'overview'}
      <!-- 层次结构概览 -->
      <div class="p-4 sm:p-6 lg:p-8 relative">
        <!-- 背景装饰 -->
        <div class="absolute inset-0 bg-gradient-to-br from-primary-50/30 via-transparent to-accent-50/30 dark:from-primary-950/30 dark:to-accent-950/30"></div>
        <div class="absolute top-20 right-20 w-32 h-32 bg-primary-400/5 rounded-full blur-3xl animate-float hidden lg:block"></div>
        <div class="absolute bottom-20 left-20 w-24 h-24 bg-accent-400/5 rounded-full blur-2xl animate-float hidden lg:block" style="animation-delay: 2s;"></div>
        
        <div class="relative">
          <!-- 标题区域 -->
          <div class="mb-8 lg:mb-12 text-center fade-in-down">
            <div class="inline-flex items-center space-x-2 lg:space-x-3 mb-4">
              <div class="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
              <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gradient-primary">
                计算机系统层次结构
              </h2>
              <div class="w-2 h-2 bg-accent-500 rounded-full animate-pulse" style="animation-delay: 0.5s;"></div>
            </div>
            <p class="text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed px-4">
              {hierarchyData.description}
            </p>
            
            <!-- 装饰性统计信息 -->
            <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-8 mt-6 lg:mt-8 scale-in" style="animation-delay: 300ms;">
              <div class="text-center">
                <div class="text-xl lg:text-2xl font-bold text-primary-600 dark:text-primary-400">{hierarchyData.layers.length}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">个系统层级</div>
              </div>
              <div class="hidden sm:block w-px h-12 bg-gray-300 dark:bg-gray-600"></div>
              <div class="text-center">
                <div class="text-xl lg:text-2xl font-bold text-accent-600 dark:text-accent-400">
                  {hierarchyData.layers.reduce((sum, layer) => sum + layer.concepts.length, 0)}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">个核心概念</div>
              </div>
              <div class="hidden sm:block w-px h-12 bg-gray-300 dark:bg-gray-600"></div>
              <div class="text-center">
                <div class="text-xl lg:text-2xl font-bold text-success-600 dark:text-success-400">
                  {hierarchyData.layers.reduce((sum, layer) => sum + layer.examples.length, 0)}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">个实例示例</div>
              </div>
            </div>
          </div>

          <!-- 层次结构可视化 -->
          <div class="space-y-4 lg:space-y-6 max-w-7xl mx-auto">
            {#each hierarchyData.layers as layer, index (layer.id)}
              <div class="fade-in-up" style="animation-delay: {(index + 1) * 150}ms;">
                <LayerCard 
                  {layer} 
                  onclick={() => selectLayer(layer)}
                />
              </div>
            {/each}
          </div>

          <!-- 底部提示 -->
          <div class="mt-12 lg:mt-16 text-center fade-in" style="animation-delay: 1000ms;">
            <div class="inline-flex items-center space-x-2 px-4 lg:px-6 py-3 bg-white/50 dark:bg-gray-800/50 rounded-2xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-soft">
              <div class="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
              <span class="text-sm text-gray-600 dark:text-gray-400 font-medium">点击任意层级卡片查看详细信息</span>
              <div class="w-2 h-2 bg-accent-500 rounded-full animate-bounce" style="animation-delay: 0.2s;"></div>
            </div>
          </div>
        </div>
      </div>
    {:else if $uiState.viewMode.hierarchyView === 'detail' && selectedLayer}
      <!-- 层级详情 -->
      <LayerDetail 
        layer={selectedLayer} 
        onBack={backToOverview}
      />
    {/if}
  </div>

  <!-- 侧边栏 -->
  {#if $uiState.sidebarOpen}
    <div class="w-full lg:w-88 glass-strong border-t lg:border-t-0 lg:border-l border-white/20 dark:border-gray-700/20 p-4 lg:p-6 relative overflow-hidden slide-in-right">
      <!-- 背景装饰 -->
      <div class="absolute inset-0 bg-gradient-to-b from-primary-500/3 via-transparent to-accent-500/3"></div>
      <div class="absolute -top-10 -right-10 w-20 h-20 bg-accent-400/10 rounded-full blur-2xl animate-pulse-slow"></div>
      
      <div class="relative">
        <!-- 标题区域 -->
        <div class="mb-6 pb-4 border-b border-gray-200/30 dark:border-gray-700/30">
          <h3 class="text-lg font-bold text-gradient-primary mb-2">
            导航
          </h3>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            点击层级快速跳转
          </p>
        </div>
        
        <!-- 层级导航 -->
        <div class="space-y-2 max-h-96 lg:max-h-none overflow-y-auto hide-scrollbar">
          {#each hierarchyData.layers as layer, index (layer.id)}
            <button
              class="w-full group relative overflow-hidden transition-all duration-300 {layer.id === $uiState.selectedLayer 
                ? 'scale-105' 
                : 'hover:scale-[1.02]'}"
              onclick={() => selectLayer(layer)}
              style="animation-delay: {index * 100}ms"
            >
              <!-- 背景和状态指示 -->
              <div class="absolute inset-0 rounded-2xl transition-all duration-300 {layer.id === $uiState.selectedLayer 
                ? 'bg-gradient-to-r from-primary-500/20 to-primary-600/20 shadow-lg shadow-primary-500/25' 
                : 'bg-white/30 dark:bg-gray-800/30 group-hover:bg-primary-50/50 dark:group-hover:bg-primary-900/20'} backdrop-blur-sm">
              </div>
              
              <!-- 左侧彩色指示条 -->
              <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full transition-all duration-300 {layer.id === $uiState.selectedLayer 
                ? 'bg-gradient-to-b from-primary-500 to-primary-600 shadow-lg' 
                : 'bg-gray-300 dark:bg-gray-600 group-hover:bg-primary-400'} {layer.id === $uiState.selectedLayer ? 'scale-y-125' : 'group-hover:scale-y-110'}">
              </div>

              <div class="relative flex items-center space-x-3 lg:space-x-4 p-3 lg:p-4 pl-4 lg:pl-6">
                <!-- 层级圆圈 -->
                <div class="relative flex-shrink-0">
                  <div class="absolute inset-0 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"
                       style="background-color: {layer.color}"></div>
                  <div 
                    class="relative w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg transition-transform duration-300 group-hover:scale-110"
                    style="background: linear-gradient(135deg, {layer.color}, {layer.color}dd)"
                  >
                    {layer.level}
                  </div>
                </div>
                
                <!-- 层级信息 -->
                <div class="flex-1 text-left min-w-0">
                  <div class="font-semibold text-gray-900 dark:text-white mb-0.5 transition-colors duration-300 {layer.id === $uiState.selectedLayer 
                    ? 'text-primary-700 dark:text-primary-300' 
                    : 'group-hover:text-primary-600 dark:group-hover:text-primary-400'} truncate text-sm lg:text-base">
                    {layer.name}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 opacity-75 group-hover:opacity-100 transition-opacity duration-200 truncate">
                    {layer.nameEn}
                  </div>
                </div>

                <!-- 状态指示器 -->
                {#if layer.id === $uiState.selectedLayer}
                  <div class="flex-shrink-0">
                    <div class="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                  </div>
                {:else}
                  <div class="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div class="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  </div>
                {/if}
              </div>

              <!-- 底部微光效果 -->
              {#if layer.id === $uiState.selectedLayer}
                <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent"></div>
              {/if}
            </button>
          {/each}
        </div>

        <!-- 底部统计信息 -->
        <div class="mt-6 lg:mt-8 pt-4 lg:pt-6 border-t border-gray-200/30 dark:border-gray-700/30">
          <div class="text-center">
            <div class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              系统层级总览
            </div>
            <div class="flex flex-col sm:flex-row lg:flex-col xl:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 lg:space-y-2 lg:space-x-0 xl:space-y-0 xl:space-x-4 text-xs">
              <div class="flex items-center justify-center space-x-1">
                <div class="w-2 h-2 bg-primary-500 rounded-full"></div>
                <span class="text-gray-500 dark:text-gray-400">{hierarchyData.layers.length} 个层级</span>
              </div>
              <div class="flex items-center justify-center space-x-1">
                <div class="w-2 h-2 bg-accent-500 rounded-full"></div>
                <span class="text-gray-500 dark:text-gray-400">
                  {hierarchyData.layers.reduce((sum, layer) => sum + layer.concepts.length, 0)} 个概念
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
