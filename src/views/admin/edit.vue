<template>
    <div class="smart-contract-platform">
      <div class="sidebar">
        <aside>   
            <nav>
                <ul>
                    <li :class="{ active: activeMenu === 'home','custom-font': true }" @click="setActiveMenu('home')">主页</li>
                    <li :class="{ active: activeMenu === 'new-project' ,'custom-font': true}" @click="setActiveMenu('new-project')">新建项目</li>
                    <li :class="{ active: activeMenu === 'new-article' ,'custom-font': true}" @click="setActiveMenu('new-article')">新建文章</li>
                    <li :class="{ active: activeMenu === 'view-project','custom-font': true }" @click="setActiveMenu('view-project')">查看项目</li>
                    <li :class="{ active: activeMenu === 'view-article','custom-font': true }" @click="setActiveMenu('view-article')">查看文章</li>
                    <li :class="{ active: activeMenu === 'drafts' ,'custom-font': true}" @click="setActiveMenu('drafts')">草稿箱</li>
                </ul>
            </nav>
        </aside>
        <main v-if="activeMenu === 'view-project'">
          <div class="search-bar">
            <input type="text" placeholder="Please enter the name or ID" v-model="searchQuery" maxlength="20" />
            <button class="actions-button" @click="search">筛选</button>
            <button class="reset-button" @click="resetSearch">清空筛选条件</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>项目名称</th>
                <th>负责人</th>
                <th>活动地址</th>
                <th>类型</th>
                <th>是否结束</th>
                <th>最近更新时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="event in events" :key="event.id">
                <td>{{ event.id }}</td>
                <td>{{ event.name }}</td>
                <td>{{ event.createdBy }}</td>
                <td>{{ event.introduction }}</td>
                <td>{{ event.scope }}</td>
                <td>{{ event.scene }}</td>
                <td>{{ event.lastModifiedTime }}</td>
                <!-- <td><button class="export-button" @click="exportevent(event.id)">Export</button></td> -->
              </tr>
            </tbody>
          </table>
          <div class="pagination">
            <!-- Pagination controls go here -->
          </div>
        </main>
        <main v-if="activeMenu === 'view-article'&& if_edit=== false">
            <!-- <el-button id="parentIframe"  @click.prevent="handleArticle()" 
                type="primary" style="display: none">
            </el-button> -->
            <div class="search-bar">
            <input type="text" placeholder="Please enter the name or ID" v-model="searchQuery" maxlength="20" />
            <button class="actions-button" @click="search">筛选</button>
            <button class="reset-button" @click="resetSearch">清空筛选条件</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>文章名称</th>
                <th>作者</th>
                <th>内容简介</th>
                <th>对应项目</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="article in articles" :key="article.id">
                <td>{{ article.id }}</td>
                <td>{{ article.title }}</td>
                <td>{{ article.author }}</td>
                <td>{{ article.abstracts }}...</td>
                <td>{{ article.eventName }}</td>
                <td>
                    <button class="edit-button" @click="editarticle(article.id)">修改</button>
                    <button class="delete-button" @click="deletearticle(article.id)">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="pagination">
            <!-- Pagination controls go here -->
          </div>
        </main>
        <main v-if="activeMenu === 'view-article'&& if_edit=== true">
            <NewProject :param1="editid" @submitted="handleSubmitted"/>
        </main>
        <main v-if="activeMenu === 'new-project'">
            <!-- <NewProject /> -->
            <NewTable />
        </main>
        <main v-if="activeMenu === 'new-article'">
            <NewProject :param1="0"/>
            <!-- <NewTable /> -->
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
import { ref, computed, watch } from 'vue';
import NewProject from '../../components/Editor.vue'; // 导入新组件
import NewTable from '../../components/Table.vue'; // 导入新组件
import { adminGetArticle } from '../../api/article';
import { getEvent } from '../../api/event';
const searchQuery = ref('');
const events = ref([
    { id: 1, name: 'Health Record Management', createdBy: 'Lucy', introduction: 'Provides Basic Patient Information Management Functionality', scope: 'Healthcare Sector', scene: 'Offline Hospital Scenario', lastModifiedTime: '2024/2/29 20:58:14' },
    // Add other components here...
]);
const articles = ref([
    { id: 1, title: 'Health Record Management', author: 'Lucy', abstracts: 'Provides Basic Patient Information Management Functionality', eventId: 1,eventName: 'Health Record Management' },
    // Add other components here...
]);
function handleArticle(){
    adminGetArticle().then(res => {
        if (res.data.code === '000') {
            //console.log("获取文章成功:", res);
            articles.value = res.data.result;
            for(const article of articles.value){
                getEvent(article.eventId).then(res => {
                    if (res.data.code === '000') {
                        console.log("获取文章成功:", res);
                        article.eventName = res.data.result.name;
                    }
                    else if (res.data.code === '400') {
                        alert("获取文章失败，请稍后重试！");
                    }
                });
            }
        }
        else if (res.data.code === '400') {
            alert("获取文章失败，请稍后重试！");
        }
    });
}





const activeMenu = ref(localStorage.getItem('activeMenu') || 'home');
if(activeMenu.value === 'view-article')handleArticle();
watch(activeMenu, (newValue) => {
  localStorage.setItem('activeMenu', newValue);
});
const if_edit = ref(false);
const setActiveMenu = (menu: string) => {
    activeMenu.value = menu;
    if(menu === 'view-article'){
        handleArticle();
    }
};
const editid = ref(0);
const editarticle = (id: number) => {
    if_edit.value = true;
    editid.value = id;
    console.log("编辑文章",id);
};
const handleSubmitted = () => {
  if_edit.value = false;
};
// const filteredComponents = computed(() => {
//     return components.value.filter(component => 
//         component.name.includes(searchQuery.value) || component.createdBy.includes(searchQuery.value)
//     );
// });
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
    // Export event functionality
};
  
const feedback = () => {
    // Feedback functionality
};
// setTimeout(function() {
// 	if(document) {
// 		document.getElementById("parentIframe").click();
// 	}
// }, 0);
</script>

<style scoped>
.smart-contract-platform {
    display: flex;
    flex-direction: column;
    height: 100vh;
}
  
header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: #f5f5f5;
}
  
.custom-font {
    font-size: large;
    font-weight:lighter;
    cursor:grab;
    font-family: fantasy;
    color: #000;
}
header h1 {
    margin: 0;
    font-size: 24px;
}
  
.user-actions button {
    margin-left: 10px;
}
  
.sidebar {
    display: flex;
    flex: 1;
    
}
  
aside {
    width: 12%;
    background-color: #f8f8f9;
    color: white;
    font-family: fantasy;
    
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
    background-color: #86b7e8;
}

aside nav ul li:hover {
    background-color: #c2dcf7;
}
  
main {
    width: 88%;
    flex-grow: 1;
    padding: 20px;
    background-color: #f8f8fa; /* 设置背景颜色为白色 */
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
    background-color: #0bade7;
    color: #ecf0f1;
}
  
.pagination {
    margin-top: 20px;
    text-align: center;
}

.edit-button {
  background-color: #4CAF50; /* 绿色 */
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
}

.delete-button {
  background-color: #f44336; /* 红色 */
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
}

.edit-button:hover {
  background-color: #45a049;
}

.delete-button:hover {
  background-color: #d32f2f;
}
</style>