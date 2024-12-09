<template>
    <div class="homepage">
        <header>
            <h1>欢迎来到志愿者网站</h1>
            <nav>
                <ul>
                    <li><router-link to="/">主页</router-link></li>
                    <li><router-link to="/about">关于我们</router-link></li>
                    <li><router-link to="/events">活动</router-link></li>
                    <li><router-link to="/contact">联系我们</router-link></li>
                </ul>
            </nav>
        </header>

        <main>
            <li v-for="item in items">
                <ArticleCard :article=item />
            </li>
        </main>

        <footer>
            <p>联系我们：volunteer@example.com</p>
        </footer>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getAllArticle } from '../../api/article';
import ArticleCard from "../../components/ArticleCard.vue";
var items = ref([])

getAllArticle().then(res => {
    if (res.data.code === '000') {
        items.value = res.data.result;
        console.log(items)
        console.log(items.value[0].mainImage)
    }
});
</script>

<style scoped>
.homepage {
    font-family: Arial, sans-serif;
}

header {
    background-color: #f8f8f8;
    padding: 10px 0;
}

header h1 {
    margin: 0;
    padding: 0 20px;
}

nav ul {
    list-style: none;
    padding: 0;
}

nav ul li {
    display: inline;
    margin-right: 10px;
}

main {
    padding: 20px;
}

.news-gallery {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
}

.gallery-item img {
    width: 30%;
    /* 根据实际需要调整图片大小 */
    height: auto;
    border: 1px solid #ddd;
    /* 图片边框 */
    margin: 10px;
}

.zhihu-style {
    max-width: 800px;
    /* 根据实际需要调整宽度 */
    margin: 0 auto;
    padding: 20px;
}

.zhihu-style h2 {
    margin-top: 20px;
}

.zhihu-style ul,
.volunteer-stories div {
    margin-bottom: 20px;
}

footer {
    background-color: #333;
    color: white;
    text-align: center;
    padding: 10px 0;
}

li {
    list-style: none
}
</style>
