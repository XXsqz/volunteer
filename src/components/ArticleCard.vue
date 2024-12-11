<template>
    <div class="article-card" @click="handle(article.id)">
        <div class="image-container">
            <img :src="article.mainImage" style="width: 150px; height: 150px" alt="Article Image"
                class="article-image" />
        </div>
        <div class="content">
            <div class="title">{{ article.title }}</div>
            <div class="abstract">{{ article.abstracts }}</div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        article: {
            type: Object,
            required: true
        }
    },
    methods: {
        handle(id) {
            this.$router.push({ path: '/volunteerDetail/' + id });
        }
    }
};
</script>

<style scoped>
.article-card {
    display: flex;
    border: 1px solid #ccc;
    border-radius: 10px;
    margin: 15px;
    padding: 10px;
    width: 1000px;
    text-decoration: none;
    color: inherit;
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.article-card:hover {
    transform: scale(1.03);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.article-card:active {
    transform: scale(0.95);
}

.image-container {
    flex: 1;
}

.article-image {
    width: 100%;
    height: auto;
    border-radius: 5px;
}

.content {
    flex: 7;
    padding: 0 10px;
}

.title {
    margin: 5px 10px;
    font-size: 25px;
    font-weight: bold;
    font-family: 'Arial', sans-serif;
}

.abstract {
    margin: 10px 10px;
    margin-top: 10px;
    color: #777;
    /* 设置为灰色 */
}
</style>
