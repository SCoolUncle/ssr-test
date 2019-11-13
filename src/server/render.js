import React, {Fragment} from 'react';
import {StaticRouter, matchPath, Route} from 'react-router-dom';
import routes from '../routes';
import {renderToString} from 'react-dom/server';
import {Provider} from 'react-redux';
import {getServerStore} from '../store';
import {renderRoutes, matchRoutes} from 'react-router-config';

export default function (req, res) {
    // cssArr  收集每一个组件引入的样式
    let context = {cssArr: []};

    // 获取服务端的 store
    let store = getServerStore(req);

    // matchPath 是路由提供的工具方法，可以用来判断路径和路由对象是否匹配（不是简单的匹配：绝对相等）
    // 这样的也能匹配到
    // req.path   => /user/123456
    // route.path => /user/:id
    // matchRoutes 这个方法可以处理嵌套路由
    let matchedRoutes = matchRoutes(routes, req.path);

    let promises = [];
    // 当前匹配到的路由如果需要异步请求数据，那么就在这里请求数据
    matchedRoutes.forEach(item => {
        if (item.route.loadData) {
            promises.push(new Promise(function (resolve) {
                // 防止一个接口的失败，影响页面的渲染
                // 不管调用接口是否失败，都让它成功
                return item.route.loadData(store).then(resolve, resolve);
            }));
        }
    });

    Promise.all(promises).then(function () {
        // 客户端用 HashRouter 或者 BrowserRouter
        // 而在服务端用 StaticRouter
        let html = renderToString(
            <Provider store={store}>
                <StaticRouter context={context} location={req.path}>
                    {renderRoutes(routes)}
                </StaticRouter>
            </Provider>
        );

        // 渲染完成之后，再获取 css 样式
        let cssStr = context.cssArr.join('\n');

        if (context.action == 'REPLACE') {
            // 重定向状态码是 302
            return res.redirect(302, context.url);
        } else if (context.notFound) {
            // notFound 为 true，那么访问的页面不存在，需要将状态码设置为 404
            // 如果不设置的话，状态码默认是 200
            res.statusCode = 404;
        }

        res.send(`
            <html>
                <head>
                <title>React-SSR</title>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css" />
                <style>${cssStr}</style>
                </head>
                <body>
                <div id="root">${html}</div>
                <script>
                  window.context = {
                      state:${JSON.stringify(store.getState())}
                  }
                </script>
                <script src="/client.js"></script>
                </body>
            </html>`);
    });
}