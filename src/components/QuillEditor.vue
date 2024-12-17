<!-- QuillEditor.vue -->
<template>
  <div ref="toolbar" class="ql-toolbar"></div>
  <div ref="editorContainer"></div>
</template>

<script setup lang="ts">
import { onMounted, ref ,onUnmounted} from 'vue';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import '../components/custom-quill-toolbar.css'; // 引入自定义的工具栏样式

const props = defineProps({
  modelValue: String, // 父组件传入的内容绑定
});
const emit = defineEmits(['update:modelValue']);
const toolbar = ref<HTMLElement | null>(null);
const editorContainer = ref<HTMLElement | null>(null);
const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['clean'],
    ['image'],
];
let quillInstance: Quill | null = null;
const flag=ref(false);
const handleScroll = () => {
  if (toolbar.value) {
    const toolbarTop = toolbar.value.getBoundingClientRect().top;
    const toolbarBottom = toolbar.value.getBoundingClientRect().bottom;
    //console.log(toolbarTop, toolbarBottom);
    const editorTop = editorContainer.value!.getBoundingClientRect().top;
    //console.log(editorTop);
    if (toolbarTop <= 0 && !flag.value) {
      toolbar.value.classList.add('fixed');
      flag.value=true;
    }
    else if(flag.value&&toolbarBottom <= editorTop) {
      flag.value=false;
      toolbar.value.classList.remove('fixed');
    }
  }
};
onMounted(() => {
  //有一个bug,就是size和header在选择normal外再选normal,选择项不会改变，但是字体大小会改变
  if (toolbar.value) {
    toolbarOptions.forEach(option => {
      if (Array.isArray(option)) {
        const group = document.createElement('span');
        group.classList.add('ql-formats');
        option.forEach(subOption => {
          if (typeof subOption === 'object') {
            const [key, value] = Object.entries(subOption)[0];
            if (Array.isArray(value)) {
              const select = document.createElement('select');
              select.classList.add(`ql-${key}`);
              value.forEach(val => {
                const option = document.createElement('option');
                option.value = val === false ? '' : val; // 设置为 '' 而不是 false
                if (key === 'header') {
                  option.textContent = val ? `Header ${val}` : 'Normal';
                  if (val === false) {
                    option.selected = true; // 设置默认选项
                  }
                } 
                else if(key === 'size') { 
                  option.textContent = val === false ? 'Normal' : val;
                  if (val === false) {
                    option.selected = true; // 设置默认选项
                  }
                }
                else {
                  option.textContent = val;
                }
                select.appendChild(option);
              });
              group.appendChild(select);
            } else {
              const button = document.createElement('button');
              button.classList.add(`ql-${key}`);
              button.value = value;
              group.appendChild(button);
            }
          } else {
            const button = document.createElement('button');
            button.classList.add(`ql-${subOption}`);
            group.appendChild(button);
          }
        });
        toolbar.value.appendChild(group);
      } else {
        const button = document.createElement('button');
        button.classList.add(`ql-${option}`);
        toolbar.value.appendChild(button);
      }
    });
  }
  quillInstance = new Quill(editorContainer.value!, {
    theme: 'snow',
    placeholder: '请输入内容...',
    modules: {
      toolbar:{
        container: toolbar.value!, // 使用定义的工具栏选项
      },
    },
  });
  
  window.addEventListener('scroll', handleScroll);
  if (props.modelValue) {
    quillInstance.setContents(JSON.parse(props.modelValue));
  }
  // 监听编辑器内容变化
  quillInstance.on('text-change', () => {
    const content = quillInstance!.getContents();
    emit('update:modelValue', JSON.stringify(content)); // 触发更新事件
  });
});
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
// 使用 `defineExpose` 暴露 Quill 实例
defineExpose({
  getQuill: () => quillInstance,
});
</script>
