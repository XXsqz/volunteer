<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount,getCurrentInstance} from 'vue';
import  QuillEditor from '../components/QuillEditor.vue';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { addArticle, getArticle, updateArticle } from '../api/article';
import { getAllEvent } from '../api/event';

import { ossUpload } from "../api/oss.ts";
import UploadImg from "../components/UploadImg.vue";

const props = defineProps<{
    param1: number;
}>();
const emits = defineEmits(['submitted']);

const title = ref("");
const author = ref("");
const eventId = ref(0);
const userId = ref(0);
interface Event {
    id: number;
    name: string;
}
const events = ref<Event[]>([]);
const content = ref("");
var mainImage = [] as { url: string }[]; // 主图片
const images = ref<string[]>([]); // 用于存储图片的 URL 列表
const editorRef = ref(null);
const isFormValid = computed(() => {
    console.log("content:",content.value);
    return title.value.trim() !== "" && author.value.trim() !== "" && content.value !== "";
});

function submitArticle(flag: boolean) {
    try {
        const quill = editorRef.value.getQuill(); // 获取 Quill 实例
        const editorContent = quill.getContents();
        console.log("editorContent:", editorContent);
        const editorText = quill.getText(0, 200);
        if (props.param1 === 0) {
            if (mainImage.length === 0) {
                ElMessage.warning('请至少上传1张图片作为文章标签图');
                return;
            }
            addArticle({
                title: title.value,
                author: author.value,
                content: JSON.stringify(editorContent),
                abstracts: editorText,
                eventId: eventId.value, // 示例 EventId，可根据实际需求动态获取
                mainImage: mainImage[0].url, // 主图 URL
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
            //console.log("content:",content.value);
            return title.value.trim() !== "" && author.value.trim() !== "" && eventId.value !== 0 && content.value !== "";
        }
        else {
            updateArticle({
                id: props.param1,
                userId: userId.value,
                title: title.value,
                author: author.value,
                content: JSON.stringify(editorContent),
                abstracts: editorText,
                eventId: eventId.value, // 示例 EventId，可根据实际需求动态获取
                mainImage: mainImage[0].url, // 主图 URL
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
    eventId.value = 0;
    mainImage = [];
    images.value = [];
    editorRef.value.getQuill().setContents([{ insert: "\n" }]); // 清空编辑器内容
};

const onEditorChange = (content: any) => {
    console.log("content:", content);
    //updateContent(content);
    content.value = content;
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
            const response = await ossUpload(formData);
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
const isToolbarFixed = ref(false);
const toolBar=ref(null);
const handleScroll = () => {
//     console.log(editorRef.value.$el.querySelector('.ql-editor'));
//     console.log(editorRef.value.$el.querySelector('.ql-editor').getBoundingClientRect());
  const editor = editorRef.value.$el.querySelector('.ql-editor');
  const editorRec = editor.getBoundingClientRect();
  isToolbarFixed.value = editorRec.top < 0;
};

onMounted(() => {
      window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
// onMounted(() => {
//   window.addEventListener('scroll', handleScroll);
// });
// function handleScroll() {
//   const scrollY = window.scrollY;
//   if(Math.abs(scrollNow.value-scrollY)<=300)scrollNow.value = scrollY;
// //   if(scrollY > 100) {
// //     console.log('scrollY:', scrollY);
// //   } 
// }
// const scrollNow = ref(0);
function handleReplace() {
    // editorRef.value.getQuill().getModule('toolbar').addHandler('image', imageHandler);、
    const quill = editorRef.value.getQuill();
    quill.getModule('toolbar').addHandler('image', imageHandler);
    // quill.clipboard.addMatcher(Node.TEXT_NODE, (node, delta) => {
    //     //console.log('Copy event detected:', node);
    //     const selection = window.getSelection();
    //     if (selection) {
    //         const range = selection.getRangeAt(0);
    //         range.collapse(false);
    //         setTimeout(() => {
    //             //console.log('Scroll position:', scrollNow.value);
    //             window.scrollTo(0, scrollNow.value); 
    //         }, 0);
    //     }
    //     return delta;
    // });
    getAllEvent().then(res => {
        console.log(res);
        events.value = res.data.result;
    });
    if (props.param1) {
        //console.log("编辑文章");
        getArticle(Number(props.param1)).then(res => {
            //console.log("获取文章成功:", res);
            title.value = res.data.result.title;
            author.value = res.data.result.author;
            eventId.value = res.data.result.eventId;
            userId.value = res.data.result.userId;
            images.value = res.data.result.images;
            mainImage = [{ url: res.data.result.mainImage }];
            //imageUrl.value = res.data.result.mainImage;
            //imageFileList.value = [{ url: res.data.result.mainImage }]; // 确保 imageFileList 是一个对象数组
            //content.value = res.data.result.content;
            editorRef.value.getQuill().setContents(JSON.parse(res.data.result.content));
        });
    }
}

function getMainImage(url: string) {
    mainImage = [{ url: url }]
}

function delMainImage(url: string) {
    mainImage = []
}

setTimeout(function () {
    if (document) {
        document.getElementById("parentIframe").click();
    }
}, 0);

</script>

<template>
    <div class="editor-container">
        <input type="text" v-model="title" placeholder="请输入文章标题" class="title-input" />
        <input type="text" v-model="author" placeholder="请输入作者名称" class="author-input" />
        <select id="event" v-model="eventId" required class="event-selection">
            <option value="0">请选择项目名称(可选)</option>
            <option v-for="event in events" :key="event.id" :value="event.id">{{ event.name }}</option>
        </select>
        <UploadImg :limit="1" :file-list="mainImage" @getUrl="getMainImage($event)" @delUrl="delMainImage($event)"
            :disabled="false" />
            <QuillEditor theme="snow" toolbar="full" ref="editorRef" v-model="content"
             @update:content="onEditorChange" />
        <el-button id="parentIframe" @click.prevent="handleReplace()" type="primary" style="display: none">
        </el-button>
        <div style="display: flex;">
            <button @click="submitArticle(true)" style="margin-right: 10px;">保存为草稿</button>
            <button @click="submitArticle(false)" :disabled="!isFormValid" :class="{ 'disabled-button': !isFormValid }">
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
.fixed-toolbar {
    :deep(.ql-toolbar.ql-snow){
  position: fixed !important;
  top: 0 !important;
  width: 100% !important;
  z-index: 9999 !important;
  background-color: white !important;
}
}
</style>
