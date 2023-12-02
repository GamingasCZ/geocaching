<template>
    <!-- https://stackoverflow.com/questions/69488256/vue-3-append-component-to-the-dom-best-practice -->
<Teleport to="body">
    <div class="skewButton bg-geo-400 fixed bottom-0 left-1/2 -translate-y-1/2 pr-10 z-50 font-bolder text-lg w-max py-3 px-5">
        <p>Probíhá export...</p>
    </div>
</Teleport>
</template>
