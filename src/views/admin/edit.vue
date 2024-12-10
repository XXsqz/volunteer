<template>
    <div class="smart-contract-platform">
      <div class="content">
        <aside>   
            <nav>
                <ul>
                    <li :class="{ active: activeMenu === 'home' }" @click="setActiveMenu('home')">主页</li>
                    <li :class="{ active: activeMenu === 'new-project' }" @click="setActiveMenu('new-project')">新建项目</li>
                    <li :class="{ active: activeMenu === 'new-article' }" @click="setActiveMenu('new-article')">新建文章</li>
                    <li :class="{ active: activeMenu === 'view-project' }" @click="setActiveMenu('view-project')">查看项目</li>
                    <li :class="{ active: activeMenu === 'view-article' }" @click="setActiveMenu('view-article')">查看文章</li>
                    <li :class="{ active: activeMenu === 'drafts' }" @click="setActiveMenu('drafts')">草稿箱</li>
                </ul>
            </nav>
        </aside>
        <main v-if="activeMenu === 'view-project'&& if_edit_event=== false">
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
                <td>{{ event.contactPeople }}</td>
                <td>{{ event.location }}</td>
                <td>{{ event.type }}</td>
                <td>{{ event.isFinished ? '已结束' : '未结束' }}</td>
                <td>{{ parseTime(event.updateTime) }}</td>
                <td>
                    <button class="edit-button" @click="editevent(event.id)">修改</button>
                    <button class="delete-button" @click="deleteevent(event.id)">删除</button>
                </td>
                <!-- <td><button class="export-button" @click="exportevent(event.id)">Export</button></td> -->
              </tr>
            </tbody>
          </table>
          <div class="pagination">
            <!-- Pagination controls go here -->
          </div>
        </main>
        <main v-if="activeMenu === 'view-project'&& if_edit_event=== true">
            <NewTable :param1="editid_event" @submitted="handleEventSubmitted"/>
        </main>
        <main v-if="activeMenu === 'view-article'&& if_edit_article=== false">
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
        <main v-if="activeMenu === 'view-article'&& if_edit_article=== true">
            <NewProject :param1="editid_article" @submitted="handleArticleSubmitted"/>
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
import { getEvent,adminGetEvent } from '../../api/event';
import { parseTime } from '../../utils/index';
const searchQuery = ref('');
const events = ref([
    { id: 1, name: 'Health Record Management', contactPeople: 'Lucy', location: 'Room 101', type: 'Health', isFinished: 'No', updateTime: '2021-10-01' },
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
                        //console.log("获取文章成功:", res);
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
function handleEvent(){
    adminGetEvent().then(res => {
        if (res.data.code === '000') {
            //console.log("获取成功:", res);
            events.value = res.data.result;
            // for(const event of events.value){
            //     getEvent(event.eventId).then(res => {
            //         if (res.data.code === '000') {
            //             console.log("获取文章成功:", res);
            //             article.eventName = res.data.result.name;
            //         }
            //         else if (res.data.code === '400') {
            //             alert("获取文章失败，请稍后重试！");
            //         }
            //     });
            // }
        }
        else if (res.data.code === '400') {
            alert("获取文章失败，请稍后重试！");
        }
    });
}

const activeMenu = ref(localStorage.getItem('activeMenu') || 'home');
if(activeMenu.value === 'view-article')handleArticle();
if(activeMenu.value === 'view-project')handleEvent();
watch(activeMenu, (newValue) => {
  localStorage.setItem('activeMenu', newValue);
});
const if_edit_article = ref(false);
const if_edit_event = ref(false);
const setActiveMenu = (menu: string) => {
    activeMenu.value = menu;
    if(menu === 'view-article')handleArticle();
    if(menu === 'view-project')handleEvent();
};
const editid_article = ref(0);
const editid_event= ref(0);
const editarticle = (id: number) => {
    if_edit_article.value = true;
    editid_article .value = id;
    console.log("编辑文章",id);
};
const deletearticle = (id: number) => {
    console.log("删除文章",id);
};
const editevent = (id: number) => {
    if_edit_event.value = true;
    editid_event.value = id;
    console.log("编辑项目",id);
};
const deleteevent = (id: number) => {
    console.log("删除项目",id);
};
const handleArticleSubmitted = () => {
  if_edit_article.value = false;
};
const handleEventSubmitted = () => {
  if_edit_event.value = false;
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