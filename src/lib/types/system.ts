// 系统层次结构相关类型定义

export interface SystemLayer {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  level: number;
  color: string;
  icon: string;
  concepts: Concept[];
  interfaces: LayerInterface[];
  examples: string[];
}

export interface Concept {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  examples: string[];
  relatedConcepts: string[];
}

export interface LayerInterface {
  id: string;
  name: string;
  description: string;
  fromLayer: string;
  toLayer: string;
  type: 'upward' | 'downward' | 'bidirectional';
  protocols: string[];
}

export interface HierarchyData {
  layers: SystemLayer[];
  totalLevels: number;
  description: string;
}

// 指令执行相关类型定义

export interface Instruction {
  id: string;
  type: InstructionType;
  mnemonic: string;
  operands: Operand[];
  machineCode: string;
  description: string;
  cycles: number;
}

export type InstructionType = 
  | 'arithmetic' 
  | 'logic' 
  | 'memory' 
  | 'control' 
  | 'data_transfer';

export interface Operand {
  type: OperandType;
  value: string | number;
  size: number; // in bits
}

export type OperandType = 
  | 'register' 
  | 'immediate' 
  | 'memory' 
  | 'label';

// CPU状态相关类型定义

export interface CPUState {
  registers: RegisterState;
  memory: MemoryState;
  flags: FlagsState;
  programCounter: number;
  stackPointer: number;
  currentInstruction: Instruction | null;
  executionStage: ExecutionStage;
}

export interface RegisterState {
  general: { [key: string]: number };
  special: { [key: string]: number };
}

export interface MemoryState {
  data: { [address: number]: number };
  stack: number[];
  heap: { [address: number]: number };
}

export interface FlagsState {
  zero: boolean;
  carry: boolean;
  overflow: boolean;
  negative: boolean;
  parity: boolean;
}

export type ExecutionStage = 
  | 'fetch' 
  | 'decode' 
  | 'execute' 
  | 'memory_access' 
  | 'write_back' 
  | 'complete';

// 编译过程相关类型定义

export interface CompilationStep {
  id: string;
  stage: string;
  stageEn: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  input: string;
  output: string;
  description: string;
  details: string[];
  duration: number;
}

export type CompilationStage = 
  | 'lexical_analysis' 
  | 'syntax_analysis' 
  | 'semantic_analysis' 
  | 'intermediate_code' 
  | 'optimization' 
  | 'code_generation' 
  | 'assembly';

export interface SourceCode {
  id: string;
  language: ProgrammingLanguage;
  content: string;
  fileName: string;
}

export type ProgrammingLanguage = 'c' | 'cpp' | 'java' | 'python' | 'javascript';

// 模拟器状态相关类型定义

export interface SimulatorState {
  sourceCode: string;
  language: string;
  compilationStages: CompilationStep[];
  instructions: Instruction[];
  currentInstruction: Instruction | null;
  cpuState: CPUState;
  executionStage: ExecutionStage;
  isRunning: boolean;
  isPaused: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number; // 执行速度 (ms)
}

// 用户界面相关类型定义

export interface ViewMode {
  current: 'hierarchy' | 'simulator';
  hierarchyView: 'overview' | 'detail' | 'interface';
  simulatorView: 'editor' | 'compilation' | 'execution' | 'cpu';
}

export interface UIState {
  viewMode: ViewMode;
  selectedLayer: string | null;
  selectedInstruction: string | null;
  sidebarOpen: boolean;
  darkMode: boolean;
  language: 'zh' | 'en';
}
