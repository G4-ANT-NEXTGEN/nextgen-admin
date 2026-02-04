<template>
  <div class="base-card">
    <slot />
  </div>
</template>

<style scoped>
.base-card {
  background-color: var(--color-secondary);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  padding: 1rem;
  border-radius: 8px;
  transition: background-color 0.25s ease-in-out, border-color 0.25s ease-in-out, color 0.25s ease-in-out;
}
</style>
