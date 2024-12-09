<template>
    <div class="container">
        <div class="header">
            <h1>{{ title }}</h1>
            <p>{{ author }}</p>
        </div>
        <div class="content">
            <div class="html-content" v-html="htmlContent"></div>
        </div>
    </div>
</template>

<script setup lang="ts">

import { ref } from 'vue';
import { getArticle } from '../../api/article';
import Quill from 'quill';

import { useRoute } from 'vue-router';
const route = useRoute();
const articleId = route.params.id
// 在组件挂载时获取文章ID并输出

// import renderer from 'quilljs-renderer';
// const Document = renderer.Document;
// renderer.loadFormat('html');
const title = ref('文章标题');
const author = ref('作者名称');
const htmlContent = ref('<p>1<strong>1<em>12<u>4</u></em><u>35</u></strong></p>');


console.log("Article ID:", articleId);
let quill: Quill;
const quillContainer = document.createElement('div');
quill = new Quill(quillContainer);
handleArticleContent(articleId)
function handleArticleContent(id: number) {
    getArticle(id).then((res) => {
        console.log(res);
        title.value = res.data.result.title;
        author.value = res.data.result.author;
        console.log(JSON.parse(res.data.result.content));
        const delta = JSON.parse(res.data.result.content);
        quill.setContents(delta);
        htmlContent.value = quill.root.innerHTML;
    });
}
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    padding: 20px;
    box-sizing: border-box;
}

.header {
    text-align: center;
    margin-bottom: 10px;
}

.content {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    width: 100%;
    height: 100%;
}

.html-content {
    width: 70%;
    height: 100%;
    background-color: #f9f9f9;
    padding: 20px;
    box-sizing: border-box;
    overflow: auto;
}
</style>
