use crate::types::*;
use regex::Regex;

/// 简单的词法分析器
pub struct Lexer {
    input: String,
    position: usize,
    tokens: Vec<Token>,
}

#[derive(Debug, Clone)]
pub struct Token {
    pub token_type: TokenType,
    pub value: String,
    pub position: usize,
}

#[derive(Debug, Clone, PartialEq)]
pub enum TokenType {
    Keyword,
    Identifier,
    Number,
    String,
    Operator,
    Delimiter,
    Whitespace,
    Comment,
}

impl Lexer {
    pub fn new(input: String) -> Self {
        Self {
            input,
            position: 0,
            tokens: Vec::new(),
        }
    }

    pub fn tokenize(&mut self) -> Result<Vec<Token>, String> {
        let keywords = vec!["int", "float", "char", "void", "if", "else", "while", "for", "return", "include", "stdio"];
        let operators = vec!["=", "+", "-", "*", "/", "%", "==", "!=", "<", ">", "<=", ">=", "&&", "||", "!"];
        let delimiters = vec![";", ",", "(", ")", "{", "}", "[", "]"];

        // 简单的正则表达式匹配
        let patterns = vec![
            (r"#\w+", TokenType::Keyword),
            (r"\b(int|float|char|void|if|else|while|for|return|include|stdio)\b", TokenType::Keyword),
            (r"\b[a-zA-Z_][a-zA-Z0-9_]*\b", TokenType::Identifier),
            (r"\b\d+\b", TokenType::Number),
            (r#""[^"]*""#, TokenType::String),
            (r"[+\-*/=<>!&|%]+", TokenType::Operator),
            (r"[;,(){}[\]]", TokenType::Delimiter),
            (r"\s+", TokenType::Whitespace),
            (r"//.*", TokenType::Comment),
        ];

        let mut pos = 0;
        while pos < self.input.len() {
            let mut matched = false;
            
            for (pattern, token_type) in &patterns {
                let regex = Regex::new(pattern).unwrap();
                if let Some(mat) = regex.find_at(&self.input, pos) {
                    if mat.start() == pos {
                        let value = mat.as_str().to_string();
                        
                        // 跳过空白字符和注释
                        if *token_type != TokenType::Whitespace && *token_type != TokenType::Comment {
                            self.tokens.push(Token {
                                token_type: token_type.clone(),
                                value,
                                position: pos,
                            });
                        }
                        
                        pos = mat.end();
                        matched = true;
                        break;
                    }
                }
            }
            
            if !matched {
                pos += 1; // 跳过无法识别的字符
            }
        }

        Ok(self.tokens.clone())
    }
}

/// 简单的语法分析器
pub struct Parser {
    tokens: Vec<Token>,
    position: usize,
}

#[derive(Debug, Clone)]
pub struct ASTNode {
    pub node_type: ASTNodeType,
    pub value: String,
    pub children: Vec<ASTNode>,
}

#[derive(Debug, Clone)]
pub enum ASTNodeType {
    Program,
    Function,
    Declaration,
    Assignment,
    Expression,
    Statement,
    Block,
}

impl Parser {
    pub fn new(tokens: Vec<Token>) -> Self {
        Self {
            tokens,
            position: 0,
        }
    }

    pub fn parse(&mut self) -> Result<ASTNode, String> {
        let mut program = ASTNode {
            node_type: ASTNodeType::Program,
            value: "program".to_string(),
            children: Vec::new(),
        };

        while self.position < self.tokens.len() {
            if let Ok(node) = self.parse_statement() {
                program.children.push(node);
            } else {
                self.position += 1; // 跳过无法解析的token
            }
        }

        Ok(program)
    }

    fn parse_statement(&mut self) -> Result<ASTNode, String> {
        if self.position >= self.tokens.len() {
            return Err("Unexpected end of input".to_string());
        }

        let token = &self.tokens[self.position];
        
        match token.token_type {
            TokenType::Keyword if token.value == "int" => self.parse_declaration(),
            _ => self.parse_expression(),
        }
    }

    fn parse_declaration(&mut self) -> Result<ASTNode, String> {
        let mut decl = ASTNode {
            node_type: ASTNodeType::Declaration,
            value: "declaration".to_string(),
            children: Vec::new(),
        };

        // 跳过类型关键字
        self.position += 1;
        
        // 获取变量名
        if self.position < self.tokens.len() {
            let var_name = self.tokens[self.position].value.clone();
            decl.children.push(ASTNode {
                node_type: ASTNodeType::Expression,
                value: var_name,
                children: Vec::new(),
            });
            self.position += 1;
        }

        // 检查是否有赋值
        if self.position < self.tokens.len() && self.tokens[self.position].value == "=" {
            self.position += 1; // 跳过 =
            if let Ok(expr) = self.parse_expression() {
                decl.children.push(expr);
            }
        }

        Ok(decl)
    }

    fn parse_expression(&mut self) -> Result<ASTNode, String> {
        if self.position >= self.tokens.len() {
            return Err("Unexpected end of input".to_string());
        }

        let token = &self.tokens[self.position];
        self.position += 1;

        Ok(ASTNode {
            node_type: ASTNodeType::Expression,
            value: token.value.clone(),
            children: Vec::new(),
        })
    }
}

/// 代码生成器
pub struct CodeGenerator {
    ast: ASTNode,
    instructions: Vec<Instruction>,
    register_counter: usize,
    memory_offset: usize,
}

impl CodeGenerator {
    pub fn new(ast: ASTNode) -> Self {
        Self {
            ast,
            instructions: Vec::new(),
            register_counter: 0,
            memory_offset: 1000,
        }
    }

    pub fn generate(&mut self) -> Result<Vec<Instruction>, String> {
        self.generate_node(&self.ast.clone())?;
        Ok(self.instructions.clone())
    }

    fn generate_node(&mut self, node: &ASTNode) -> Result<(), String> {
        match node.node_type {
            ASTNodeType::Program => {
                for child in &node.children {
                    self.generate_node(child)?;
                }
            }
            ASTNodeType::Declaration => {
                if node.children.len() >= 2 {
                    // 简单的变量赋值
                    let var_name = &node.children[0].value;
                    let value = &node.children[1].value;
                    
                    if let Ok(num_value) = value.parse::<i64>() {
                        self.instructions.push(Instruction {
                            id: format!("mov_{}", self.instructions.len()),
                            instruction_type: InstructionType::DataTransfer,
                            mnemonic: "MOV".to_string(),
                            operands: vec!["EAX".to_string(), num_value.to_string()],
                            machine_code: format!("B8{:08X}", num_value),
                            description: format!("将值 {} 加载到 EAX", num_value),
                            cycles: 1,
                        });
                        
                        self.instructions.push(Instruction {
                            id: format!("store_{}", self.instructions.len()),
                            instruction_type: InstructionType::Memory,
                            mnemonic: "MOV".to_string(),
                            operands: vec![format!("[{}]", self.memory_offset), "EAX".to_string()],
                            machine_code: format!("8905{:08X}", self.memory_offset),
                            description: format!("将 EAX 存储到内存地址 {}", self.memory_offset),
                            cycles: 2,
                        });
                        
                        self.memory_offset += 4;
                    }
                }
            }
            _ => {
                for child in &node.children {
                    self.generate_node(child)?;
                }
            }
        }
        Ok(())
    }
}
