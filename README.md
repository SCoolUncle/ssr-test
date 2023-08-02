# React SSR & 同构

## 1. 项目基本介绍
一个简单的ssr练手项目，主要目的在于探索react ssr构建流程

## 2. 服务端渲染定义

页面渲染流程

1. 浏览器通过请求得到一个 HTML 文本
2. 渲染进程解析 HTML 文本，构建 DOM 树
3. 解析 HTML 的同时，如果遇到内联样式或者样式脚本，则下载并构建样式规则（stytle rules），若遇到 JavaScript 脚本，则会下载执行脚本。
4. DOM 树和样式规则构建完成之后，渲染进程将两者合并成渲染树（render tree）
5. 渲染进程开始对渲染树进行布局，生成布局树（layout tree）
6. 渲染进程对布局树进行绘制，生成绘制记录
7. 渲染进程将合成帧信息发送给 GPU 进程显示到页面中

![page render](https://raw.githubusercontent.com/yacan8/blog/master/images/%E6%9C%8D%E5%8A%A1%E7%AB%AF%E6%B8%B2%E6%9F%93%E5%8E%9F%E7%90%86/image-20200730191954015.png)

-   CSR：Vue、React、Angular 等前端框架进行页面渲染的，也就是说，在执行 JavaScript 脚本的时候，HTML 页面已经开始解析并且构建 DOM 树了，JavaScript 脚本只是动态的改变 DOM 树的结构，使得页面成为希望成为的样子，这种渲染方式叫动态渲染，也可以叫客户端渲染（client side rende）
-   SSR：服务端渲染就是在浏览器请求页面 URL 的时候，服务端将我们需要的 HTML 文本组装好，并返回给浏览器，这个 HTML 文本被浏览器解析之后，不需要经过 JavaScript 脚本的执行，即可直接构建出希望的 DOM 树并展示到页面中。这个服务端组装 HTML 的过程，叫做服务端渲染。

![csr ssr](https://raw.githubusercontent.com/yacan8/blog/master/images/%E6%9C%8D%E5%8A%A1%E7%AB%AF%E6%B8%B2%E6%9F%93%E5%8E%9F%E7%90%86/image-20200731165404271.png)
