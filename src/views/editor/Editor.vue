<Editor :ref="'myQuillEditor'+id"
                v-model="details"
                @inputChange="onEditorChange($event)">
</Editor>
                
<script>
import Editor from '../../components/quill-editor.vue'
export default {
    name: "index",
    components: {
      Editor
    },
    data() {
      return {
        details:'',
        id:''
      };
    },
    created() {
      this.getInfo()
    },
    methods:{
      //将已有的数据回显到富文本框中
      getInfo(){
       //假设调用接口返回值为res.data
       //解析成json格式
        this.details = JSON.parse(res.data.details)
        //如果页面中调用多个富文本框,则ref动态
        let r = 'myQuillEditor'+id
         if (this.$refs[r]) {
           this.$refs[r].quill.setContents(this.details)
         }
        //如是单个页面调用方式如下
        //this.$refs.myQuillEditor.quill.setContents(this.details)
      },
      onEditorChange(val){
        this.details = val
      },
      //保存需要处理数据
      save(){
      			let details = JSON.stringify(this.details)
      }
      
    }


  };
</script>

