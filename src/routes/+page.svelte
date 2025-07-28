<script lang="ts">
  import Navigation from '$lib/components/Navigation.svelte';
  import HierarchyView from '$lib/components/SystemHierarchy/HierarchyView.svelte';
  import SimulatorView from '$lib/components/InstructionSimulator/SimulatorView.svelte';
  import { uiState } from '$lib/stores/ui';

  // 使用 $derived 替代 $:
  let currentView = $derived($uiState.viewMode.current);
</script>

<div class="flex flex-col h-screen">
  <!-- 导航栏 -->
  <Navigation />

  <!-- 主内容区域 -->
  <main class="flex-1 overflow-hidden">
    {#if currentView === 'hierarchy'}
      <HierarchyView />
    {:else if currentView === 'simulator'}
      <SimulatorView />
    {/if}
  </main>
</div>


