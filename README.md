# sxzx-ht

## 知识储备

+ git 务必用熟，b站学习，不要找时长很短的视频。命令行学会后再使用图形化界面。
+ react 目前的风格是全部使用函数式组件，推荐资源：
  + 入门视频
  + 实战视频，使用函数式组件 hooks https://www.bilibili.com/video/BV1fw411d7R5?from=search&seid=10983113197955230788&spm_id_from=333.337.0.0
+ scss 跟 css 没有什么区别，让你能嵌套写 css，还有一些其他功能。xxx.module.scss 是使得样式模块化不污染全局，自己上网搜搜博客，或者参考项目里的写法。
+

## 开始写代码

### 1. 克隆仓库并进入项目文件夹

```shell
git clone git@github.com:2021sxzx/2021sxzx-ht.git
```

### 2. 确保当前分支是dev分支

```shell
git branch
# -> *指向的就是当前分支

# 若不为dev分支
git checkout dev
```

### 3. 安装依赖（后续如果有人安装新模块也要重新install）

```shell
npm install
# 可以简写成npm i
```

### 4. 目录结构

```shell
├─node_modules/   # 模块
├─package.json    # 配置文件
├─package-lock.json # 配置文件
├─public/         # html
└─src/
    ├─api/           # 对后台请求的统一管理
    ├─assets/           # 图片等静态文件放在这里
    ├─components/       # 公共组件放在这里
    ├─router/IndexRouter.js   # 配置路由
    ├─views/            # 页面文件 主要在这里写代码 找到自己对应的页面
    ├─setupProxy.js   #开发过程代理配置
    ├─index.scss         #全局样式
    ├─App.js           # 根组件
    └─index.js           # 入口js文件
```

### 5. 开始写代码

1. 把项目跑起来。

```shell
# 本地开发，需要本地开启后端
npm start

# 已上线开发环境，连接阿里云后端
# 修改/src/setupProxy.js 的 target
npm start
```

### 6. 代码提交

**1.add**

```shell
# 把所有更改的文件都添加到暂存区
git add .
  
# 如果只想把某些文件加入，可以指定对应文件，如：
git add src/views/xxx/xxx.js 
```

**2.commit**

注意: 冒号用英文字符，:号后面空一格

commit规范

```shell
<type>: <subject> #subject 必填，简单说明，不超过50个字
#空一行
[optional body] # body 选填，用于填写更详细的描述
```

type是提交的类型，必须为以下类型中一个

```
feat：增加一个新功能
fix：修复bug
docs：只修改了文档
style：做了不影响代码含义的修改，空格、格式化、缺少分号等等
refactor：代码重构，既不是修复bug，也不是新功能的修改
perf：改进性能的代码
test：增加测试或更新已有的测试
chore：构建或辅助工具或依赖库的更新
```

提交示例

```
feat: 新建xx页面

初步完成xx组件
```

**3.pull**
pull = fetch + merge
提交之前看看有没有人提交了新版本代码，要先 pull，发生冲突要解决冲突

**4.push**

```shell
# 提交到dev分支
git push origin dev
```

### 7.一些注意点

+ 务必熟悉
+ 尽量只改动自己任务下的文件
+ 整体结构上的改动要跟团队协商公示
+ 新的库的引入要跟团队协商公示
