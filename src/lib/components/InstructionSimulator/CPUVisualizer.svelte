<script lang="ts">
  import { Cpu, MemoryStick, Zap, Database } from 'lucide-svelte';

  // 模拟CPU状态数据
  let cpuState = $state({
    registers: {
      general: {
        'EAX': 5,
        'EBX': 3,
        'ECX': 8,
        'EDX': 0
      },
      special: {
        'ESP': 1000,
        'EBP': 1000,
        'EIP': 2048
      }
    },
    memory: {
      data: {
        1000: 5,
        1004: 3,
        1008: 8
      },
      stack: [8, 3, 5],
      heap: {}
    },
    flags: {
      zero: false,
      carry: false,
      overflow: false,
      negative: false,
      parity: false
    },
    currentInstruction: {
      id: 'add-1',
      mnemonic: 'ADD',
      operands: ['EAX', 'EBX'],
      machineCode: '01D8',
      description: '将EBX的值加到EAX中'
    },
    executionStage: 'execute'
  });

  let instructions = $state([
    { address: 2048, mnemonic: 'MOV', operands: 'EAX, 5', machineCode: 'B805000000', active: false },
    { address: 2053, mnemonic: 'MOV', operands: 'EBX, 3', machineCode: 'BB03000000', active: false },
    { address: 2058, mnemonic: 'ADD', operands: 'EAX, EBX', machineCode: '01D8', active: true },
    { address: 2060, mnemonic: 'MOV', operands: '[1008], EAX', machineCode: '8905F0030000', active: false },
    { address: 2066, mnemonic: 'RET', operands: '', machineCode: 'C3', active: false }
  ]);

  function getStageColor(stage: string) {
    switch (stage) {
      case 'fetch': return 'bg-blue-500';
      case 'decode': return 'bg-yellow-500';
      case 'execute': return 'bg-green-500';
      case 'memory_access': return 'bg-purple-500';
      case 'write_back': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  }

  function getStageName(stage: string) {
    switch (stage) {
      case 'fetch': return '取指';
      case 'decode': return '译码';
      case 'execute': return '执行';
      case 'memory_access': return '访存';
      case 'write_back': return '写回';
      default: return '完成';
    }
  }
</script>

<div class="h-full overflow-auto p-6">
  <div class="max-w-7xl mx-auto">
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        CPU执行可视化
      </h2>
      <p class="text-gray-600 dark:text-gray-400">
        实时观察指令在CPU内部的执行过程
      </p>
    </div>

    <!-- 当前指令信息 -->
    <div class="card p-6 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          当前执行指令
        </h3>
        <div class="flex items-center space-x-2">
          <div class="w-3 h-3 rounded-full {getStageColor(cpuState.executionStage)}"></div>
          <span class="text-sm font-medium">{getStageName(cpuState.executionStage)}</span>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <div class="text-sm text-gray-600 dark:text-gray-400">指令</div>
          <div class="font-mono text-lg font-semibold">
            {cpuState.currentInstruction.mnemonic} {cpuState.currentInstruction.operands.join(', ')}
          </div>
        </div>
        <div>
          <div class="text-sm text-gray-600 dark:text-gray-400">机器码</div>
          <div class="font-mono text-lg">{cpuState.currentInstruction.machineCode}</div>
        </div>
        <div>
          <div class="text-sm text-gray-600 dark:text-gray-400">地址</div>
          <div class="font-mono text-lg">0x{cpuState.registers.special.EIP.toString(16).toUpperCase()}</div>
        </div>
        <div>
          <div class="text-sm text-gray-600 dark:text-gray-400">描述</div>
          <div class="text-sm">{cpuState.currentInstruction.description}</div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- CPU寄存器 -->
      <div class="card p-6">
        <div class="flex items-center space-x-2 mb-4">
          <Cpu class="w-6 h-6 text-primary-600" />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            CPU寄存器
          </h3>
        </div>
        
        <!-- 通用寄存器 -->
        <div class="mb-6">
          <h4 class="text-md font-semibold text-gray-900 dark:text-white mb-3">
            通用寄存器
          </h4>
          <div class="space-y-2">
            {#each Object.entries(cpuState.registers.general) as [reg, value]}
              <div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <span class="font-mono font-semibold">{reg}</span>
                <span class="font-mono">{value} (0x{value.toString(16).toUpperCase()})</span>
              </div>
            {/each}
          </div>
        </div>

        <!-- 特殊寄存器 -->
        <div class="mb-6">
          <h4 class="text-md font-semibold text-gray-900 dark:text-white mb-3">
            特殊寄存器
          </h4>
          <div class="space-y-2">
            {#each Object.entries(cpuState.registers.special) as [reg, value]}
              <div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <span class="font-mono font-semibold">{reg}</span>
                <span class="font-mono">{value} (0x{value.toString(16).toUpperCase()})</span>
              </div>
            {/each}
          </div>
        </div>

        <!-- 标志位 -->
        <div>
          <h4 class="text-md font-semibold text-gray-900 dark:text-white mb-3">
            标志位
          </h4>
          <div class="grid grid-cols-2 gap-2">
            {#each Object.entries(cpuState.flags) as [flag, value]}
              <div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <span class="text-sm font-medium">{flag.toUpperCase()}</span>
                <span class="w-3 h-3 rounded-full {value ? 'bg-green-500' : 'bg-gray-400'}"></span>
              </div>
            {/each}
          </div>
        </div>
      </div>

      <!-- 内存状态 -->
      <div class="card p-6">
        <div class="flex items-center space-x-2 mb-4">
          <MemoryStick class="w-6 h-6 text-primary-600" />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            内存状态
          </h3>
        </div>
        
        <!-- 数据段 -->
        <div class="mb-6">
          <h4 class="text-md font-semibold text-gray-900 dark:text-white mb-3">
            数据段
          </h4>
          <div class="space-y-2">
            {#each Object.entries(cpuState.memory.data) as [addr, value]}
              <div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <span class="font-mono text-sm">0x{parseInt(addr).toString(16).toUpperCase()}</span>
                <span class="font-mono">{value}</span>
              </div>
            {/each}
          </div>
        </div>

        <!-- 栈 -->
        <div>
          <h4 class="text-md font-semibold text-gray-900 dark:text-white mb-3">
            栈 (ESP: {cpuState.registers.special.ESP})
          </h4>
          <div class="space-y-1">
            {#each cpuState.memory.stack as value, index}
              <div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded {index === 0 ? 'ring-2 ring-blue-500' : ''}">
                <span class="font-mono text-sm">栈顶{index > 0 ? `-${index}` : ''}</span>
                <span class="font-mono">{value}</span>
              </div>
            {/each}
          </div>
        </div>
      </div>

      <!-- 指令序列 -->
      <div class="card p-6">
        <div class="flex items-center space-x-2 mb-4">
          <Database class="w-6 h-6 text-primary-600" />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            指令序列
          </h3>
        </div>
        
        <div class="space-y-2">
          {#each instructions as instruction}
            <div class="p-3 rounded {instruction.active ? 'bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-500' : 'bg-gray-50 dark:bg-gray-700'}">
              <div class="flex items-center justify-between mb-1">
                <span class="font-mono text-sm">0x{instruction.address.toString(16).toUpperCase()}</span>
                <span class="font-mono text-xs text-gray-500">{instruction.machineCode}</span>
              </div>
              <div class="font-mono font-semibold">
                {instruction.mnemonic} {instruction.operands}
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- 执行流水线 -->
    <div class="mt-6 card p-6">
      <div class="flex items-center space-x-2 mb-4">
        <Zap class="w-6 h-6 text-primary-600" />
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          执行流水线
        </h3>
      </div>
      
      <div class="flex items-center space-x-4 overflow-x-auto">
        {#each ['fetch', 'decode', 'execute', 'memory_access', 'write_back'] as stage}
          <div class="flex-shrink-0 text-center">
            <div class="w-20 h-20 rounded-lg {getStageColor(stage)} {cpuState.executionStage === stage ? 'ring-4 ring-blue-300' : ''} flex items-center justify-center mb-2">
              <span class="text-white font-semibold text-sm">{getStageName(stage)}</span>
            </div>
            <div class="text-xs text-gray-600 dark:text-gray-400">
              {stage === cpuState.executionStage ? '当前阶段' : ''}
            </div>
          </div>
          {#if stage !== 'write_back'}
            <div class="w-8 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
          {/if}
        {/each}
      </div>
    </div>
  </div>
</div>
