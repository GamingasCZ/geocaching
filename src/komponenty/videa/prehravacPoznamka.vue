<script setup lang="ts">

defineProps<{
    poznamky: Array<object>
}>()

</script>

<template>
<section class="bg-geo-400" v-for="poznamka in poznamky">{{ poznamka.text }}</section>
</template>