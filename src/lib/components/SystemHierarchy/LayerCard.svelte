<script lang="ts">
  import { ChevronRight } from 'lucide-svelte';
  import type { SystemLayer } from '$lib/types/system';

  interface Props {
    layer: SystemLayer;
    onclick?: () => void;
  }

  let { layer, onclick }: Props = $props();
</script>

<div
  class="card card-hover p-6 hover:shadow-md transition-all duration-300 cursor-pointer group fade-in"
  onclick={onclick}
  role="button"
  tabindex="0"
  onkeydown={(e) => e.key === 'Enter' && onclick?.()}
>
  <div class="flex items-center justify-between">
    <div class="flex items-center space-x-4">
      <!-- 层级指示器 -->
      <div class="flex flex-col items-center">
        <div 
          class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
          style="background-color: {layer.color}"
        >
          {layer.level}
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Level {layer.level}
        </div>
      </div>

      <!-- 层级信息 -->
      <div class="flex-1">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">
          {layer.name}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {layer.nameEn}
        </p>
        <p class="text-gray-600 dark:text-gray-300 line-clamp-2">
          {layer.description}
        </p>
      </div>
    </div>

    <!-- 箭头指示器 -->
    <div class="flex items-center space-x-4">
      <div class="text-right">
        <div class="text-sm text-gray-500 dark:text-gray-400">
          {layer.concepts.length} 个概念
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400">
          {layer.examples.length} 个示例
        </div>
      </div>
      <ChevronRight class="w-6 h-6 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200" />
    </div>
  </div>

  <!-- 示例预览 -->
  <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
    <div class="flex flex-wrap gap-2">
      {#each layer.examples.slice(0, 4) as example}
        <span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full">
          {example}
        </span>
      {/each}
      {#if layer.examples.length > 4}
        <span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm rounded-full">
          +{layer.examples.length - 4} 更多
        </span>
      {/if}
    </div>
  </div>
</div>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
