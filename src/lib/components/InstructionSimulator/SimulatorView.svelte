<script lang="ts">
  import { Play, Pause, Square, SkipForward, RotateCcw } from 'lucide-svelte';
  import CodeEditor from './CodeEditor.svelte';
  import CompilationSteps from './CompilationSteps.svelte';
  import CPUVisualizer from './CPUVisualizer.svelte';
  import { uiState } from '$lib/stores/ui';
  import { simulatorState, simulatorActions, compilationStages } from '$lib/stores/simulator';
  import { tauriAPI, simulateCompilation } from '$lib/api/tauri';
  import type { CompilationStep } from '$lib/types/system';

  // 编译阶段数量常量
  const COMPILATION_STAGE_COUNT = 6;

  let isRunning = $derived($simulatorState.isRunning);
  let isPaused = $derived($simulatorState.isPaused);
  let currentStep = $derived($simulatorState.currentStep);
  let totalSteps = $derived($simulatorState.totalSteps);
  let currentView = $derived($uiState.viewMode.simulatorView);

  async function startSimulation() {
    try {
      // 开始编译过程
      simulatorActions.startCompilation();
      
      // 先设置编译阶段的步骤数
      simulatorActions.setTotalSteps(COMPILATION_STAGE_COUNT);

      // 模拟编译过程
      const result = await simulateCompilation(
        $simulatorState.sourceCode,
        $simulatorState.language,
        (stage: CompilationStep) => {
          // 更新编译阶段状态
          compilationStages.update(stages =>
            stages.map(s => s.id === stage.id ? stage : s)
          );
          
          // 如果阶段完成，增加当前步骤
          if (stage.status === 'completed') {
            simulatorActions.stepForward();
          }
        }
      );

      if (result.success) {
        // 编译完成后，更新总步骤数为编译阶段 + 指令执行步骤
        const totalSteps = COMPILATION_STAGE_COUNT + result.instructions.length;
        simulatorActions.setTotalSteps(totalSteps);
        
        // 存储指令
        simulatorState.update(state => ({
          ...state,
          instructions: result.instructions
        }));
        
        // 加载指令到CPU模拟器
        await tauriAPI.loadInstructions(result.instructions);
        console.log('编译成功，指令已加载，总步骤数:', totalSteps);
      } else {
        console.error('编译失败:', result.errors);
        simulatorActions.stopExecution();
      }
    } catch (error) {
      console.error('模拟启动失败:', error);
      simulatorActions.stopExecution();
    }
  }

  function pauseSimulation() {
    simulatorActions.pauseExecution();
  }

  function stopSimulation() {
    simulatorActions.stopExecution();
  }

  async function stepForward() {
    try {
      // 检查是否还在编译阶段
      if ($simulatorState.currentStep < COMPILATION_STAGE_COUNT) {
        console.log('仍在编译阶段，无法手动单步执行');
        return;
      }
      
      // 只有在指令执行阶段才可以单步执行
      const result = await tauriAPI.stepExecution();
      console.log('执行步骤:', result);
      simulatorActions.stepForward();
    } catch (error) {
      console.error('单步执行失败:', error);
    }
  }

  async function resetSimulation() {
    simulatorActions.reset();
    try {
      await tauriAPI.resetCPU();
    } catch (error) {
      console.error('重置CPU失败:', error);
    }
  }
</script>

<div class="flex h-full">
  <!-- 主内容区域 -->
  <div class="flex-1 flex flex-col">
    <!-- 控制栏 -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            指令执行模拟器
          </h2>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {#if currentStep <= COMPILATION_STAGE_COUNT}
              编译阶段: {currentStep} / {totalSteps}
            {:else}
              执行阶段: {currentStep - COMPILATION_STAGE_COUNT} / {totalSteps - COMPILATION_STAGE_COUNT} (总步骤: {currentStep} / {totalSteps})
            {/if}
          </div>
        </div>

        <!-- 控制按钮 -->
        <div class="flex items-center space-x-2">
          {#if !isRunning}
            <button
              class="btn btn-primary flex items-center space-x-2 shadow-lg hover:shadow-xl"
              onclick={startSimulation}
            >
              <Play class="w-4 h-4" />
              <span>开始</span>
            </button>
          {:else if isPaused}
            <button
              class="btn btn-primary flex items-center space-x-2 pulse-glow"
              onclick={startSimulation}
            >
              <Play class="w-4 h-4" />
              <span>继续</span>
            </button>
          {:else}
            <button
              class="btn btn-secondary flex items-center space-x-2 pulse-glow"
              onclick={pauseSimulation}
            >
              <Pause class="w-4 h-4" />
              <span>暂停</span>
            </button>
          {/if}

          <button
            class="btn btn-secondary flex items-center space-x-2"
            onclick={stepForward}
            disabled={!isPaused && !isRunning}
          >
            <SkipForward class="w-4 h-4" />
            <span>单步</span>
          </button>

          <button
            class="btn btn-secondary flex items-center space-x-2"
            onclick={stopSimulation}
          >
            <Square class="w-4 h-4" />
            <span>停止</span>
          </button>

          <button
            class="btn btn-secondary flex items-center space-x-2"
            onclick={resetSimulation}
          >
            <RotateCcw class="w-4 h-4" />
            <span>重置</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="flex-1 overflow-hidden">
      {#if $uiState.viewMode.simulatorView === 'editor'}
        <CodeEditor />
      {:else if $uiState.viewMode.simulatorView === 'compilation'}
        <CompilationSteps />
      {:else if $uiState.viewMode.simulatorView === 'execution'}
        <CPUVisualizer />
      {/if}
    </div>
  </div>

  <!-- 侧边栏 -->
  {#if $uiState.sidebarOpen}
    <div class="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        模拟器视图
      </h3>
      
      <div class="space-y-2">
        <button
          class="w-full text-left p-3 rounded-lg transition-colors duration-200 {$uiState.viewMode.simulatorView === 'editor' 
            ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
            : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'}"
          onclick={() => uiState.update(state => ({
            ...state,
            viewMode: { ...state.viewMode, simulatorView: 'editor' }
          }))}
        >
          <div class="font-medium">代码编辑器</div>
          <div class="text-sm opacity-75">编写和编辑源代码</div>
        </button>
        
        <button
          class="w-full text-left p-3 rounded-lg transition-colors duration-200 {$uiState.viewMode.simulatorView === 'compilation' 
            ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
            : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'}"
          onclick={() => uiState.update(state => ({
            ...state,
            viewMode: { ...state.viewMode, simulatorView: 'compilation' }
          }))}
        >
          <div class="font-medium">编译过程</div>
          <div class="text-sm opacity-75">查看编译步骤</div>
        </button>
        
        <button
          class="w-full text-left p-3 rounded-lg transition-colors duration-200 {$uiState.viewMode.simulatorView === 'execution' 
            ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
            : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'}"
          onclick={() => uiState.update(state => ({
            ...state,
            viewMode: { ...state.viewMode, simulatorView: 'execution' }
          }))}
        >
          <div class="font-medium">CPU执行</div>
          <div class="text-sm opacity-75">可视化CPU执行过程</div>
        </button>
      </div>

      <!-- 状态信息 -->
      <div class="mt-8">
        <h4 class="text-md font-semibold text-gray-900 dark:text-white mb-3">
          执行状态
        </h4>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">状态:</span>
            <span class="font-medium {isRunning ? 'text-green-600' : 'text-gray-500'}">
              {isRunning ? (isPaused ? '已暂停' : '运行中') : '已停止'}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">当前阶段:</span>
            <span class="font-medium">
              {#if currentStep <= COMPILATION_STAGE_COUNT}
                编译阶段 ({currentStep}/{COMPILATION_STAGE_COUNT})
              {:else}
                执行阶段 ({currentStep - COMPILATION_STAGE_COUNT}/{totalSteps - COMPILATION_STAGE_COUNT})
              {/if}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">总进度:</span>
            <span class="font-medium">{currentStep} / {totalSteps}</span>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
