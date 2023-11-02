<script setup lang="ts">
import Poznamka from './poznamka.vue';

</script>

<template>
    <aside class="w-72 max-h-[80svh] sticky top-16">
        <header>Poznámky</header>
        <ul class="box-border flex flex-col gap-2 items-center p-2 w-full h-full bg-geo-200">

            <Poznamka v-for="_ in 2"/>            
        </ul>
    </aside>
</template>