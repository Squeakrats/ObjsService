<template>
<div id = "notificationCenter-root"> 

<transition-group name = "failed"> 
<div class = "noti" v-for = "file in notis" v-bind:key="file.name">
    <div class = "icon"> !</div>
    <div class = "title">{{file.name}} failed to load! </div>
</div>
</transition-group>

</div>
</template>

<script>
export default{
    name : 'NotificationCenter',
    methods : {
        insertNoti : function(filename){
            var me = this
            console.log('Inserted Noti with name', filename)
            var newNoti = {name : filename}
            this.notis.push(newNoti)
            setTimeout(function(){
                let i = me.notis.indexOf(newNoti)
                me.notis.splice(i,1)
            }, 4000)
        }
    },
    mounted : function(){
        var me = this
    },
    data () {
        return {
            notis : []
        }
    }
}

</script>

<style lang = "stylus">

.failed-enter-active, .failed-leave-active {
  transition: all 1s  ease
}

.failed-enter{
    height 0px
}

.failed-enter-to{
   height 50px
}

.failed-leave{
    height 50px
}

.failed-leave-to{
    height 0px
}

#notificationCenter-root{
    box-sizing border-box
 
    .noti{
        transition all .5s ease
        width 100%
        line-height 30px
        background-color rgba(255,255,255,.5)
        box-sizing border-box
        box-shadow 0px 2px 2px 2px rgba(0,0,0,.2)
        margin-bottom 2px
        overflow-y hidden

        .icon{
            margin-right 15px
            float left
            color white
            text-align center
            width 35px
            height 35px
            margin-top 8px
            margin-left 8px
            background-color orange
            content ''
            border-radius 25px
            font-weight bold
            font-size 24px
            line-height 40px
        }

        .title{
            font-weight bold
            line-height 50px
            height 50px
        }
    }
}

</style>