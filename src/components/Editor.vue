<script setup lang="ts">
import { ref,computed} from 'vue';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { addArticle, getArticle, updateArticle } from '../api/article';
import axios from "axios";
import { getAllEvent } from '../api/event';
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  param1: number;
}>();
const emits = defineEmits(['submitted']);

const title = ref("");
const author = ref("");
const eventId = ref(0);
const userId = ref(0);
interface Event{
  id: number;
  name: string;
}
const events = ref<Event[]>([]);
const content = ref("");
const images = ref<string[]>([]); // 用于存储图片的 URL 列表
const editorRef = ref(null);
const isFormValid = computed(() => {
  console.log("content:",content.value);
  return title.value.trim() !== "" && author.value.trim() !== "" && eventId.value !== 0 && content.value !== "";
});

function submitArticle(flag: boolean) {
  if(images.value.length === 0){//目前就只能这样实现。。。
    ElMessage.warning('请至少上传1张图片作为文章标签图');
    return;
  }
  try {
    const quill = editorRef.value.getQuill(); // 获取 Quill 实例
    const editorContent = quill.getContents();
    const editorText = quill.getText(0, 200);
    if(props.param1 === 0){
      addArticle({
        title: title.value,
        author: author.value,
        content: JSON.stringify(editorContent),
        abstracts: editorText,
        eventId: eventId.value, // 示例 EventId，可根据实际需求动态获取
        mainImage: images.value[0], // 主图 URL
        images: images.value, // 图片 URL 列表
        isDraft: flag,
      }).then(res => {
        if (res.data.code === '000') {
          console.log("文章保存成功:", res);
          alert("文章保存成功！");
          resetForm();
          //emits('submitted');
        }
        else if (res.data.code === '400') {
          alert("保存失败，请稍后重试！");
        }
      });
    }
    else{
      updateArticle({
        id: props.param1,
        userId: userId.value,
        title: title.value,
        author: author.value,
        content: JSON.stringify(editorContent),
        abstracts: editorText,
        eventId: eventId.value, // 示例 EventId，可根据实际需求动态获取
        mainImage: images.value[0], // 主图 URL
        images: images.value, // 图片 URL 列表
        isDraft: flag,
      }).then(res => {
        if (res.data.code === '000') {
          console.log("文章保存成功:", res);
          alert("文章保存成功！");
          resetForm();
          emits('submitted');
        }
        else if (res.data.code === '400') {
          alert("保存失败，请稍后重试！");
        }
      });
    }
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
    if (!input.files) return;
    const file = input.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      // 上传图片到后端
      const response = await axios.post("/api/oss/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const imageUrl = response.data; // 上传返回的图片 URL
      //console.log("图片上传:", imageUrl);
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
  if(props.param1){
    //console.log("编辑文章");
    getArticle(Number(props.param1)).then(res => {
      //console.log("获取文章成功:", res);
      title.value = res.data.result.title;
      author.value = res.data.result.author;
      eventId.value = res.data.result.eventId;
      userId.value = res.data.result.userId;
      images.value = res.data.result.images;
      //imageUrl.value = res.data.result.mainImage;
      //imageFileList.value = [{ url: res.data.result.mainImage }]; // 确保 imageFileList 是一个对象数组
      //content.value = res.data.result.content;
      editorRef.value.getQuill().setContents(JSON.parse(res.data.result.content));
    });
  }
}
setTimeout(function() {
	if(document) {
		document.getElementById("parentIframe").click();
	}
}, 0);
// const imageUrl = ref('')
// const imageFileList = ref([])
// function uploadImage(formData: FormData) {
//   return axios.post('/api/oss/upload', formData, {
//     headers: { 'Content-Type': 'multipart/form-data' }
//   })
// }
// function handleChange(file: any, fileList: any) {
//     if(file.name.length > 10){
//       file.name=file.name.substr(0, 10) + "..." +file.name.substr(file.name.length-4, file.name.length)
//     }
//     if(fileList.length >= 1){
//       console.log("图:",fileList)
//       imageFileList.value = fileList
//       let formData = new FormData()
//       formData.append('file', file.raw)
//       uploadImage(formData).then(res => {
//         imageUrl.value = res.data
//       })
//     }
//     else {
//       ElMessage.warning('请至少上传1张图片');
//       imageUrl.value = ''
//     }
// }

// function handleExceed() {
//   ElMessage.warning(`当前限制选择 1 个文件`);
// }

// function uploadHttpRequest() {
//   return new XMLHttpRequest()
// }
// function beforeUpload(file: any) {
//     if (file.size / 1024 / 1024 > 1) {
//       ElMessage({
//         message: "上传文件大小不能超过1M!",
//         type: 'error',
//         center: true,
//       })
//       return false;
//     }
//     return true;
// }
</script>

<template>
  <div class="editor-container">
    <input type="text" v-model="title" placeholder="请输入文章标题" class="title-input" />
    <input type="text" v-model="author" placeholder="请输入作者名称" class="author-input" />
    <select id="event" v-model="eventId" required class="event-selection" >
      <option value="0">请选择项目名称</option>
      <option v-for="event in events" :key="event.id" :value="event.id">{{ event.name }}</option>
    </select>
      <!-- <el-form-item label="文章主题logo" >
        <el-upload
          v-model:file-list="imageFileList"
          :limit="1"
          :before-upload="beforeUpload"
          :on-change="handleChange"
          :on-exceed="handleExceed"
          :on-remove="handleChange"
          class="upload-demo"
          list-type="picture"
          :http-request="uploadHttpRequest"
          drag
        >
        <div v-if="!imageUrl">
            <el-icon class="el-icon--upload">
              <upload-filled />
            </el-icon>
            <div class="el-upload__text">
              将文件拖到此处或单击此处上传。仅允许上传一份文件。
            </div>
          </div>
          <img v-else :src="imageUrl" class="uploaded-image" />
        </el-upload>
      </el-form-item> -->
    
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
    <div style="display: flex;">
      <button @click="submitArticle(true)" style="margin-right: 10px;">保存为草稿</button>
      <button 
        @click="submitArticle(false)" 
        :disabled="!isFormValid" 
        :class="{ 'disabled-button': !isFormValid }">
        保存文章
      </button>
    </div>
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

button.disabled-button {
  background-color: #cccccc;
  cursor: not-allowed;
}

.uploaded-image {
  width: auto;
  height: 150px;
  object-fit: cover;
}
</style>