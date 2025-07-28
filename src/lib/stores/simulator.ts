import { writable } from 'svelte/store';
import type { SimulatorState, CPUState, Instruction, CompilationStep } from '$lib/types/system';

// 初始CPU状态
const initialCPUState: CPUState = {
  registers: {
    general: {
      'EAX': 0,
      'EBX': 0,
      'ECX': 0,
      'EDX': 0,
      'ESI': 0,
      'EDI': 0
    },
    special: {
      'ESP': 1000,
      'EBP': 1000,
      'EIP': 2048
    }
  },
  memory: {
    data: {},
    stack: [],
    heap: {}
  },
  flags: {
    zero: false,
    carry: false,
    overflow: false,
    negative: false,
    parity: false
  },
  programCounter: 2048,
  stackPointer: 1000,
  currentInstruction: null,
  executionStage: 'fetch'
};

// 初始模拟器状态
const initialSimulatorState: SimulatorState = {
  sourceCode: `// 简单的C语言示例
#include <stdio.h>

int main() {
    int a = 5;
    int b = 3;
    int sum = a + b;
    printf("结果: %d\\n", sum);
    return 0;
}`,
  language: 'c',
  compilationStages: [],
  instructions: [],
  currentInstruction: null,
  cpuState: initialCPUState,
  executionStage: 'fetch',
  isRunning: false,
  isPaused: false,
  currentStep: 0,
  totalSteps: 0,
  speed: 1000
};

// 模拟器状态存储
export const simulatorState = writable<SimulatorState>(initialSimulatorState);

// 编译阶段数据
export const compilationStages = writable<CompilationStep[]>([
  {
    id: 'lexical_analysis',
    stage: '词法分析',
    stageEn: 'Lexical Analysis',
    status: 'pending',
    input: '',
    output: '',
    description: '将源代码分解为词法单元(tokens)',
    details: [
      '识别关键字',
      '识别标识符',
      '识别操作符',
      '识别字面量',
      '识别分隔符'
    ],
    duration: 0
  },
  {
    id: 'syntax_analysis',
    stage: '语法分析',
    stageEn: 'Syntax Analysis',
    status: 'pending',
    input: '',
    output: '',
    description: '根据语法规则构建抽象语法树',
    details: [
      '构建声明节点',
      '构建赋值表达式',
      '验证语法正确性',
      '生成AST结构'
    ],
    duration: 0
  },
  {
    id: 'semantic_analysis',
    stage: '语义分析',
    stageEn: 'Semantic Analysis',
    status: 'pending',
    input: '',
    output: '',
    description: '检查语义正确性并添加类型信息',
    details: [
      '类型检查',
      '变量声明检查',
      '作用域分析',
      '符号表构建'
    ],
    duration: 0
  },
  {
    id: 'intermediate_code',
    stage: '中间代码生成',
    stageEn: 'Intermediate Code Generation',
    status: 'pending',
    input: '',
    output: '',
    description: '生成与机器无关的中间表示',
    details: [
      '生成三地址码',
      '临时变量分配',
      '控制流分析',
      '数据流分析'
    ],
    duration: 0
  },
  {
    id: 'optimization',
    stage: '代码优化',
    stageEn: 'Code Optimization',
    status: 'pending',
    input: '',
    output: '',
    description: '对中间代码进行优化',
    details: [
      '常量折叠',
      '死代码消除',
      '公共子表达式消除',
      '循环优化'
    ],
    duration: 0
  },
  {
    id: 'code_generation',
    stage: '目标代码生成',
    stageEn: 'Code Generation',
    status: 'pending',
    input: '',
    output: '',
    description: '生成目标机器的汇编代码',
    details: [
      '指令选择',
      '寄存器分配',
      '指令调度',
      '地址计算'
    ],
    duration: 0
  }
]);

// 模拟器控制函数
export const simulatorActions = {
  // 开始编译
  startCompilation: () => {
    simulatorState.update(state => ({
      ...state,
      isRunning: true,
      isPaused: false,
      currentStep: 0
    }));
  },

  // 暂停执行
  pauseExecution: () => {
    simulatorState.update(state => ({
      ...state,
      isPaused: true
    }));
  },

  // 停止执行
  stopExecution: () => {
    simulatorState.update(state => ({
      ...state,
      isRunning: false,
      isPaused: false,
      currentStep: 0
    }));
  },

  // 单步执行
  stepForward: () => {
    simulatorState.update(state => {
      if (state.currentStep < state.totalSteps) {
        return {
          ...state,
          currentStep: state.currentStep + 1
        };
      }
      return state;
    });
  },

  // 重置模拟器
  reset: () => {
    simulatorState.set(initialSimulatorState);
    compilationStages.update(stages => 
      stages.map(stage => ({ ...stage, status: 'pending' }))
    );
  },

  // 更新源代码
  updateSourceCode: (code: string) => {
    simulatorState.update(state => ({
      ...state,
      sourceCode: code
    }));
  },

  // 更新语言
  updateLanguage: (language: string) => {
    simulatorState.update(state => ({
      ...state,
      language
    }));
  },

  // 设置指令和总步骤数
  setInstructions: (instructions: Instruction[]) => {
    simulatorState.update(state => ({
      ...state,
      instructions,
      totalSteps: instructions.length,
      currentStep: 0
    }));
  },

  // 设置总步骤数
  setTotalSteps: (totalSteps: number) => {
    simulatorState.update(state => ({
      ...state,
      totalSteps
    }));
  }
};
