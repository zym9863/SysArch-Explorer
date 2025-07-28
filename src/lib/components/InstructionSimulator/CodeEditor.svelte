<script lang="ts">
  import { onMount } from 'svelte';
  import { FileText, Play } from 'lucide-svelte';
  import { simulatorState, simulatorActions } from '$lib/stores/simulator';

  let editorContainer: HTMLDivElement;

  // 使用全局状态
  let code = $derived($simulatorState.sourceCode);
  let selectedLanguage = $derived($simulatorState.language);
  
  const languages = [
    { id: 'c', name: 'C', example: `// 简单的C语言示例
#include <stdio.h>

int main() {
    int a = 5;
    int b = 3;
    int sum = a + b;
    printf("结果: %d\\n", sum);
    return 0;
}` },
    { id: 'cpp', name: 'C++', example: `// 简单的C++示例
#include <iostream>
using namespace std;

int main() {
    int a = 5;
    int b = 3;
    int sum = a + b;
    cout << "结果: " << sum << endl;
    return 0;
}` },
    { id: 'java', name: 'Java', example: `// 简单的Java示例
public class Main {
    public static void main(String[] args) {
        int a = 5;
        int b = 3;
        int sum = a + b;
        System.out.println("结果: " + sum);
    }
}` }
  ];

  function changeLanguage(langId: string) {
    simulatorActions.updateLanguage(langId);
    const lang = languages.find(l => l.id === langId);
    if (lang) {
      simulatorActions.updateSourceCode(lang.example);
    }
  }

  function compileCode() {
    // 开始编译过程
    simulatorActions.startCompilation();
    console.log('编译代码:', code);
  }

  function handleCodeChange(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    if (target) {
      simulatorActions.updateSourceCode(target.value);
    }
  }

  onMount(() => {
    // 这里可以集成Monaco Editor或其他代码编辑器
    // 暂时使用简单的textarea
  });
</script>

<div class="h-full flex flex-col">
  <!-- 编辑器工具栏 -->
  <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-2">
          <FileText class="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span class="font-medium text-gray-900 dark:text-white">代码编辑器</span>
        </div>
        
        <!-- 语言选择 -->
        <select
          class="input text-sm"
          bind:value={selectedLanguage}
          onchange={(e) => {
            const target = e.target as HTMLSelectElement;
            if (target) changeLanguage(target.value);
          }}
        >
          {#each languages as lang}
            <option value={lang.id}>{lang.name}</option>
          {/each}
        </select>
      </div>

      <button
        class="btn btn-primary flex items-center space-x-2"
        onclick={compileCode}
      >
        <Play class="w-4 h-4" />
        <span>编译运行</span>
      </button>
    </div>
  </div>

  <!-- 编辑器主体 -->
  <div class="flex-1 flex">
    <!-- 代码编辑区域 -->
    <div class="flex-1 p-4">
      <div class="h-full">
        <textarea
          class="w-full h-full p-4 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          value={code}
          oninput={handleCodeChange}
          placeholder="在此输入您的代码..."
          spellcheck="false"
        ></textarea>
      </div>
    </div>

    <!-- 信息面板 -->
    <div class="w-80 bg-gray-50 dark:bg-gray-700 border-l border-gray-200 dark:border-gray-600 p-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        代码信息
      </h3>
      
      <!-- 代码统计 -->
      <div class="space-y-3 mb-6">
        <div class="flex justify-between text-sm">
          <span class="text-gray-600 dark:text-gray-400">行数:</span>
          <span class="font-medium">{code.split('\n').length}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-600 dark:text-gray-400">字符数:</span>
          <span class="font-medium">{code.length}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-600 dark:text-gray-400">语言:</span>
          <span class="font-medium">{languages.find(l => l.id === selectedLanguage)?.name}</span>
        </div>
      </div>

      <!-- 编译选项 -->
      <div class="mb-6">
        <h4 class="text-md font-semibold text-gray-900 dark:text-white mb-3">
          编译选项
        </h4>
        <div class="space-y-2">
          <label class="flex items-center">
            <input type="checkbox" class="mr-2" checked />
            <span class="text-sm">显示编译步骤</span>
          </label>
          <label class="flex items-center">
            <input type="checkbox" class="mr-2" checked />
            <span class="text-sm">生成汇编代码</span>
          </label>
          <label class="flex items-center">
            <input type="checkbox" class="mr-2" />
            <span class="text-sm">优化代码</span>
          </label>
        </div>
      </div>

      <!-- 示例代码 -->
      <div>
        <h4 class="text-md font-semibold text-gray-900 dark:text-white mb-3">
          示例代码
        </h4>
        <div class="space-y-2">
          {#each languages as lang}
            <button
              class="w-full text-left p-2 rounded text-sm transition-colors duration-200 {selectedLanguage === lang.id 
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600'}"
              onclick={() => changeLanguage(lang.id)}
            >
              {lang.name} 示例
            </button>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>
