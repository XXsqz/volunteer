<template>
  <div class="article-card">
    <div class="image-container">
      <img :src="article.mainImage" style="width: 150px; height: 150px" alt="Article Image" class="article-image" />
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
  }
};
</script>

<style scoped>
.article-card {
  display: flex;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin: 10px;
  padding: 10px;
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
  flex: 6;
  padding: 0 10px;
}

.title {
  font-size: 18px;
  font-weight: bold;
}

.abstract {
  margin-top: 10px;
}
</style>
