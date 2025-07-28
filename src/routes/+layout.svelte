<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { uiState } from '$lib/stores/ui';

  let mounted = false;

  onMount(() => {
    mounted = true;
    // 检测系统主题偏好
    if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      uiState.update(state => ({ ...state, darkMode: prefersDark }));
    }
  });

  // 响应式主题切换
  $: if (mounted && typeof document !== 'undefined') {
    if ($uiState.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
</script>

<svelte:head>
  <meta name="theme-color" content={$uiState.darkMode ? '#1f2937' : '#ffffff'} />
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
  <slot />
</div>

<style>
  :global(html) {
    scroll-behavior: smooth;
  }
  
  :global(body) {
    font-feature-settings: 'rlig' 1, 'calt' 1;
  }
</style>
