<script setup lang="ts">
import {ref,defineProps,defineExpose,defineEmits} from 'vue';
import {commentCreate, getResComments} from '../../api/comments.ts'
import {UserFilled} from "@element-plus/icons-vue"
// 定义props
const props=defineProps({
    title: {
        type: String,
        default: '标题',
    },
    commentss: {
        type: Object,
        required: true,
    },
});
interface Comment{
    id: number;
    productId:number;
    userId:number;
    userName:string;
    userAvatarUrl:string;
    orderId:number;
    content:string;
    score:number;
    time :string;
}
const now_comment = ref<Comment>();
const comments = ref<Comment[]>([]);
const rescomment = ref('');
function handleCommentData(id: any){
    now_comment.value=props.commentss.find((comment: { id: any; }) => comment.id === id);
    getResComments(id).then(res => {
        comments.value=res
        console.log(comments.value)
    })
}
function handleCommentClick(userName: any){
    rescomment.value='@'+userName+'  '
}
function timeFormate(time: string){
  return time.split('T')[0]
}
function submitResComment(){
    commentCreate({productId: 0, orderId: 0, score: 0, content: rescomment.value, replyId: now_comment.value.id}).then(res => {
        rescomment.value=''
        if (res.data.code === '000') {
            ElMessage({
                customClass: 'customMessage',
                type: 'success',
                message: '评论成功！',
            })
        } else if (res.data.code === '400') {
            ElMessage({
                customClass: 'customMessage',
                type: 'error',
                message: res.data.msg,
            })
        }
        handleCommentData(now_comment.value?.id)
    })
}
// 定义emits
const emit = defineEmits(['submit','closed']);
// 定义表单数据
let dialogVisible_comment = ref(false);

// 关闭弹窗
function dialogClose(){
    emit('closed');
}
defineExpose({
    showDialog: (commentId: any) => {
        handleCommentData(commentId);
        rescomment.value='';
        dialogVisible_comment.value = true;
    },
    hideDialog: () => {
        dialogVisible_comment.value = false;
    },
});
</script>

<template>
    <el-dialog v-model="dialogVisible_comment" class="customer-container" :modal-append-to-body='false'
    append-to-body :title="title" width="50%" @close="dialogClose">
        <el-form ref="formRef" >
            <el-form-item >
                <div>
                    <el-row>
                        <div class="flex-container">
                            <div>
                                <el-avatar :icon="UserFilled" :size="30" v-if="now_comment?.userAvatarUrl==null"></el-avatar>
                                <el-avatar :src="now_comment?.userAvatarUrl" :size="30" v-else></el-avatar> 
                            </div>
                            <div class="info-container">
                                <span class="userName">{{ now_comment?.userName }}</span>
                                <span> 发布于 {{ timeFormate(now_comment.time) }}</span>
                            </div>
                        </div>
                    </el-row>
                    <el-row>
                        <div class="content-container">
                            {{ now_comment?.content }}
                        </div>
                    </el-row>
                </div>
            </el-form-item>
            <el-form-item v-for="comment in comments" :key="comment.id" 
            @click="handleCommentClick(comment.userName)" style="margin-left: 10%;">
                <div>
                    <el-row>
                        <div class="flex-container">
                            <div>
                                <el-avatar :icon="UserFilled" :size="30" v-if="comment.userAvatarUrl==null"></el-avatar>
                                <el-avatar :src="comment.userAvatarUrl" :size="30" v-else></el-avatar> 
                            </div>
                            <div class="info-container">
                                <span class="userName">{{ comment.userName }}</span>
                                <span> 发布于 {{ timeFormate(comment.time) }}</span>
                            </div>
                        </div>
                    </el-row>
                    <el-row>
                        <div class="content-container">
                            {{ comment.content }}
                        </div>
                    </el-row>
                </div>
            </el-form-item>
        </el-form>
        <div>
            <el-row :gutter="10">
                <el-col :span="20">
                    <el-input v-model="rescomment" placeholder="其他买家期待与你交流"></el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="submitResComment">提交</el-button>
                </el-col>
            </el-row>
        </div>
    </el-dialog>
</template>
<style scoped>
.order-tag {
    font-size: 12px;
    font-weight: bold;
    background-color: transparent;
    border: none;
}
.flex-container {
  display: flex;
  align-items: stretch;
}

.info-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 10px;
}

.info-container .userName {
  font-size: 14px;
  line-height: 1.2;
}

.info-container span {
  font-size: 12px;
  line-height: 1.2;
}

.el-avatar {
  width: 40px;
  height: 40px;
}

.content-container {
  max-width: 80%; 
  word-wrap: break-word;
  line-height: 1.2;
  padding-top: 10px;
}

</style>