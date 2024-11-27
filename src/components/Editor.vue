<script>
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
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
      modules: {
        toolbar: {
          container: [
            ["bold", "italic", "underline", "strike"],
            [{ header: [1, 2, 3, false] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["image", "link"],
            ["clean"],
          ],
          handlers: {
            image: this.imageHandler,
          },
        },
      },
    };
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
          this.images.push(imageUrl); // 保存图片 URL
          const range = this.$refs.editor.quill.getSelection(); // 获取光标位置
          this.$refs.editor.quill.insertEmbed(range.index, "image", imageUrl); // 插入图片
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
        const response = await axios.post("/api/articles/add", {
          title: this.title,
          author: this.author,
          content: JSON.stringify(this.content),
          eventId: 1, // 示例 EventId，可根据实际需求动态获取
          images: this.images, // 图片 URL 列表
        });
        alert("文章提交成功！");
        this.resetForm();
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