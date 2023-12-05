import { createVNode, ref, render } from "vue"
import notifikaceVue from "./notifikace.vue"

export const notificatons = ref([])

export default (text: string) => {
    notificatons.value.push(text)
}