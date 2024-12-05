<script>
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { addArticle } from '../api/article';
import axios from "axios";
export default {
  components: {
    QuillEditor
  },
  data() {
    return {
      title: "",
      author: "",
      content: "",
      images: [], // 用于存储图片的 URL 列表
      // editorOptions: {
      //   theme: 'snow',
      //   modules: {
      //     toolbar: [
      //       [{ 'header': 1 }, { 'header': 2 }],
      //       ['bold', 'italic', 'underline', 'strike'],
      //       [{'list': 'ordered'}, {'list': 'bullet'}],
      //       ['link'],
      //       ['image'], //保留默认的图片按钮
      //       [{ 'image': 'imageHandler' }], // 使用字符串引用方法名
      //       ['clean']
      //     ]
      //   }
      // }
    };
  },
  mounted() {
    // 确保在组件挂载后访问 Quill 实例
    setTimeout(() => {
      if (this.$refs.editor && this.$refs.editor.getQuill()) {
        this.quill = this.$refs.editor.getQuill();
        this.quill.getModule('toolbar').addHandler('image', this.imageHandler);// 自定义图片按钮功能
      }
    }, 0); 
  },
  methods: {
    onEditorChange(content) {
       this.content = content;
     },
    // 处理图片上传
    imageHandler() {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.click();
      input.onchange = async () => {
        const file = input.files[0];
        const formData = new FormData();
        formData.append("file", file);

        try {
          // 上传图片到后端
          const response = await axios.post("/api/oss/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          const imageUrl = response.data; // 上传返回的图片 URL
          console.log("图片上传:", imageUrl);
          this.images.push(imageUrl); // 保存图片 URL
          const range = this.$refs.editor.getQuill().getSelection(); // 获取光标位置
          this.$refs.editor.getQuill().insertEmbed(range.index, "image", imageUrl); // 插入图片
        } catch (error) {
          console.error("图片上传失败:", error);
        }
      };
    },
    handleContentChange(content) {
    // 在这里可以进行内容转换
    this.content = JSON.stringify(content);
  },
    // 提交文章
    async submitArticle() {
      console.log("json",JSON.stringify(this.content));
      console.log("提交文章");  
      try {
        const quill = this.$refs.editor.getQuill(); // 获取 Quill 实例
        //console.log(quill)
        const editorHTML = quill.root.innerHTML; // 获取编辑器的 HTML 内容
        // 获取编辑器的 Delta 对象
        const editorContent = quill.getContents();
        const editorText = quill.getText(0,50);
        console.log(editorContent)
        console.log(JSON.stringify(editorContent))
        addArticle({
          title: this.title,
          author: this.author,
          content: JSON.stringify(editorContent),
          eventId: 1, // 示例 EventId，可根据实际需求动态获取
          images: this.images, // 图片 URL 列表
        }).then(res => {
          if (res.data.code === '000') {
            console.log("提交文章成功:", res);
            alert("文章提交成功！");
            this.resetForm();
          }
          else if (res.data.code === '400') {
            alert("提交失败，请稍后重试！");
          }
      })
      } catch (error) {
        console.error("提交文章失败:", error);
        alert("提交失败，请稍后重试！");
      }
    },
    resetForm() {
      this.title = "";
      this.author = "";
      this.content = "";
      this.images = [];
    },
  },
};

</script>
<template>
    <input type="text" v-model="title" placeholder="请输入文章标题" class="title-input" />
    <input type="text" v-model="author" placeholder="请输入作者名称" class="author-input" />
    <QuillEditor theme="snow" toolbar="full" ref="editor"
     v-model:content="content" 
     @update:content="onEditorChange"/>
    <button @click="submitArticle">提交文章</button>
</template>
<style scoped>
.editor-container {
  max-width: 100%; /* 限制最大宽度为容器的100% */
  max-height: 100%; /* 限制最大高度为容器的100% */
  overflow: auto; /* 如果内容超出容器，显示滚动条 */
  display: flex;
  flex-direction: column;
  gap: 10px; /* 设置子元素之间的间距 */
}

.title-input, .author-input {
  width: 100%;
  padding: 10px;
  box-sizing: border-box; /* 包括内边距和边框在内的宽度和高度 */
}

button {
  align-self: flex-start; /* 将按钮对齐到容器的起始位置 */
  padding: 10px 20px;
  border: none;
  background-color: #3498db;
  color: white;
  cursor: pointer;
  border-radius: 5px; /* 设置圆角 */
}

button:hover {
  background-color: #2980b9; /* 设置悬停效果 */
}
</style>