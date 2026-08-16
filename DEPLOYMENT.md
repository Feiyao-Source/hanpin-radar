# 上线准备

当前项目包含 Node.js 后端，不能部署到 GitHub Pages。

部署前必须：

1. 配置 `NODE_ENV=production`、`HANPIN_ADMIN_USER` 和高强度 `HANPIN_ADMIN_PASSWORD`。
2. 将 `data.json` 替换为线上数据库（Postgres / Supabase / D1）；云端文件系统通常不保证持久化。
3. 将环境照片改为对象存储上传，并增加人脸、车牌与证件脱敏。
4. 为投稿增加限流、验证码、审核日志、备份与管理员密码哈希。

前台和后台需部署在同一后端域名，或将 API 地址配置为可访问的 HTTPS 域名。
