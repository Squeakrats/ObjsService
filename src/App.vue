<template>
  <div id="app">
    <div class = "root">
      <panel :assets = "assetStore" :UIState = "UIState"></panel>
      <stage :UIState = "UIState" ref="stage"> </stage>
    </div>
  </div>
</template>

<script>

import Panel from './components/Panel'
import Stage from './components/Stage'
import Vue from 'vue'
import {Objs} from "./lib/Objs"
import {createAssetText} from "./js/util.js"

export default {
  name: 'app',
  components: {
    Panel, Stage
  },
  data (){
    return {
      bus : new Vue(),
      assetStore : [

      ],
      UIState : {
        panelCentered : true,
        selectedAsset : "",
        loadingAsset : false
      }
    }
  },
  methods : {
    //http://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server
    initiateDownload : function(){
      console.log("about to DL")
      let text = createAssetText(this.UIState.selectedAsset);
		  var element = document.createElement('a')
		  var blob = new Blob([text], {type : "octet/stream"})
		  var url = window.URL.createObjectURL(blob)
		  element.setAttribute('href', url)
		  element.setAttribute('download', this.UIState.selectedAsset.name + ".js")
		  document.body.appendChild(element)
		  element.click()
		  document.body.removeChild(element)
    },
    selectAsset : function(asset){
      this.UIState.selectedAsset = asset
      this.$refs.stage.display.setViewing(asset.displayData);
      console.log("selected:" + asset)
    },
    loadedFile : function(files){      
        for(let file of files) {
          file.processedData = null;
          if(file.type == "obj") {
            try {
              file.processedData = Objs.parseObj(file.data);
            }catch(e) {
              file.processedData = null;
            }
          }else {
            file.processedData = new Image();
            file.processedData.src = file.data;
          }
          
          if(file.processedData) {
            this.UIState.loadingAsset = false
            this.assetStore.unshift(file);
            this.selectAsset(file);
          }
          else {
            this.UIState.loadingAsset = false
            // TODO converting the file failed. notify client
          }    
        }   
    }
  },
  created : function(){
    var me = this
    this.bus.$on('e_loadedFile', function(file){
      me.loadedFile(file)
    })

    this.bus.$on('e_togglePanelCentered', function(){
      if(me.UIState.panelCentered){
        me.UIState.panelCentered = false;
      }
    })

    this.bus.$on('e_user_selectedAsset', function(asset){
      me.selectAsset(asset)
    })

    this.bus.$on('e_user_initiatedDownload', function(){
      me.initiateDownload()
    })

    this.bus.$on('e_user_initiatedUpload', function(){
      me.UIState.loadingAsset = true
    })
    this.bus.$on('e_failedToLoad', function(){
      me.UIState.loadingAsset = false
    })
  }
}

</script>

<style lang = "stylus">
$stripHeight = 25px

#app {
  height 100%
}

body{
  padding 0px 0px
  margin 0px 0px
  background #262626
  background radial-gradient(ellipse at center, #262626 0%,#000000 100%)
  width 100vw
  height 100vh
  font-family 'Poppins', sans-serif
} 

.root{
  display flex
  justify-content center
  align-items center
  position absolute
  left 0
  right 0
  top 0
  bottom 0
  overflow-y hidden
}

.strip-top {
  height $stripHeight
  top 0px
  position absolute
  width 100%
  background-color black
}

</style>
