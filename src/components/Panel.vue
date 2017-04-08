<template>
  <div class="panel">

  <div class = "pane-root" v-bind:class = "{pane_status_centered : UIState.panelCentered, pane_status_left : ! UIState.panelCentered}"> 
        <div class = "btn-upload-root"> 
      <input class = "inputfile" name = "file" id = "file" type="file" value="Upload and Convert" multiple="" v-on:change= "generate"/>
      <label for="file">Upload and Convert </label>
    </div>
    
    
    <div class = "title-root"> 
    TFWGF
    </div>

   

    <transition name = "verticalSquish" mode="out-in"> 
    <div class = "descriptor-root" v-show="UIState.panelCentered"> 
    The friendly web graphics file converter
    </div>
    </transition>


     <notification-center ref = "noticenter"> </notification-center>
 
    <div class = "library-root" v-bind:key = "'lib'" v-show="!UIState.panelCentered">
      <h2> Library</h2>
      

        <div id = "assetList">
         
      
      <transition-group name = "loaded" tag = "div">
       <div class = "item loading" v-show="UIState.loadingAsset" v-bind:key = "'loader'">
           Loading
        </div>
        <div class = "item"  v-for = "file in assets" v-bind:key = "file.name" v-bind:class = "{selected : UIState.selectedAsset == file}" v-on:click = "selectAsset(file)" > 
          {{file.name}}
        </div>
      </transition-group>

      </div>
    </div>

    <div class = "conversion-table-root" v-bind:key="'table'" v-show="UIState.panelCentered">
    <div class = "row"> 
      <div class = "side"> <div class = "itemType"> OBJ </div> </div>
      <div class = "divider"> </div>
      <div class = "side"> <div class = "itemType"> JSON</div> </div>
    </div>
    <div class = "row"> 
      <div class = "side">  <div class = "itemType"> Image</div></div>
       <div class = "divider"> </div>
      <div class = "side">  <div class = "itemType"> Base64</div></div>
    </div>
    </div>
      </transition-group>
   
  </div>
  </div>
</template>

<script>
import {readFile, processFile} from "../js/util.js"
import NotificationCenter from './NotificationCenter'

export default {
  name: 'panel',
  mounted : function(){
    this.notiCenter = this.$refs.noticenter
  },
  methods : {
    selectAsset : function(asset){
      this.$parent.bus.$emit('e_user_selectedAsset',asset)
    },

    generate : function(e){

      var fileObject = e.target.files || e.dataTransfer.files;
      if (!fileObject.length)
        return;

      this.$parent.bus.$emit('e_user_initiatedUpload')
        
      let fileArray = []
      var me = this

      for(var i = 0; i < fileObject.length;i++)
        fileArray.push(fileObject[i])

        fileArray.forEach((file) => {
          // TODO IncrementLoading()
          readFile(file).then(processFile).then((file) => {
             this.$parent.bus.$emit('e_loadedFile', [file]);
             this.$parent.bus.$emit('e_togglePanelCentered');
             return file;
          }, (err) => {
            console.log(err);
            me.$parent.bus.$emit('e_failedToLoad')
            me.notiCenter.insertNoti(file.name)
            //addNotificationError(err.message)
            return err;
          }).then(() => {
            // TODO DecrementLoading()
          })
        })
    }
  },
  props : ["assets", "UIState"],
  components : {NotificationCenter},
  data () {
    return {
       notiCenter : null
    }
  }
}
</script>


<style lang = "stylus">
.panel{
  position relative
}

.inputfile {
  width 0.1px
  height 0.1px
  opacity 0
  overflow hidden
  position absolute
  z-index -1
}

.inputfile + label {
  font-size: 1em
  font-weight: 200
  color: white
  background-color: black
  display: inline-block
  width 100%
  outline 1px solid black
  cursor pointer
}

.inputfile:focus + label,
.inputfile + label:hover {
    background-color #FFF
    color black
}

$titleHeight = 60px
$darkText = #333
$lightText = #eee
$outlinestrength = 10px
$accentColor = #FF0035
$leftMargin = 50px
$paneWidth = 400px
$offset = $paneWidth*2


.library-root{
  padding-left 25px
  padding-right 25px
  font-size 20px
  transition height 1s ease
  max-height 900px

  
  #assetList{
    overflow-y auto
    overflow-x hidden
    max-height 400px
  }

  .selected{
    font-weight bold
  }

  .item{
    cursor pointer
    overflow-x hidden
    overflow-y hidden
    &:hover {
      color grey
    }
  }

  
  .loaded-enter-active, .loaded-leave-active {
    transition: all .5s  ease
  }

  .loaded-enter{
    height 0px
  }

  .loaded-enter-to{
    height 33px
  }

  .loaded-leave{
    height 33px
  }

  .loaded-leave-to{
    height 0px
  }

  .loading{
    color: #ff0035
    font-weight: bold
     @keyframes loadAni{
      0% { 
        opacity .25
      }
      50% {
        opacity 1
      }
      100%{
        opacity .25
      }
    }
    animation loadAni 1s infinite
  }


  h2{
    border-bottom 1px solid rgba(0,0,0,.2)
  }
}

.pane-root{
  width $paneWidth
  min-height 500px
  max-height 650px
  padding-bottom 50px
  box-sizing border-box
  background-color rgba(230,230,230,.9)
  outline 1px solid black
  box-shadow 0px 0px 15px 5px
  transition left .5s ease
  top 0
  bottom 0
  overflow-y hidden

  .title-root{
    color white
    font-weight bold
    background-color black
    height $titleHeight
    line-height $titleHeight
    font-size $titleHeight*.65
    text-align center
    text-shadow -1px 0 #111,0 1px #111,1px 0 #111,0 -1px #555, 0px 3px 0px #AAA

  }

  .descriptor-root{
    $descriptorHeight = 60px
    box-shadow 0px 3px 5px 1px rgba(0,0,0,.4)
    height $descriptorHeight
    text-align center
    font-size 1.2em
    color $lightText
    background-color $accentColor
    overflow-y hidden
    line-height $descriptorHeight
  }

  .verticalSquish-enter-active {
    transition: all .5s ease
  }
  .verticalSquish-leave-active {
    transition: all .5s ease
  }
  .verticalSquish-enter, .verticalSquish-leave-to{
    height 0px
  }


  .row:first-child{
    border-bottom 2px solid rgba(0,0,0,.1)
  }

  .conversion-table-root{
    margin-top 50px
    height 200px
    width 100%
    $rowHeight = 100px
    padding 0px 40px
    box-sizing border-box

    .row{
      display flex
      flex-grow 1
      justify-content center
      font-size 20px
      align-items stretch
      width 100%
      height $rowHeight
      line-height $rowHeight
      margin-bottom 15px
      padding-bottom 15px
      text-align center

      .side{
        width 45%

        .itemType{
          font-size 30px
          font-weight bold
          color $darkText
        }
      }
      .divider{
        width 10%
        background-image url("../assets/arrow_right.png")
        background-repeat no-repeat
        background-position center
        background-size 90%
      }
    }
  }

  .btn-upload-root{
    $btnHeight = 70px
    width 200px
    color white
    background-color black
    height $btnHeight
    position absolute
    bottom $btnHeight * -.5
    left 0
    display block
    right 0
    margin auto
    top 1
    text-align center
    line-height $btnHeight
    cursor pointer
  }

}

</style>
