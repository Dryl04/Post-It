import { createRouter, createWebHistory } from "vue-router"
import Home from "@/views/Home.vue"
import EditPost from "@/views/EditPost.vue"
import AddPost from "@/views/AddPost.vue"
import DetailsPost from "@/views/DetailsPost.vue"

const routes = [
    {
        path: "/", component: Home
    },

    {
        path: "/add", component: AddPost
    },

    {
        path: "/edit/:id", component: EditPost, props: true
    },
    
    {
        path: "/details/:id", component: DetailsPost, props: true
    }

]


export default createRouter({
    history: createWebHistory(),
    routes,
})