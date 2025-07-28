use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CompilationResult {
    pub success: bool,
    pub instructions: Vec<Instruction>,
    pub errors: Vec<String>,
    pub warnings: Vec<String>,
    pub compilation_time: u64, // 毫秒
}

// 系统层次结构相关类型定义

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemLayer {
    pub id: String,
    pub name: String,
    pub name_en: String,
    pub description: String,
    pub level: u32,
    pub color: String,
    pub icon: String,
    pub concepts: Vec<Concept>,
    pub interfaces: Vec<LayerInterface>,
    pub examples: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Concept {
    pub id: String,
    pub name: String,
    pub name_en: String,
    pub description: String,
    pub examples: Vec<String>,
    pub related_concepts: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LayerInterface {
    pub id: String,
    pub name: String,
    pub description: String,
    pub from_layer: String,
    pub to_layer: String,
    pub interface_type: InterfaceType,
    pub protocols: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum InterfaceType {
    Upward,
    Downward,
    Bidirectional,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HierarchyData {
    pub layers: Vec<SystemLayer>,
    pub total_levels: u32,
    pub description: String,
}

// 指令执行相关类型定义

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Instruction {
    pub id: String,
    pub instruction_type: InstructionType,
    pub mnemonic: String,
    pub operands: Vec<String>,
    pub machine_code: String,
    pub description: String,
    pub cycles: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum InstructionType {
    Arithmetic,
    Logic,
    Memory,
    Control,
    DataTransfer,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Operand {
    pub operand_type: OperandType,
    pub value: OperandValue,
    pub size: u32, // in bits
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum OperandType {
    Register,
    Immediate,
    Memory,
    Label,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum OperandValue {
    String(String),
    Number(i64),
}

// CPU状态相关类型定义

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CPUState {
    pub registers: RegisterState,
    pub memory: MemoryState,
    pub flags: FlagsState,
    pub program_counter: u64,
    pub stack_pointer: u64,
    pub current_instruction: Option<Instruction>,
    pub execution_stage: ExecutionStage,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RegisterState {
    pub general: HashMap<String, i64>,
    pub special: HashMap<String, i64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MemoryState {
    pub data: HashMap<u64, i64>,
    pub stack: Vec<i64>,
    pub heap: HashMap<u64, i64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FlagsState {
    pub zero: bool,
    pub carry: bool,
    pub overflow: bool,
    pub negative: bool,
    pub parity: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ExecutionStage {
    Fetch,
    Decode,
    Execute,
    MemoryAccess,
    WriteBack,
    Complete,
}

// 编译过程相关类型定义

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CompilationStep {
    pub id: String,
    pub stage: CompilationStage,
    pub input: String,
    pub output: String,
    pub description: String,
    pub details: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum CompilationStage {
    LexicalAnalysis,
    SyntaxAnalysis,
    SemanticAnalysis,
    IntermediateCode,
    Optimization,
    CodeGeneration,
    Assembly,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SourceCode {
    pub id: String,
    pub language: ProgrammingLanguage,
    pub content: String,
    pub file_name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ProgrammingLanguage {
    C,
    Cpp,
    Java,
    Python,
    JavaScript,
}

// 模拟器状态相关类型定义

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SimulatorState {
    pub is_running: bool,
    pub is_paused: bool,
    pub current_step: u32,
    pub total_steps: u32,
    pub execution_speed: u32, // instructions per second
    pub breakpoints: Vec<u32>,
    pub source_code: Option<SourceCode>,
    pub compilation_steps: Vec<CompilationStep>,
    pub instructions: Vec<Instruction>,
    pub cpu_state: CPUState,
}

impl Default for CPUState {
    fn default() -> Self {
        Self {
            registers: RegisterState {
                general: HashMap::new(),
                special: HashMap::new(),
            },
            memory: MemoryState {
                data: HashMap::new(),
                stack: Vec::new(),
                heap: HashMap::new(),
            },
            flags: FlagsState {
                zero: false,
                carry: false,
                overflow: false,
                negative: false,
                parity: false,
            },
            program_counter: 0,
            stack_pointer: 0,
            current_instruction: None,
            execution_stage: ExecutionStage::Fetch,
        }
    }
}

impl Default for SimulatorState {
    fn default() -> Self {
        Self {
            is_running: false,
            is_paused: false,
            current_step: 0,
            total_steps: 0,
            execution_speed: 1,
            breakpoints: Vec::new(),
            source_code: None,
            compilation_steps: Vec::new(),
            instructions: Vec::new(),
            cpu_state: CPUState::default(),
        }
    }
}
