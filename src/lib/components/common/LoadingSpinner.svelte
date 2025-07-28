<script lang="ts">
  interface Props {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
    color?: 'primary' | 'secondary' | 'gray';
  }

  let { size = 'md', text = '', color = 'primary' }: Props = $props();

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'border-primary-600',
    secondary: 'border-secondary-600',
    gray: 'border-gray-600'
  };
</script>

<div class="flex flex-col items-center justify-center space-y-3">
  <div 
    class="loading-spinner {sizeClasses[size]} border-t-{color}-600"
    class:border-gray-300={color === 'gray'}
    class:border-primary-300={color === 'primary'}
    class:border-secondary-300={color === 'secondary'}
  ></div>
  
  {#if text}
    <p class="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
      {text}
    </p>
  {/if}
</div>

<style>
  .loading-spinner {
    border-style: solid;
    border-width: 2px;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>
