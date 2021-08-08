<template>
  <!-- 例如：vue 颜色选择 -->
  <input type="text" :value="inputVal" @input="$emit('customModel', $event.target.value)" />
  <!--
        1. 上面的 input 使用了 :value 而不是 v-model
        2. 上面的 change1 和 model.event 要对应起来
        3. text1 属性对应起来
    -->
</template>

<script>
export default {
  model: {
    prop: 'inputVal',
    event: 'customModel'
  },
  props: {
    inputVal: String
  }
};
</script>
