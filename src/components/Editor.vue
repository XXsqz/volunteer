<script setup lang="ts">
import { ref } from 'vue';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { addArticle } from '../api/article';
import axios from "axios";
import { getAllEvent } from '../api/event';
import { id } from 'element-plus/es/locales.mjs';

const title = ref("");
const author = ref("");
const event = ref("");
const eventId = ref(0);
interface Event{
  id: number;
  name: string;
}
const events = ref<Event[]>([]);
const content = ref("");
const images = ref<string[]>([]); // 用于存储图片的 URL 列表
const editorRef = ref(null);

const submitArticle = async () => {
  // console.log("json", JSON.stringify(content.value));
  console.log("提交文章");
  try {
    const quill = editorRef.value.getQuill(); // 获取 Quill 实例
    //const editorHTML = quill.root.innerHTML; // 获取编辑器的 HTML 内容
    const editorContent = quill.getContents();
    //const editorText = quill.getText(0, 50);
    console.log(eventId.value);
    console.log(editorContent);
    console.log(JSON.stringify(editorContent));
    await addArticle({
      title: title.value,
      author: author.value,
      content: JSON.stringify(editorContent),
      eventId: eventId.value, // 示例 EventId，可根据实际需求动态获取
      images: images.value, // 图片 URL 列表
    }).then(res => {
      if (res.data.code === '000') {
        console.log("文章保存成功:", res);
        alert("文章保存成功！");
        resetForm();
      }
      else if (res.data.code === '400') {
        alert("保存失败，请稍后重试！");
      }
    });
  } catch (error) {
    console.error("保存文章失败:", error);
    alert("保存失败，请稍后重试！");
  }
};

const resetForm = () => {
  title.value = "";
  author.value = "";
  content.value = "";
  images.value = [];
};

const onEditorChange = (content:any) => {
  content.value= content;
};

const imageHandler = () => {
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
      images.value.push(imageUrl); // 保存图片 URL
      const range = editorRef.value.getQuill().getSelection();
      editorRef.value.getQuill().insertEmbed(range.index, "image", imageUrl); // 插入图片
    } catch (error) {
      console.error("图片上传失败:", error);
    }
  };
};
function handleReplace() {
  editorRef.value.getQuill().getModule('toolbar').addHandler('image',imageHandler);
  getAllEvent().then(res => {
    console.log(res);
    events.value = res.data.result;
  });
}
setTimeout(function() {
	if(document) {
		document.getElementById("parentIframe").click();
	}
}, 0);
</script>

<template>
  <div class="editor-container">
    <input type="text" v-model="title" placeholder="请输入文章标题" class="title-input" />
    <input type="text" v-model="author" placeholder="请输入作者名称" class="author-input" />
    <select id="event" v-model="eventId" required class="event-selection" >
      <option value="0">请选择项目名称</option>
      <option v-for="event in events" :key="event" :value="event.id">{{ event.name }}</option>
    </select>
    <QuillEditor
      theme="snow"
      toolbar="full"
      ref="editorRef"
      v-model:content="content"
      @update:content="onEditorChange"
    />
    <el-button id="parentIframe"  @click.prevent="handleReplace()" 
              type="primary" style="display: none">
       </el-button>
    <button @click="submitArticle">保存文章</button>
  </div>
</template>

<style scoped>
.editor-container {
  max-width: 100%;
  max-height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.title-input,
.author-input,
.event-selection {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
}


button {
  align-self: flex-start;
  padding: 10px 20px;
  border: none;
  background-color: #3498db;
  color: white;
  cursor: pointer;
  border-radius: 5px;
}

button:hover {
  background-color: #2980b9;
}
</style>