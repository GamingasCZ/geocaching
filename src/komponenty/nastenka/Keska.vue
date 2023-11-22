<script setup lang="ts">

defineProps<{
    jmeno: string
    kod: string
    druh: number
    
}>()

</script>

<template>
<section class="bg-white p-1 m-1">{{ jmeno }}

</section>

</template>
