# sxzx-ht

## 开始写代码前的准备

### 1. 克隆仓库并进入项目文件夹

```shell
git clone git@github.com:xxih/2021sxzx-ht.git
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
# vote-fe
├─node_modules/   # 模块
├─package.json    # 配置文件
├─package-lock.json # 配置文件
├─public/         # html
└─src/
    ├─assets/           # 图片等静态文件放在这里
    ├─components/       # 公共组件放在这里
    ├─router/IndexRouter.js   # Router文件
    ├─views/            # 页面文件 主要在这里写代码
    ├─setupProxy.js   #开发过程代理配置
    ├─App.css         #全局样式
    ├─App.js           # 根组件
    └─index.js           # 入口js文件
```

### 5. 开始写代码

1. 把项目跑起来。

```shell
npm start
```


### 6. 代码提交

**1.add**

```shell
# 把所有更改的文件都添加到暂存区
git add .
    
# 如果只想把某些文件加入，可以指定对应文件，如：
git add src/main.js src/App.vue
```

**2.commit**

注意: 用英文字符，:号后面空一格

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

**3.push**

```shell
# 提交到dev分支
git push origin dev
```

## 风格规范