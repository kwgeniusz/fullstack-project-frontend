<template>
  <div>
    <AlertContainer />
    <div class="app-container">
      <header class="app-header">
        <h1>Sistema de Pagos</h1>
        <nav class="app-nav">
          <router-link to="/" class="nav-link">Formulario</router-link>
          <router-link to="/submissions" class="nav-link">Ver Registros</router-link>
        </nav>
      </header>
      <main class="app-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import AlertContainer from '@/components/AlertContainer.vue';
</script>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.app-header h1 {
  margin: 0;
  color: #333;
  font-size: 1.8rem;
}

.app-nav {
  display: flex;
  gap: 1rem;
}

.nav-link {
  padding: 0.5rem 1rem;
  color: #333;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: #e0e0e0;
}

.router-link-active {
  background-color: #3498db;
  color: white;
}

.app-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
</style>
