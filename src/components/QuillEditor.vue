<!-- QuillEditor.vue -->
<template>
  <div ref="editorContainer"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';


const props = defineProps({
  modelValue: String, // 父组件传入的内容绑定
});
const emit = defineEmits(['update:modelValue']);

const editorContainer = ref<HTMLElement | null>(null);
let quillInstance: Quill | null = null;

onMounted(() => {
  quillInstance = new Quill(editorContainer.value!, {
    theme: 'snow',
    placeholder: '请输入内容...',
    modules: {
      toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline'],
        ['image', 'code-block'],
      ],
    },
  });

  if (props.modelValue) {
    quillInstance.setContents(JSON.parse(props.modelValue));
  }

  // 监听编辑器内容变化
  quillInstance.on('text-change', () => {
    const content = quillInstance!.getContents();
    emit('update:modelValue', JSON.stringify(content)); // 触发更新事件
  });
});

// 使用 `defineExpose` 暴露 Quill 实例
defineExpose({
  getQuill: () => quillInstance,
});
</script>
