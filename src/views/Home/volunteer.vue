<template>
    <div class="homepage">
        <img class="title_img" :src="'https://chinavolunteer.mca.gov.cn/site/static/img/header_bg.acdffe9.png'" />

        <el-input class="search_input" v-model="search_input" @change='searchChange()' placeholder="搜索文章...">
        </el-input>

        <main style="">
            <ul style="display: grid; justify-content: center;">
                <ArticleCard v-for="article in paginatedArticles" :article="article" />
            </ul>

        </main>
        <div class="pagination" v-if="totalPage > 1">
            <a href="#" @click.prevent="prevPage" :class="{ disabled: currentPage === 1 }">上一页
            </a>
            <a href="#" v-for="page in page_range" :key="page" @click.prevent="goToPage(page)"
                :class="{ active: currentPage === page }">{{ page }}
            </a>
            <a href="#" @click.prevent="nextPage" :class="{ disabled: currentPage === totalPage }">下一页
            </a>
        </div>
        <footer>
            <p>联系我们：volunteer@example.com</p>
        </footer>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { getAllArticle } from '../../api/article';
import ArticleCard from "../../components/ArticleCard.vue";
import InputSearch from '../../components/InputSearch.vue'
interface Article {
    id: number;
    title: string;
    abstracts: string;
    mainImage: string;
}
const articles = ref<Article[]>([])
const currentPage = ref(1)
const itemsPerPage = ref(4)
const pageSize = ref(20)
const totalnum = ref(0)
const search_input = ref("")

getAllArticle().then(res => {
    if (res.data.code === '000') {
        articles.value = res.data.result;
        totalnum.value = res.data.result.length;
        //console.log(res.data.result)
        // console.log(items.value[0].mainImage)
    }
});

const totalPage = computed(() => {
    return Math.ceil(totalnum.value / itemsPerPage.value)
})

function prevPage() {
    if (currentPage.value > 1) currentPage.value--
}

function nextPage() {
    if (currentPage.value < totalPage.value) currentPage.value++
}

function goToPage(page: number) {
    currentPage.value = page
}

function searchChange() {
    console.log("change to " + search_input.value)
}

const page_range = computed(() => {
    const end = Math.min(currentPage.value + pageSize.value - 1, totalPage.value);
    const start = Math.min(currentPage.value, Math.max(end - pageSize.value + 1, 1));
    const range = [];
    for (let i = start; i <= end; i++) {
        range.push(i);
    }
    return range;
})
const paginatedArticles = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return articles.value.slice(start, end);
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
    align-items: center;
    list-style: none;
    padding: 0;
}

nav ul li {
    align-items: center;
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

.title_img {
    width: 100%;
}

li {
    list-style: none
}

.search_input {
    margin-top: 20px;
    margin-left: 25%;
    width: 50%
}

.pagination {
    text-align: center;
    margin-top: 20px;
}

.pagination a {
    margin: 0 5px;
    text-decoration: none;
    color: #6200ea;
}

.pagination a.disabled {
    color: grey;
    cursor: not-allowed;
}

.pagination a.active {
    font-weight: bold;
}
</style>
