mod types;
mod compiler;
mod cpu_simulator;

use types::*;
use compiler::{Lexer, Parser, CodeGenerator};
use cpu_simulator::{CPUSimulator, ExecutionResult};
use std::sync::Mutex;
use tauri::State;

// 全局CPU模拟器状态
struct AppState {
    cpu_simulator: Mutex<CPUSimulator>,
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn compile_code(source_code: String, _language: String) -> Result<CompilationResult, String> {
    // 词法分析
    let mut lexer = Lexer::new(source_code.clone());
    let tokens = lexer.tokenize()?;

    // 语法分析
    let mut parser = Parser::new(tokens);
    let ast = parser.parse()?;

    // 代码生成
    let mut generator = CodeGenerator::new(ast);
    let instructions = generator.generate()?;

    Ok(CompilationResult {
        success: true,
        instructions,
        errors: Vec::new(),
        warnings: Vec::new(),
        compilation_time: 150, // 模拟编译时间
    })
}

#[tauri::command]
fn load_instructions(instructions: Vec<Instruction>, state: State<AppState>) -> Result<(), String> {
    let mut simulator = state.cpu_simulator.lock().unwrap();
    simulator.load_instructions(instructions);
    Ok(())
}

#[tauri::command]
fn step_execution(state: State<AppState>) -> Result<ExecutionResult, String> {
    let mut simulator = state.cpu_simulator.lock().unwrap();
    simulator.step()
}

#[tauri::command]
fn reset_cpu(state: State<AppState>) -> Result<CPUState, String> {
    let mut simulator = state.cpu_simulator.lock().unwrap();
    simulator.reset();
    Ok(simulator.state.clone())
}

#[tauri::command]
fn get_cpu_state(state: State<AppState>) -> Result<CPUState, String> {
    let simulator = state.cpu_simulator.lock().unwrap();
    Ok(simulator.state.clone())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(AppState {
            cpu_simulator: Mutex::new(CPUSimulator::new()),
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            compile_code,
            load_instructions,
            step_execution,
            reset_cpu,
            get_cpu_state
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
