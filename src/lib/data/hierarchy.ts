import type { HierarchyData, SystemLayer, Concept, LayerInterface } from '../types/system';

// 系统层次结构概念定义
const concepts: { [key: string]: Concept[] } = {
  application: [
    {
      id: 'user-programs',
      name: '用户程序',
      nameEn: 'User Programs',
      description: '由用户编写和运行的应用程序，如文本编辑器、游戏、浏览器等',
      examples: ['Microsoft Word', 'Chrome浏览器', '游戏应用'],
      relatedConcepts: ['api-calls', 'system-calls']
    },
    {
      id: 'api-calls',
      name: 'API调用',
      nameEn: 'API Calls',
      description: '应用程序通过API接口调用系统服务和库函数',
      examples: ['文件读写API', '网络通信API', '图形界面API'],
      relatedConcepts: ['user-programs', 'system-calls']
    }
  ],
  highlevel: [
    {
      id: 'programming-languages',
      name: '编程语言',
      nameEn: 'Programming Languages',
      description: '高级编程语言提供抽象的编程接口，隐藏底层实现细节',
      examples: ['C/C++', 'Java', 'Python', 'JavaScript'],
      relatedConcepts: ['compilers', 'interpreters']
    },
    {
      id: 'compilers',
      name: '编译器',
      nameEn: 'Compilers',
      description: '将高级语言代码转换为机器代码或中间代码的程序',
      examples: ['GCC', 'Clang', 'MSVC', 'JVM'],
      relatedConcepts: ['programming-languages', 'assembly-code']
    }
  ],
  assembly: [
    {
      id: 'assembly-code',
      name: '汇编代码',
      nameEn: 'Assembly Code',
      description: '使用助记符表示的低级编程语言，与机器指令一一对应',
      examples: ['MOV AX, BX', 'ADD EAX, EBX', 'JMP LABEL'],
      relatedConcepts: ['assemblers', 'machine-instructions']
    },
    {
      id: 'assemblers',
      name: '汇编器',
      nameEn: 'Assemblers',
      description: '将汇编代码转换为机器代码的程序',
      examples: ['NASM', 'MASM', 'GAS'],
      relatedConcepts: ['assembly-code', 'machine-instructions']
    }
  ],
  system: [
    {
      id: 'operating-system',
      name: '操作系统',
      nameEn: 'Operating System',
      description: '管理计算机硬件资源，为应用程序提供服务的系统软件',
      examples: ['Windows', 'Linux', 'macOS', 'Android'],
      relatedConcepts: ['device-drivers', 'system-calls']
    },
    {
      id: 'device-drivers',
      name: '设备驱动程序',
      nameEn: 'Device Drivers',
      description: '操作系统与硬件设备之间的接口程序',
      examples: ['显卡驱动', '网卡驱动', '声卡驱动'],
      relatedConcepts: ['operating-system', 'hardware-interface']
    }
  ],
  isa: [
    {
      id: 'instruction-set',
      name: '指令集',
      nameEn: 'Instruction Set',
      description: 'CPU能够执行的所有指令的集合，定义了软硬件接口',
      examples: ['x86-64', 'ARM', 'RISC-V', 'MIPS'],
      relatedConcepts: ['machine-instructions', 'cpu-architecture']
    },
    {
      id: 'machine-instructions',
      name: '机器指令',
      nameEn: 'Machine Instructions',
      description: 'CPU能够直接执行的二进制指令',
      examples: ['10110000 01100001', '11000111 00000001'],
      relatedConcepts: ['instruction-set', 'cpu-execution']
    }
  ],
  microarch: [
    {
      id: 'cpu-architecture',
      name: 'CPU架构',
      nameEn: 'CPU Architecture',
      description: 'CPU内部的组织结构和数据通路设计',
      examples: ['流水线', '超标量', '乱序执行', '分支预测'],
      relatedConcepts: ['alu', 'control-unit', 'registers']
    },
    {
      id: 'alu',
      name: '算术逻辑单元',
      nameEn: 'ALU',
      description: '执行算术和逻辑运算的CPU组件',
      examples: ['加法器', '乘法器', '逻辑门阵列'],
      relatedConcepts: ['cpu-architecture', 'logic-gates']
    }
  ],
  logic: [
    {
      id: 'logic-gates',
      name: '逻辑门',
      nameEn: 'Logic Gates',
      description: '实现基本逻辑运算的电子电路',
      examples: ['AND门', 'OR门', 'NOT门', 'XOR门'],
      relatedConcepts: ['boolean-algebra', 'transistors']
    },
    {
      id: 'boolean-algebra',
      name: '布尔代数',
      nameEn: 'Boolean Algebra',
      description: '处理逻辑运算的数学体系',
      examples: ['A AND B', 'A OR B', 'NOT A'],
      relatedConcepts: ['logic-gates', 'digital-circuits']
    }
  ],
  physical: [
    {
      id: 'transistors',
      name: '晶体管',
      nameEn: 'Transistors',
      description: '构成数字电路的基本电子器件，实现开关功能',
      examples: ['MOSFET', 'BJT', 'FinFET'],
      relatedConcepts: ['semiconductors', 'integrated-circuits']
    },
    {
      id: 'semiconductors',
      name: '半导体',
      nameEn: 'Semiconductors',
      description: '制造晶体管和集成电路的基础材料',
      examples: ['硅', '锗', '砷化镓'],
      relatedConcepts: ['transistors', 'chip-manufacturing']
    }
  ]
};

// 层级接口定义
const interfaces: LayerInterface[] = [
  {
    id: 'app-to-highlevel',
    name: '应用程序接口',
    description: '应用程序通过编程语言API调用系统功能',
    fromLayer: 'application',
    toLayer: 'highlevel',
    type: 'downward',
    protocols: ['函数调用', '库接口', 'API调用']
  },
  {
    id: 'highlevel-to-assembly',
    name: '编译接口',
    description: '编译器将高级语言代码转换为汇编代码',
    fromLayer: 'highlevel',
    toLayer: 'assembly',
    type: 'downward',
    protocols: ['词法分析', '语法分析', '代码生成']
  },
  {
    id: 'assembly-to-system',
    name: '系统调用接口',
    description: '汇编代码通过系统调用访问操作系统服务',
    fromLayer: 'assembly',
    toLayer: 'system',
    type: 'bidirectional',
    protocols: ['系统调用', '中断处理', '异常处理']
  },
  {
    id: 'system-to-isa',
    name: '指令集接口',
    description: '操作系统通过指令集架构控制硬件',
    fromLayer: 'system',
    toLayer: 'isa',
    type: 'downward',
    protocols: ['机器指令', '特权指令', '中断向量']
  },
  {
    id: 'isa-to-microarch',
    name: '微架构接口',
    description: '指令集通过微架构在硬件上实现',
    fromLayer: 'isa',
    toLayer: 'microarch',
    type: 'downward',
    protocols: ['指令解码', '流水线控制', '资源调度']
  },
  {
    id: 'microarch-to-logic',
    name: '逻辑实现接口',
    description: '微架构通过数字逻辑电路实现',
    fromLayer: 'microarch',
    toLayer: 'logic',
    type: 'downward',
    protocols: ['逻辑综合', '时序控制', '信号传输']
  },
  {
    id: 'logic-to-physical',
    name: '物理实现接口',
    description: '逻辑门通过晶体管等物理器件实现',
    fromLayer: 'logic',
    toLayer: 'physical',
    type: 'downward',
    protocols: ['电路布局', '工艺制程', '物理设计']
  }
];

// 系统层次结构定义
const layers: SystemLayer[] = [
  {
    id: 'application',
    name: '应用层',
    nameEn: 'Application Layer',
    description: '用户直接交互的应用程序和软件',
    level: 7,
    color: '#10B981',
    icon: 'monitor',
    concepts: concepts.application,
    interfaces: interfaces.filter(i => i.fromLayer === 'application' || i.toLayer === 'application'),
    examples: ['文本编辑器', '网页浏览器', '游戏应用', '办公软件']
  },
  {
    id: 'highlevel',
    name: '高级语言层',
    nameEn: 'High-Level Language Layer',
    description: '提供抽象编程接口的高级编程语言',
    level: 6,
    color: '#3B82F6',
    icon: 'code',
    concepts: concepts.highlevel,
    interfaces: interfaces.filter(i => i.fromLayer === 'highlevel' || i.toLayer === 'highlevel'),
    examples: ['C/C++程序', 'Java应用', 'Python脚本', 'JavaScript代码']
  },
  {
    id: 'assembly',
    name: '汇编语言层',
    nameEn: 'Assembly Language Layer',
    description: '使用助记符的低级编程语言',
    level: 5,
    color: '#8B5CF6',
    icon: 'terminal',
    concepts: concepts.assembly,
    interfaces: interfaces.filter(i => i.fromLayer === 'assembly' || i.toLayer === 'assembly'),
    examples: ['MOV指令', 'ADD指令', 'JMP指令', '汇编程序']
  },
  {
    id: 'system',
    name: '系统软件层',
    nameEn: 'System Software Layer',
    description: '管理硬件资源的系统软件',
    level: 4,
    color: '#F59E0B',
    icon: 'settings',
    concepts: concepts.system,
    interfaces: interfaces.filter(i => i.fromLayer === 'system' || i.toLayer === 'system'),
    examples: ['操作系统内核', '设备驱动', '系统调用', '中断处理']
  },
  {
    id: 'isa',
    name: '指令集架构层',
    nameEn: 'ISA Layer',
    description: '定义软硬件接口的指令集架构',
    level: 3,
    color: '#EF4444',
    icon: 'cpu',
    concepts: concepts.isa,
    interfaces: interfaces.filter(i => i.fromLayer === 'isa' || i.toLayer === 'isa'),
    examples: ['x86指令集', 'ARM指令集', 'RISC-V指令集', '机器码']
  },
  {
    id: 'microarch',
    name: '微架构层',
    nameEn: 'Microarchitecture Layer',
    description: 'CPU内部的组织结构和实现',
    level: 2,
    color: '#EC4899',
    icon: 'zap',
    concepts: concepts.microarch,
    interfaces: interfaces.filter(i => i.fromLayer === 'microarch' || i.toLayer === 'microarch'),
    examples: ['流水线', '缓存', '分支预测器', '执行单元']
  },
  {
    id: 'logic',
    name: '逻辑层',
    nameEn: 'Logic Layer',
    description: '实现数字逻辑功能的电路层',
    level: 1,
    color: '#6366F1',
    icon: 'circuit-board',
    concepts: concepts.logic,
    interfaces: interfaces.filter(i => i.fromLayer === 'logic' || i.toLayer === 'logic'),
    examples: ['逻辑门', '触发器', '计数器', '数字电路']
  },
  {
    id: 'physical',
    name: '物理层',
    nameEn: 'Physical Layer',
    description: '构成计算机的物理器件和材料',
    level: 0,
    color: '#64748B',
    icon: 'chip',
    concepts: concepts.physical,
    interfaces: interfaces.filter(i => i.fromLayer === 'physical' || i.toLayer === 'physical'),
    examples: ['晶体管', '集成电路', '半导体材料', '芯片制造']
  }
];

export const hierarchyData: HierarchyData = {
  layers: layers.sort((a, b) => b.level - a.level), // 按层级从高到低排序
  totalLevels: 8,
  description: '计算机系统的经典层次结构，从用户应用到物理器件的完整抽象层次'
};
