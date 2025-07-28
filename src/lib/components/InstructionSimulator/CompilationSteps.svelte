<script lang="ts">
  import { ChevronRight, CheckCircle, Clock, AlertCircle } from 'lucide-svelte';
  import { compilationStages } from '$lib/stores/simulator';
  import LoadingSpinner from '../common/LoadingSpinner.svelte';

  // 使用全局编译阶段状态
  let compilationSteps = $derived($compilationStages);


  function getStatusIcon(status: string) {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'in-progress':
        return Clock;
      case 'pending':
        return AlertCircle;
      default:
        return AlertCircle;
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'in-progress':
        return 'text-blue-600';
      case 'pending':
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  }
</script>

<div class="h-full overflow-auto p-6">
  <div class="max-w-6xl mx-auto">
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        编译过程可视化
      </h2>
      <p class="text-gray-600 dark:text-gray-400">
        从源代码到目标代码的完整编译流程
      </p>
    </div>

    <!-- 编译步骤流程图 -->
    <div class="space-y-6">
      {#each compilationSteps as step, index}
        <div class="relative">
          <!-- 连接线 -->
          {#if index < compilationSteps.length - 1}
            <div class="absolute left-6 top-20 w-0.5 h-16 bg-gray-300 dark:bg-gray-600"></div>
          {/if}

          <!-- 步骤卡片 -->
          <div class="card p-6 slide-up {step.status === 'in-progress' ? 'ring-2 ring-blue-500 pulse-glow' : ''} {step.status === 'completed' ? 'border-green-200 dark:border-green-700' : ''}">
            <div class="flex items-start space-x-4">
              <!-- 状态图标 -->
              <div class="flex-shrink-0">
                <div class="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  {#if step.status === 'completed'}
                    <CheckCircle class="w-6 h-6 text-green-600 bounce-in" />
                  {:else if step.status === 'in-progress'}
                    <LoadingSpinner size="sm" color="primary" />
                  {:else}
                    <AlertCircle class="w-6 h-6 text-gray-400" />
                  {/if}
                </div>
              </div>

              <!-- 步骤内容 -->
              <div class="flex-1">
                <div class="flex items-center justify-between mb-2">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                      {step.stage}
                    </h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {step.stageEn}
                    </p>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-medium {getStatusColor(step.status)}">
                      {step.status === 'completed' ? '已完成' : 
                       step.status === 'in-progress' ? '进行中' : '等待中'}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      {step.duration}
                    </div>
                  </div>
                </div>

                <p class="text-gray-600 dark:text-gray-300 mb-4">
                  {step.description}
                </p>

                <!-- 输入输出 -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      输入
                    </h4>
                    <div class="bg-gray-50 dark:bg-gray-700 rounded p-3">
                      <code class="text-xs text-gray-700 dark:text-gray-300 break-all">
                        {step.input}
                      </code>
                    </div>
                  </div>
                  <div>
                    <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      输出
                    </h4>
                    <div class="bg-gray-50 dark:bg-gray-700 rounded p-3">
                      <code class="text-xs text-gray-700 dark:text-gray-300 break-all">
                        {step.output}
                      </code>
                    </div>
                  </div>
                </div>

                <!-- 详细步骤 -->
                <div>
                  <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    详细步骤
                  </h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {#each step.details as detail}
                      <div class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <ChevronRight class="w-3 h-3" />
                        <span>{detail}</span>
                      </div>
                    {/each}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>

    <!-- 编译统计 -->
    <div class="mt-8 card p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        编译统计
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">
            {compilationSteps.filter(s => s.status === 'completed').length}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">已完成步骤</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">
            {compilationSteps.filter(s => s.status === 'in-progress').length}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">进行中步骤</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-gray-400">
            {compilationSteps.filter(s => s.status === 'pending').length}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">等待中步骤</div>
        </div>
      </div>
    </div>
  </div>
</div>
