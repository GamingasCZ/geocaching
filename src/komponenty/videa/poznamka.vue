<template>
    <RouterLink to="/" class="min-w-full">
        <li class="relative p-1 pl-2 text-white border-b-4 bg-geo-50 border-b-ext-fia noteFooter">
            <h1 class="font-bold font-lg">Název videa</h1>
            <p class="text-xs">Toto je poznámka</p>
            <footer class="m-0.5">
                <span class="p-1 text-sm bg-black rounded-md">0:43</span>
            </footer>
        </li>
    </RouterLink>
</template>

<style>
.noteFooter::after {
    @apply content-[''] w-5 h-5 bg-ext-fia absolute bottom-0 right-0;
    clip-path: polygon(100% 0%, 0% 100%, 100% 100%);
}

</style>