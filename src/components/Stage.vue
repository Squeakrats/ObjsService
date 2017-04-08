<template>
  <div class = "stage-root" v-bind:class= "{inView : !UIState.panelCentered, outOfView : UIState.panelCentered}" >
    <div class = "statBox">
      <transition name = "list">
        <div class = "fifty stat loadedTitle" v-show = "!UIState.panelCentered">{{UIState.selectedAsset.name}}</div>
      </transition> 
        <div class = "fifty btn-download" v-show = "!UIState.panelCentered" v-on:click="initiateDownload"> Download {{UIState.selectedAsset.name}}.js</div>
    </div>

    <div class = "stage" id="stage">
    <transition name = "fade">
      <div class = "loadingCover" v-show = "UIState.loadingAsset"> 
      <div class = "loadingText"> Loading...</div>
        
      </div>
    </transition>
     </div>
    
    <!-- Vertices, Normals, UVs, Faces !-->
    <div class = "statBox" v-if = "UIState.selectedAsset.processedData">

     <div id = "2dStats" v-if = "UIState.selectedAsset.type=='image'">
      <div class = "stat" v-bind:key = "'width'"> 
         Width - {{UIState.selectedAsset.processedData.width}}
        </div>
        <div class = "stat" v-bind:key = "'height'"> 
         Height - {{UIState.selectedAsset.processedData.height}}
        </div>
        <div class = "stat" v-bind:key = "'filesize'"> 
         File Size - {{UIState.selectedAsset.processedData.size}}
        </div>
     </div>

      <div id = "3dStats" v-if = "UIState.selectedAsset.type=='obj'">
        <div class = "stat" v-bind:key = "'vertices'"> 
         Vertices - {{UIState.selectedAsset.processedData.vertices.length}}
        </div>

        <div class = "stat" v-bind:key = "'normals'"> 
         Normals - {{UIState.selectedAsset.processedData.normals.length}}
        </div>

        <div class = "stat" v-bind:key = "'uvs'"> 
         UVs - {{UIState.selectedAsset.processedData.UVs.length}}
        </div>

         <div class = "stat" v-bind:key = "'faces'"> 
         Faces - {{UIState.selectedAsset.processedData.faces.length}}
        </div>
      </div>

    </div>
  </div>
</template>


<script>
import Display from "../js/Display";

export default {
  name: 'stage',
  created : function(){
   
  },
  mounted : function () {
    this.display.setRoot(this.$el.querySelector("#stage"));
  },
  methods : {
    initiateDownload(){
      this.$parent.bus.$emit('e_user_initiatedDownload')
    }
  },
  
  props : ["UIState"],
  data () {
    return {
      display : new Display()
    }
  }
}
</script>

<style lang = "stylus">

$stageWidth = 810px
$stageHeight = 600px

$offset = 600px
$statHeight = 40px

.fifty{
  max-width 45%
  padding-right 2px
}

.fade-enter-active {
  transition: all .5s 
}
.fade-leave-active {
  transition: all .5s 
}
.fade-enter, .fade-leave-to{
  opacity 0
}

.inView {
  width $stageWidth
}

.outOfView {
  width 0px
}

$titleHeight = 40px

.loadedTitle{
  font-weight bold
}

.stage{
    height $stageHeight
    width 800px
    overflow-y hidden
    overflow-x hidden
    margin 15px auto
    box-shadow 0px 2px 7px 2px rgba(0,0,0,.7)
    position relative

    .imageBox{
      background-size contain
      width 800px
      height 600px
      background-repeat no-repeat
      background-position center
    }

    .loadingCover{
      position absolute
      width 100%
      height 100%
      background-color white

      .loadingText{
        position absolute
        font-weight bold
        font-size 32px
        text-align center
        left 0
        right 0
        height 50px
        top 0
        bottom 0
        margin auto
        width 200px
        border 2px solid rgba(0,0,0,.2)
        @keyframes loading{
          0%{
            opacity .25
          }
          50%{
            opacity .75
          }
          100%{
            opacity .25
          }
        }
        animation loading 1s infinite
      }
    }
}

.stage-root{
    margin-top 20px
    height 750px
    margin-left 30px
    transition opacity .5s ease, width .5s ease
    overflow-x hidden
    overflow-y hidden
}

$btnColor = #ff0035

.btn-download{
  background-color #ff0035
  color white
  height $statHeight
  float left
  padding 5px 15px
  line-height $statHeight
  cursor pointer
  &:hover{
    background-color darken($btnColor, 25%)
  }
}

.statBox{
  width 800px
  overflow-x hidden
  overflow-y hidden
  flex-shrink 0
  .stat{
    float left
    background-color white
  }
}

.stat{
  margin-right 15px
  height $statHeight
  line-height $statHeight
  padding 5px 15px
  font-size 20px
}

.list-item {
  display: inline-block;
}
.list-enter-active, .list-leave-active {
  transition: all .5s;
}
.list-enter, .list-leave-to /* .list-leave-active for <2.1.8 */ {
  opacity: 0;
  transform: translateY(5px);
}

</style>