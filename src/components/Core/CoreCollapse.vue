<template>
  <div class="root">
    <i @click="iconClicked" class="collaps-icon material-icons">{{ iconName }}</i>
    <div :style="{'height': isOpen ? 'calc(100% - 40px)' : `${height}px`}" class="animation">
         <slot /> 
    </div>
  </div>
 
</template>

<script> 
export default {
  name: 'CoreCollapse',
  data() {
    return {
      iconName: 'expand_less',
      isOpen: true,
    };
  },
  props:{ 
        height: { type: Number, default: 50 },

      } ,
  methods: {
    iconClicked() {
      if(this.isOpen){
          this.iconName = 'expand_more' ;
          this.isOpen=false;
          this.$emit("collapse" , true);
      }else {
          this.iconName = 'expand_less' ;
          this.isOpen=true;
          this.$emit("collapse" , false);
      }
    }, 
  }
}
</script>


<style lang="scss" scoped>
@import 'src/assets/scss/theme-colors';
.root{
  position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.collaps-icon{
  float: right;
  background: var(--second-color);
  cursor: pointer;
  margin-top: 10px;
}
.animation{
   transition: height 0.25s ease-in;
}
</style>