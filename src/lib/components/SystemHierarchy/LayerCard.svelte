<script lang="ts">
  import { ChevronRight, Layers, Code, Zap, Database, Activity, Wifi } from 'lucide-svelte';
  import type { SystemLayer } from '$lib/types/system';

  interface Props {
    layer: SystemLayer;
    onclick?: () => void;
  }

  let { layer, onclick }: Props = $props();

  // 根据层级选择合适的图标
  function getLayerIcon(level: number) {
    switch(level) {
      case 1: return Activity;    // 应用层
      case 2: return Code;        // 算法层
      case 3: return Layers;      // 编程语言层
      case 4: return Database;    // 系统软件层
      case 5: return Zap;         // 指令集架构层
      case 6: return Wifi;        // 微架构层
      default: return Activity;
    }
  }

  const IconComponent = getLayerIcon(layer.level);

  // 根据层级选择渐变色
  function getGradientColors(level: number) {
    const gradients = [
      'from-red-500 to-red-600',      // Level 1
      'from-orange-500 to-orange-600', // Level 2
      'from-yellow-500 to-yellow-600', // Level 3
      'from-green-500 to-green-600',   // Level 4
      'from-blue-500 to-blue-600',     // Level 5
      'from-purple-500 to-purple-600', // Level 6
    ];
    return gradients[level - 1] || gradients[0];
  }

  const gradientClass = getGradientColors(layer.level);
</script>

<div
  class="group card card-interactive p-0 overflow-hidden relative fade-in-up hover:shadow-glow"
  onclick={onclick}
  role="button"
  tabindex="0"
  onkeydown={(e) => e.key === 'Enter' && onclick?.()}
  style="animation-delay: {layer.level * 100}ms"
>
  <!-- 背景装饰 -->
  <div class="absolute inset-0 bg-gradient-to-br {gradientClass} opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
  <div class="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br {gradientClass} opacity-5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>

  <!-- 顶部彩色条 -->
  <div class="h-1.5 bg-gradient-to-r {gradientClass}"></div>

  <div class="p-4 lg:p-6 relative">
    <div class="flex flex-col lg:flex-row lg:items-start justify-between mb-4">
      <div class="flex items-start space-x-3 lg:space-x-4 flex-1 mb-4 lg:mb-0">
        <!-- 层级指示器和图标 -->
        <div class="flex flex-col items-center space-y-2 lg:space-y-3 flex-shrink-0">
          <!-- 层级数字 -->
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-r {gradientClass} rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div class="relative w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-r {gradientClass} rounded-2xl flex items-center justify-center text-white font-bold text-base lg:text-lg shadow-lg">
              {layer.level}
            </div>
          </div>
          
          <!-- 图标 -->
          <div class="p-2 lg:p-2.5 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-sm backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
            <svelte:component this={IconComponent} class="w-4 h-4 lg:w-5 lg:h-5 text-gray-600 dark:text-gray-400 group-hover:text-{layer.color.split('-')[0]}-500 transition-colors duration-300" />
          </div>
          
          <!-- 层级标签 -->
          <div class="text-xs text-gray-500 dark:text-gray-400 font-medium bg-gray-100/80 dark:bg-gray-800/80 px-2 py-1 rounded-full backdrop-blur-sm">
            Level {layer.level}
          </div>
        </div>

        <!-- 层级信息 -->
        <div class="flex-1 min-w-0">
          <div class="mb-3">
            <h3 class="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-gradient-primary transition-all duration-300">
              {layer.name}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {layer.nameEn}
            </p>
          </div>
          
          <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-4 line-clamp-2 text-sm lg:text-base">
            {layer.description}
          </p>

          <!-- 统计信息 -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm">
            <div class="flex items-center space-x-1.5">
              <div class="w-2 h-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"></div>
              <span class="text-gray-600 dark:text-gray-400">{layer.concepts.length} 个概念</span>
            </div>
            <div class="flex items-center space-x-1.5">
              <div class="w-2 h-2 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full"></div>
              <span class="text-gray-600 dark:text-gray-400">{layer.examples.length} 个示例</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 箭头指示器 -->
      <div class="flex lg:items-center justify-center w-full lg:w-10 h-10 lg:ml-4">
        <div class="relative">
          <div class="absolute inset-0 bg-primary-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping"></div>
          <ChevronRight class="relative w-5 h-5 lg:w-6 lg:h-6 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-300 mx-auto lg:mx-0" />
        </div>
      </div>
    </div>

    <!-- 示例预览 -->
    <div class="pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
      <div class="flex flex-wrap gap-2">
        {#each layer.examples.slice(0, 4) as example, index}
          <span 
            class="inline-flex items-center px-2.5 lg:px-3 py-1 lg:py-1.5 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-300 text-xs lg:text-sm font-medium rounded-full transition-all duration-300 hover:from-primary-100 hover:to-primary-200 dark:hover:from-primary-900/30 dark:hover:to-primary-800/30 hover:text-primary-700 dark:hover:text-primary-300 scale-in"
            style="animation-delay: {(layer.level * 100) + (index * 50)}ms"
          >
            {example}
          </span>
        {/each}
        {#if layer.examples.length > 4}
          <span class="inline-flex items-center px-2.5 lg:px-3 py-1 lg:py-1.5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 text-gray-500 dark:text-gray-400 text-xs lg:text-sm font-medium rounded-full border border-dashed border-gray-300 dark:border-gray-600">
            +{layer.examples.length - 4} 更多
          </span>
        {/if}
      </div>
    </div>
  </div>

  <!-- 底部发光效果 -->
  <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r {gradientClass} opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
</div>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
