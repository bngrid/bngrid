# BNGRID

华容网格、原子组件与丝滑动画，为现代浏览器提供卓越的启动体验。

## 快速开始

1. **安装依赖**

建议使用 [pnpm](https://pnpm.io/) 进行项目管理：

```bash
pnpm i
```

2. **配置环境变量**

在项目根目录下新建 `.env` 文件，并填入以下配置：

```env
GLOBAL_PASSWORD="全局密码（数据库、超级管理员）"
DATABASE_URL="mongodb://用户名:${GLOBAL_PASSWORD}@域名:端口号/数据库名"
JWT_PUBLIC_KEY="JWT 公钥"
JWT_PRIVATE_KEY="JWT 私钥"
EMAIL_USER="邮箱地址"
EMAIL_PASS="邮箱授权码"
COS_SECRET_ID="腾讯云 COS 密钥 ID"
COS_SECRET_KEY="腾讯云 COS 密钥 KEY"
```

3. **初始化项目**

运行以下命令，系统将生成随机的 JWT 密钥、初始化数据库并创建超级管理员账户：

```bash
pnpm init
```

4. **启动开发环境**

启动开发服务器：

```bash
pnpm dev
```

然后在浏览器中访问 [http://localhost:3000](http://localhost:3000) 查看效果。

5. **代码检查**

开发完成后，执行代码检查：

```bash
pnpm lint
```

6. **构建与部署**

构建项目：

```bash
pnpm build
```

构建完成后，启动生产环境：

```bash
pnpm start
```

通过浏览器访问 [http://localhost:8080](http://localhost:8080) 进行验证。

> 提示：执行下面的命令，将同时执行上述的第 5 步和第 6 步：
>
> ```bash
> pnpm prod
> ```

## 目录结构

```plain
.
├── api                # API 接口目录，处理服务端请求，调用 lib 中的公共函数
├── app                # 应用入口和页面路由
├── assets             # 静态资源（图片、样式等）
├── components         # UI 组件及布局组件
│   ├── ui             # 基础 UI 组件
│   └── layouts      # 页面布局组件
├── generated          # 自动生成的代码文件
├── hooks              # 自定义 React Hooks
├── lib                # 公共函数库，供 api 层调用
│                      # 函数返回格式：
│                      # Promise<{
│                      #   success: false;
│                      #   result: string;
│                      # } | {
│                      #   success: true;
│                      #   result: T;
│                      # }>
├── prisma             # 数据库模型及迁移文件
├── providers          # 全局状态/上下文提供者
├── public             # 公共静态文件（如 favicon、图片等）
├── schemas            # 数据验证及定义 schema
├── stores             # 状态管理（如全局 store）
├── types              # 全局类型定义
└── utils              # 工具函数及辅助方法
```

## 命名规范

- 清晰性 > 简洁性、避免歧义、布尔函数用"is/has/can"开头
- 类型和模式统一使用帕斯卡命名（PascalCase）。
- 环境变量统一使用全大写字母，单词之间用下划线分隔。
- 普通变量和函数统一使用驼峰命名（camelCase）。
- 函数名以动词开头，名词结尾。

### 函数动词

- `get`：获取
- `read`：读取
- `fetch`：拉取
- `find`：查询

- `set`：设置
- `reset`：重置
- `update`：更新
- `modify`：修改

- `create`：创建
- `generate`：生成
- `init`：初始化

- `delete`：删除
- `remove`：移除

- `execute`：执行
- `handle`：处理
- `compute`：计算

- `convert`：转换
- `parse`：解析
- `format`：格式化

- `validate`：校验
- `check`：检查

## 致谢

感谢以下开源项目对 BNGRID 的支持（排名不分先后）：

- [package.json 中使用的所有开源项目](https://github.com/bngrid/bngrid/blob/main/package.json)
- [Figma](https://www.figma.com/) —— 用于 Logo 与页面设计
- [寒蝉半圆体](https://github.com/Warren2060/ChillRound) —— 项目全局字体
