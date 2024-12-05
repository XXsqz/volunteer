<template>
    <div class="smart-contract-platform">
      <div class="content">
        <aside>   
            <nav>
                <ul>
                    <li :class="{ active: activeMenu === 'home' }" @click="setActiveMenu('home')">主页</li>
                    <li :class="{ active: activeMenu === 'new-project' }" @click="setActiveMenu('new-project')">新建项目</li>
                    <li :class="{ active: activeMenu === 'view-projects' }" @click="setActiveMenu('view-projects')">查看项目</li>
                    <li :class="{ active: activeMenu === 'drafts' }" @click="setActiveMenu('drafts')">草稿箱</li>
                </ul>
            </nav>
        </aside>
        <main v-if="activeMenu === 'view-projects'">
          <div class="search-bar">
            <input type="text" placeholder="Please enter the name or ID" v-model="searchQuery" maxlength="20" />
            <button class="actions-button" @click="search">筛选</button>
            <button class="reset-button" @click="resetSearch">清空筛选条件</button>
          </div>
          <!-- <div class="actions">
            <button class="actions-button" @click="newComponent">新建项目 &#43;</button>
            <button class="delete-button" @click="bulkDelete">项目删除 &#8722;</button>
          </div> -->
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Names of the Components</th>
                <th>Created By</th>
                <th>Introduction</th>
                <th>Scope</th>
                <th>Scene</th>
                <th>Last Modified Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="component in filteredComponents" :key="component.id">
                <td>{{ component.id }}</td>
                <td>{{ component.name }}</td>
                <td>{{ component.createdBy }}</td>
                <td>{{ component.introduction }}</td>
                <td>{{ component.scope }}</td>
                <td>{{ component.scene }}</td>
                <td>{{ component.lastModifiedTime }}</td>
                <td><button class="export-button" @click="exportComponent(component.id)">Export</button></td>
              </tr>
            </tbody>
          </table>
          <div class="pagination">
            <!-- Pagination controls go here -->
          </div>
        </main>
        <main v-if="activeMenu === 'new-project'">
            <NewProject />
        </main>
        <main v-if="activeMenu === 'drafts'">
          <h1>Drafts</h1>
          <p>Here you can view and manage your drafts.</p>
        </main>
        <main v-if="activeMenu === 'home'">
          <h1>Home</h1>
          <p>Here you can view and manage your drafts.</p>
        </main>
      </div>
    </div>
  </template>
  
<script setup lang="ts">
import { ref, computed } from 'vue';
import NewProject from '../../components/Editor.vue'; // 导入新组件
const searchQuery = ref('');
const components = ref([
    { id: 1, name: 'Health Record Management', createdBy: 'Lucy', introduction: 'Provides Basic Patient Information Management Functionality', scope: 'Healthcare Sector', scene: 'Offline Hospital Scenario', lastModifiedTime: '2024/2/29 20:58:14' },
    // Add other components here...
]);
const activeMenu = ref('home');
const setActiveMenu = (menu: string) => {
    activeMenu.value = menu;
};
const filteredComponents = computed(() => {
    return components.value.filter(component => 
        component.name.includes(searchQuery.value) || component.createdBy.includes(searchQuery.value)
    );
});
const search = () => {
    // Search functionality
};
  
const resetSearch = () => {
    searchQuery.value = '';
};

const bulkDelete = () => {
    // Bulk delete functionality
};
  
const exportComponent = (id: number) => {
    // Export component functionality
};
  
const feedback = () => {
    // Feedback functionality
};
</script>

<style scoped>
.smart-contract-platform {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: white; /* 设置背景颜色为白色 */
}
  
header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: #f5f5f5;
}
  
header h1 {
    margin: 0;
    font-size: 24px;
}
  
.user-actions button {
    margin-left: 10px;
}
  
.content {
    display: flex;
    flex: 1;
}
  
aside {
    width: 12%;
    background-color: #2c3e50;
    color: #ecf0f1;
}
  
aside nav ul {
    list-style: none;
    padding: 0;
}
  
aside nav ul li {
    padding: 10px;
    cursor: pointer;
}
  
aside nav ul li.active {
    background-color: #34495e;
}
  
main {
    width: 88%;
    flex-grow: 1;
    padding: 20px;
    background-color: white; /* 设置背景颜色为白色 */
}
  
.search-bar {
    display: flex;
    margin-bottom: 20px;
}
  
.search-bar input {
    flex-grow: 1;
    margin-right: 5px;
    padding: 10px;
    border-radius: 5px; /* 设置圆角 */
    max-width: 300px; /* 设置最大宽度 */
}
  
.search-bar button {
    padding: 10px 20px;
    margin-right: 5px;
    border-radius: 5px; /* 设置圆角 */
}
  
.actions-button {
    background-color: #3498db;
    color: white;
    border: none;
    cursor: pointer;
}
  
.reset-button {
    background-color: #09d209;
    color: white;
    border: none;
    cursor: pointer;
}
  
.actions button {
    padding: 10px 20px;
    margin-right: 5px;
    border-radius: 5px;
}
 
  
.delete-button {
    background-color: #e74c3c;
    color: white;
    border: none;
    cursor: pointer;
}
  
.export-button {
    background-color: #f39c12;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 10px; /* 设置圆角 */
}
  
table {
    width: 100%;
    border-collapse: collapse;
}
  
table th, table td {
    padding: 10px;
    border: 1px solid #95a5a6;
    text-align: left;
}
  
table thead th {
    background-color: #34495e;
    color: #ecf0f1;
}
  
.pagination {
    margin-top: 20px;
    text-align: center;
}
</style>