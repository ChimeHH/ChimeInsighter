# Chime-Insighter Web

极目洞见风险检测软件系统前端web

测试环境
npm install

测试运行
npm run dev

发布编译
npm build

web发布目录为/data/web/dist, 通过volume挂载到docker容器web运行。为保证SSL安全，请在发布前，请生成您自己的证书并替换appdata/ssl目录下证书。如使用云部署，应修改compose文件中web启动方式为gunicorn多任务模式。