<script lang="ts">
  import { ArrowLeft, BookOpen, Link, Code } from 'lucide-svelte';
  import type { SystemLayer } from '$lib/types/system';

  interface Props {
    layer: SystemLayer;
    onBack?: () => void;
  }

  let { layer, onBack }: Props = $props();
</script>

<div class="p-6">
  <!-- 返回按钮 -->
  <button
    class="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6 transition-colors duration-200"
    onclick={onBack}
  >
    <ArrowLeft class="w-5 h-5" />
    <span>返回概览</span>
  </button>

  <!-- 层级标题 -->
  <div class="mb-8">
    <div class="flex items-center space-x-4 mb-4">
      <div 
        class="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl"
        style="background-color: {layer.color}"
      >
        {layer.level}
      </div>
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          {layer.name}
        </h1>
        <p class="text-lg text-gray-500 dark:text-gray-400">
          {layer.nameEn}
        </p>
      </div>
    </div>
    <p class="text-lg text-gray-600 dark:text-gray-300 max-w-4xl">
      {layer.description}
    </p>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <!-- 核心概念 -->
    <div class="card p-6">
      <div class="flex items-center space-x-2 mb-4">
        <BookOpen class="w-6 h-6 text-primary-600" />
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          核心概念
        </h2>
      </div>
      <div class="space-y-4">
        {#each layer.concepts as concept}
          <div class="border-l-4 border-primary-500 pl-4">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
              {concept.name}
              <span class="text-sm text-gray-500 dark:text-gray-400 font-normal">
                ({concept.nameEn})
              </span>
            </h3>
            <p class="text-gray-600 dark:text-gray-300 mb-2">
              {concept.description}
            </p>
            {#if concept.examples.length > 0}
              <div class="flex flex-wrap gap-1">
                {#each concept.examples as example}
                  <span class="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs rounded">
                    {example}
                  </span>
                {/each}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>

    <!-- 层级接口 -->
    <div class="card p-6">
      <div class="flex items-center space-x-2 mb-4">
        <Link class="w-6 h-6 text-primary-600" />
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          层级接口
        </h2>
      </div>
      <div class="space-y-4">
        {#each layer.interfaces as interface_}
          <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold text-gray-900 dark:text-white">
                {interface_.name}
              </h3>
              <span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                {interface_.type === 'upward' ? '向上' : interface_.type === 'downward' ? '向下' : '双向'}
              </span>
            </div>
            <p class="text-gray-600 dark:text-gray-300 mb-2">
              {interface_.description}
            </p>
            {#if interface_.protocols.length > 0}
              <div class="flex flex-wrap gap-1">
                {#each interface_.protocols as protocol}
                  <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded">
                    {protocol}
                  </span>
                {/each}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- 实际示例 -->
  <div class="mt-8">
    <div class="card p-6">
      <div class="flex items-center space-x-2 mb-4">
        <Code class="w-6 h-6 text-primary-600" />
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          实际示例
        </h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each layer.examples as example}
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div class="font-medium text-gray-900 dark:text-white">
              {example}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
