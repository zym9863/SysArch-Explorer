use crate::types::*;

/// CPU模拟器
pub struct CPUSimulator {
    pub state: CPUState,
    pub instructions: Vec<Instruction>,
    pub current_instruction_index: usize,
    pub execution_stage: ExecutionStage,
    pub cycle_count: u64,
}

impl CPUSimulator {
    pub fn new() -> Self {
        Self {
            state: CPUState::default(),
            instructions: Vec::new(),
            current_instruction_index: 0,
            execution_stage: ExecutionStage::Fetch,
            cycle_count: 0,
        }
    }

    pub fn load_instructions(&mut self, instructions: Vec<Instruction>) {
        self.instructions = instructions;
        self.current_instruction_index = 0;
        self.execution_stage = ExecutionStage::Fetch;
    }

    pub fn step(&mut self) -> Result<ExecutionResult, String> {
        if self.current_instruction_index >= self.instructions.len() {
            return Ok(ExecutionResult {
                stage: ExecutionStage::Complete,
                instruction: None,
                cpu_state: self.state.clone(),
                message: "程序执行完成".to_string(),
                cycle_count: self.cycle_count,
            });
        }

        let instruction = &self.instructions[self.current_instruction_index].clone();
        let result = match self.execution_stage {
            ExecutionStage::Fetch => self.fetch(instruction),
            ExecutionStage::Decode => self.decode(instruction),
            ExecutionStage::Execute => self.execute(instruction),
            ExecutionStage::MemoryAccess => self.memory_access(instruction),
            ExecutionStage::WriteBack => self.write_back(instruction),
            ExecutionStage::Complete => {
                self.current_instruction_index += 1;
                self.execution_stage = ExecutionStage::Fetch;
                Ok(ExecutionResult {
                    stage: ExecutionStage::Fetch,
                    instruction: None,
                    cpu_state: self.state.clone(),
                    message: "准备执行下一条指令".to_string(),
                    cycle_count: self.cycle_count,
                })
            }
        };

        self.cycle_count += 1;
        result
    }

    fn fetch(&mut self, instruction: &Instruction) -> Result<ExecutionResult, String> {
        // 取指阶段：从内存中获取指令
        self.execution_stage = ExecutionStage::Decode;
        
        Ok(ExecutionResult {
            stage: ExecutionStage::Fetch,
            instruction: Some(instruction.clone()),
            cpu_state: self.state.clone(),
            message: format!("取指：从地址 0x{:X} 获取指令 {}", 
                           self.state.registers.special.get("EIP").unwrap_or(&0), 
                           instruction.mnemonic),
            cycle_count: self.cycle_count,
        })
    }

    fn decode(&mut self, instruction: &Instruction) -> Result<ExecutionResult, String> {
        // 译码阶段：解析指令
        self.execution_stage = ExecutionStage::Execute;
        
        Ok(ExecutionResult {
            stage: ExecutionStage::Decode,
            instruction: Some(instruction.clone()),
            cpu_state: self.state.clone(),
            message: format!("译码：解析指令 {} {}", 
                           instruction.mnemonic, 
                           instruction.operands.join(", ")),
            cycle_count: self.cycle_count,
        })
    }

    fn execute(&mut self, instruction: &Instruction) -> Result<ExecutionResult, String> {
        // 执行阶段：根据指令类型执行操作
        match instruction.instruction_type {
            InstructionType::Arithmetic => self.execute_arithmetic(instruction),
            InstructionType::Logic => self.execute_logic(instruction),
            InstructionType::DataTransfer => self.execute_data_transfer(instruction),
            InstructionType::Control => self.execute_control(instruction),
            InstructionType::Memory => {
                self.execution_stage = ExecutionStage::MemoryAccess;
                Ok(ExecutionResult {
                    stage: ExecutionStage::Execute,
                    instruction: Some(instruction.clone()),
                    cpu_state: self.state.clone(),
                    message: format!("执行：准备内存访问操作"),
                    cycle_count: self.cycle_count,
                })
            }
        }
    }

    fn execute_arithmetic(&mut self, instruction: &Instruction) -> Result<ExecutionResult, String> {
        self.execution_stage = ExecutionStage::WriteBack;
        
        match instruction.mnemonic.as_str() {
            "ADD" => {
                if instruction.operands.len() >= 2 {
                    let reg1 = &instruction.operands[0];
                    let reg2 = &instruction.operands[1];
                    
                    let val1 = *self.state.registers.general.get(reg1).unwrap_or(&0);
                    let val2 = *self.state.registers.general.get(reg2).unwrap_or(&0);
                    let result = val1 + val2;
                    
                    self.state.registers.general.insert(reg1.clone(), result);
                    
                    // 更新标志位
                    self.state.flags.zero = result == 0;
                    self.state.flags.negative = result < 0;
                }
            }
            "SUB" => {
                if instruction.operands.len() >= 2 {
                    let reg1 = &instruction.operands[0];
                    let reg2 = &instruction.operands[1];
                    
                    let val1 = *self.state.registers.general.get(reg1).unwrap_or(&0);
                    let val2 = *self.state.registers.general.get(reg2).unwrap_or(&0);
                    let result = val1 - val2;
                    
                    self.state.registers.general.insert(reg1.clone(), result);
                    
                    // 更新标志位
                    self.state.flags.zero = result == 0;
                    self.state.flags.negative = result < 0;
                }
            }
            _ => {}
        }

        Ok(ExecutionResult {
            stage: ExecutionStage::Execute,
            instruction: Some(instruction.clone()),
            cpu_state: self.state.clone(),
            message: format!("执行：算术运算 {}", instruction.mnemonic),
            cycle_count: self.cycle_count,
        })
    }

    fn execute_logic(&mut self, instruction: &Instruction) -> Result<ExecutionResult, String> {
        self.execution_stage = ExecutionStage::WriteBack;
        
        Ok(ExecutionResult {
            stage: ExecutionStage::Execute,
            instruction: Some(instruction.clone()),
            cpu_state: self.state.clone(),
            message: format!("执行：逻辑运算 {}", instruction.mnemonic),
            cycle_count: self.cycle_count,
        })
    }

    fn execute_data_transfer(&mut self, instruction: &Instruction) -> Result<ExecutionResult, String> {
        self.execution_stage = ExecutionStage::WriteBack;
        
        match instruction.mnemonic.as_str() {
            "MOV" => {
                if instruction.operands.len() >= 2 {
                    let dest = &instruction.operands[0];
                    let src = &instruction.operands[1];
                    
                    // 简单的立即数到寄存器的传送
                    if let Ok(value) = src.parse::<i64>() {
                        self.state.registers.general.insert(dest.clone(), value);
                    }
                }
            }
            _ => {}
        }

        Ok(ExecutionResult {
            stage: ExecutionStage::Execute,
            instruction: Some(instruction.clone()),
            cpu_state: self.state.clone(),
            message: format!("执行：数据传送 {}", instruction.mnemonic),
            cycle_count: self.cycle_count,
        })
    }

    fn execute_control(&mut self, instruction: &Instruction) -> Result<ExecutionResult, String> {
        self.execution_stage = ExecutionStage::WriteBack;
        
        Ok(ExecutionResult {
            stage: ExecutionStage::Execute,
            instruction: Some(instruction.clone()),
            cpu_state: self.state.clone(),
            message: format!("执行：控制流 {}", instruction.mnemonic),
            cycle_count: self.cycle_count,
        })
    }

    fn memory_access(&mut self, instruction: &Instruction) -> Result<ExecutionResult, String> {
        self.execution_stage = ExecutionStage::WriteBack;
        
        // 模拟内存访问
        if instruction.mnemonic == "MOV" && instruction.operands.len() >= 2 {
            let dest = &instruction.operands[0];
            let src = &instruction.operands[1];
            
            // 检查是否是内存操作
            if dest.starts_with('[') && dest.ends_with(']') {
                // 存储到内存
                let addr_str = &dest[1..dest.len()-1];
                if let Ok(addr) = addr_str.parse::<u32>() {
                    if let Some(value) = self.state.registers.general.get(src) {
                        self.state.memory.data.insert(addr.into(), *value);
                    }
                }
            }
        }

        Ok(ExecutionResult {
            stage: ExecutionStage::MemoryAccess,
            instruction: Some(instruction.clone()),
            cpu_state: self.state.clone(),
            message: format!("内存访问：{}", instruction.description),
            cycle_count: self.cycle_count,
        })
    }

    fn write_back(&mut self, instruction: &Instruction) -> Result<ExecutionResult, String> {
        self.execution_stage = ExecutionStage::Complete;
        
        // 更新指令指针
        if let Some(eip) = self.state.registers.special.get_mut("EIP") {
            *eip += 1;
        }

        Ok(ExecutionResult {
            stage: ExecutionStage::WriteBack,
            instruction: Some(instruction.clone()),
            cpu_state: self.state.clone(),
            message: format!("写回：完成指令 {}", instruction.mnemonic),
            cycle_count: self.cycle_count,
        })
    }

    pub fn reset(&mut self) {
        self.state = CPUState::default();
        self.current_instruction_index = 0;
        self.execution_stage = ExecutionStage::Fetch;
        self.cycle_count = 0;
    }
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct ExecutionResult {
    pub stage: ExecutionStage,
    pub instruction: Option<Instruction>,
    pub cpu_state: CPUState,
    pub message: String,
    pub cycle_count: u64,
}
