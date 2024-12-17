<template>
    <div>
      <!-- 容器用于 Quill 编辑器挂载 -->
      <div id="editor"></div>
    </div>
  </template>
  
  <script>
  import Quill from 'quill';
  import 'quill/dist/quill.snow.css'; // 引入 Quill 的默认主题样式
  
  export default {
    name: 'QuillEditor',
    data() {
      return {
        quill: null, // 存储 Quill 实例
      };
    },
    mounted() {
      // 初始化 Quill 编辑器
      this.quill = new Quill('#editor', {
        theme: 'snow', // 主题: snow（默认）或 bubble
        placeholder: '请输入内容...',
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            ['image', 'code-block'],
          ],
        },
      });
  
      // 监听内容变化
      this.quill.on('text-change', () => {
        console.log('编辑器内容:', this.quill.root.innerHTML);
      });
    },
    beforeDestroy() {
      // 销毁 Quill 实例
      this.quill = null;
    },
  };
  </script>
  
  <style>
  /* 自定义样式（可选） */
  #editor {
    height: 300px;
  }
  </style>
  