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

<div class="flex h-full">
  <!-- 主内容区域 -->
  <div class="flex-1 overflow-auto">
    {#if $uiState.viewMode.hierarchyView === 'overview'}
      <!-- 层次结构概览 -->
      <div class="p-6">
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            计算机系统层次结构
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
            {hierarchyData.description}
          </p>
        </div>

        <!-- 层次结构可视化 -->
        <div class="space-y-4">
          {#each hierarchyData.layers as layer (layer.id)}
            <LayerCard 
              {layer} 
              onclick={() => selectLayer(layer)}
            />
          {/each}
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
    <div class="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        导航
      </h3>
      
      <div class="space-y-2">
        {#each hierarchyData.layers as layer (layer.id)}
          <button
            class="w-full text-left p-3 rounded-lg transition-colors duration-200 {layer.id === $uiState.selectedLayer 
              ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'}"
            onclick={() => selectLayer(layer)}
          >
            <div class="flex items-center space-x-3">
              <div 
                class="w-4 h-4 rounded-full"
                style="background-color: {layer.color}"
              ></div>
              <div>
                <div class="font-medium">{layer.name}</div>
                <div class="text-sm opacity-75">{layer.nameEn}</div>
              </div>
            </div>
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>
