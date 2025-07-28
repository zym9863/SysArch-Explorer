import { invoke } from '@tauri-apps/api/core';
import type { Instruction, CPUState, CompilationStep } from '$lib/types/system';

// 编译结果类型
export interface CompilationResult {
  success: boolean;
  instructions: Instruction[];
  errors: string[];
  warnings: string[];
  compilation_time: number;
}

// 执行结果类型
export interface ExecutionResult {
  stage: string;
  instruction: Instruction | null;
  cpu_state: CPUState;
  message: string;
  cycle_count: number;
}

// API函数
export const tauriAPI = {
  // 编译代码
  async compileCode(sourceCode: string, language: string): Promise<CompilationResult> {
    try {
      const result = await invoke<CompilationResult>('compile_code', {
        sourceCode,
        language
      });
      return result;
    } catch (error) {
      console.error('编译失败:', error);
      throw error;
    }
  },

  // 加载指令到CPU模拟器
  async loadInstructions(instructions: Instruction[]): Promise<void> {
    try {
      await invoke('load_instructions', { instructions });
    } catch (error) {
      console.error('加载指令失败:', error);
      throw error;
    }
  },

  // 单步执行
  async stepExecution(): Promise<ExecutionResult> {
    try {
      const result = await invoke<ExecutionResult>('step_execution');
      return result;
    } catch (error) {
      console.error('执行步骤失败:', error);
      throw error;
    }
  },

  // 重置CPU
  async resetCPU(): Promise<CPUState> {
    try {
      const result = await invoke<CPUState>('reset_cpu');
      return result;
    } catch (error) {
      console.error('重置CPU失败:', error);
      throw error;
    }
  },

  // 获取CPU状态
  async getCPUState(): Promise<CPUState> {
    try {
      const result = await invoke<CPUState>('get_cpu_state');
      return result;
    } catch (error) {
      console.error('获取CPU状态失败:', error);
      throw error;
    }
  }
};

// 模拟编译过程的辅助函数
export async function simulateCompilation(
  sourceCode: string, 
  language: string,
  onStageUpdate?: (stage: CompilationStep) => void
): Promise<CompilationResult> {
  const stages: CompilationStep[] = [
    {
      id: 'lexical_analysis',
      stage: '词法分析',
      stageEn: 'Lexical Analysis',
      status: 'pending',
      input: sourceCode,
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
  ];

  // 模拟逐步编译过程
  for (let i = 0; i < stages.length; i++) {
    const stage = stages[i];
    stage.status = 'in-progress';
    onStageUpdate?.(stage);
    
    // 模拟处理时间
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    stage.status = 'completed';
    stage.duration = Math.floor(50 + Math.random() * 200);
    
    // 设置输出内容
    switch (stage.id) {
      case 'lexical_analysis':
        stage.output = 'TOKEN_INT, TOKEN_IDENTIFIER(a), TOKEN_ASSIGN, TOKEN_NUMBER(5), TOKEN_SEMICOLON, ...';
        break;
      case 'syntax_analysis':
        stage.output = '抽象语法树 (AST)';
        break;
      case 'semantic_analysis':
        stage.output = '带类型信息的AST';
        break;
      case 'intermediate_code':
        stage.output = '三地址码';
        break;
      case 'optimization':
        stage.output = '优化后的中间代码';
        break;
      case 'code_generation':
        stage.output = '汇编代码';
        break;
    }
    
    onStageUpdate?.(stage);
  }

  // 调用后端编译
  return await tauriAPI.compileCode(sourceCode, language);
}
