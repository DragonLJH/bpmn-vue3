
import { createRouter, createWebHashHistory } from "vue-router"

// 获取页面信息 meta 
const pageInformationPath = import.meta.glob('../view/**/page.js', {
    eager: true
})

// 获取页面路径
const indexInformationPath = import.meta.glob('../view/**/index.vue')

console.log("indexInformationPath", indexInformationPath)

// 只获取 /XXX 路径的路由
export const routes = Object.entries(pageInformationPath).map(([pagePath, meta]) => {
    // 路由 path 
    const path = pagePath.replace("../view", "").replace("/page.js", "")
    const pathSplit = path.split("/").filter(Boolean)
    const flag = pathSplit.length - 1
    // name 取文件名
    const name = pathSplit.slice(flag).join("")
    const importPath = pagePath.replace("page.js", "index.vue")
    const result = {
        path,
        name,
        component: indexInformationPath[importPath],
        meta
    }
    return result
})



const router = createRouter({
    // 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})


export default router