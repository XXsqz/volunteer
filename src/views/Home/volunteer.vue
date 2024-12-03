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
        <!-- 新闻网站风格的图片展示 -->
        <section class="news-gallery">
          <div class="gallery-item" v-for="(image, index) in images" :key="index">
            <img :src="image.src" :alt="image.alt" />
          </div>
        </section>
  
        <!-- 知乎风格的下半部分内容展示 -->
        <section class="zhihu-style">
          <h2>即将到来的活动</h2>
          <ul>
            <li v-for="event in events" :key="event.id">
              <h3>{{ event.title }}</h3>
              <p>{{ event.date }}</p>
              <p>{{ event.description }}</p>
            </li>
          </ul>
  
          <section class="volunteer-stories">
            <h2>志愿者故事</h2>
            <div v-for="story in stories" :key="story.id">
              <h3>{{ story.title }}</h3>
              <p>{{ story.content }}</p>
            </div>
          </section>
        </section>
      </main>
  
      <footer>
        <p>联系我们：volunteer@example.com</p>
      </footer>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  // 假设的活动数据
  const events = ref([
    { id: 1, title: '社区清洁', date: '2024-12-10', description: '帮助清理社区公园。' },
    { id: 2, title: '慈善义卖', date: '2024-12-15', description: '为慈善机构筹集资金。' },
  ]);
  
  // 假设的志愿者故事数据
  const stories = ref([
    { id: 1, title: '我的志愿者之旅', content: '作为一名志愿者，我感到非常自豪...' },
    { id: 2, title: '改变生活的体验', content: '参与志愿者活动改变了我的生活...' },
  ]);
  
  // 假设的图片数据
  const images = ref([
    { src: 'image1.jpg', alt: '图片1' },
    { src: 'image2.jpg', alt: '图片2' },
    { src: 'image3.jpg', alt: '图片3' },
  ]);
  
  // 点击加入按钮时调用的方法
  const joinUs = () => {
    alert('感谢您的加入！请填写报名表单。');
  };
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
    width: 30%; /* 根据实际需要调整图片大小 */
    height: auto;
    border: 1px solid #ddd; /* 图片边框 */
    margin: 10px;
  }
  
  .zhihu-style {
    max-width: 800px; /* 根据实际需要调整宽度 */
    margin: 0 auto;
    padding: 20px;
  }
  
  .zhihu-style h2 {
    margin-top: 20px;
  }
  
  .zhihu-style ul, .volunteer-stories div {
    margin-bottom: 20px;
  }
  
  footer {
    background-color: #333;
    color: white;
    text-align: center;
    padding: 10px 0;
  }
  </style>