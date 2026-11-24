# NPC联网服务部署

## 已准备的文件

Dockerfile只复制服务端模块，不包含游戏图片、存档或本地配置。render.yaml可由Render Blueprint导入；也支持任何能运行Docker或Node.js 22的服务器。本文件描述准备好的部署方案，不表示云服务已开通。

## 方案一：Render

1. 登录自己的Render账户，创建Blueprint并选择本GitHub仓库。
2. 导入render.yaml，在云平台的环境变量页面填写NPC_API_KEY、NPC_BASE_URL、NPC_MODEL；不要提交真实密钥到GitHub。
3. NPC_ALLOWED_ORIGINS已设为https://wangmeng-daw.github.io。Render会通过RENDER_EXTERNAL_HOSTNAME提供服务域名。
4. 部署后访问https://你的域名/api/health。configured:true只代表已读取配置；还要实际POST /api/npc并核对mode:model才算聊天接通。
5. 把公开HTTPS接口写入npc-service-config.js：window.HOME_NPC_API_URL = 'https://你的域名/api/npc';
6. 在仓库根目录运行python build-resources.py，重新生成资源清单并推送GitHub。已有缓存的玩家回封面继续下载更新资源。

免费实例可能休眠或冷启动，是否可用和具体限制以创建时平台说明为准；稳定公开游玩建议选择持续运行的实例。方案未开通付费服务。

## 方案二：已有Docker服务器

在GitHub仓库目录执行docker build -t confirm-home-npc .，把.env.example复制到仓库外后填写变量。运行时使用--env-file读取该文件，映射10000端口。NPC_PUBLIC_HOST填写自己的服务域名，NPC_ALLOWED_ORIGINS填写游戏HTTPS来源。用反向代理提供HTTPS，不把模型密钥传给浏览器。

服务支持PORT环境变量和--host 0.0.0.0，默认本地模式依旧绑定127.0.0.1。允许的主机和跨域来源显式配置，第三方来源会被拒绝。现有全局限速为每分钟30次、并发2次，公开活动前应按预计人数与模型预算评估容量。

## 检查请求示例

POST /api/npc，Content-Type: application/json：
{"npc":"wife","lastUser":"你好","history":[{"role":"user","content":"你好"}],"context":{"stage":"missing","facts":[],"seen":[]}}

预期返回ok:true、mode:model以及messages中的实际台词。还应检查游戏内微信、小红书和抖音能收到对应回复，以及接口失败后重试不重复玩家消息。

## 官方说明

- GitHub Pages：https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- Render Docker：https://render.com/docs/docker
- Render Blueprint：https://render.com/docs/blueprint-spec
