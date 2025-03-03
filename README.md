# Magic Newton 每日抽奖机器人

## 项目介绍
这是一个用于自动执行 Magic Newton 平台每日抽奖的脚本工具。该工具提供了友好的交互界面，可以帮助用户轻松配置和运行自动抽奖任务。

### 主要功能
- 🎲 自动执行每日抽奖
- 🔄 支持多账号管理
- ⏰ 智能延时系统
- 📊 详细的运行日志
- 🔒 安全的 Cookie 管理
- 🖥️ 交互式操作界面

### 环境要求
- Node.js 14.0 或更高版本
- npm 或 yarn 包管理器
- Linux/MacOS/Windows 系统

## 使用说明

### 1. 注册账号
如果你还没有 Magic Newton 账号，可以通过以下链接注册：
[https://magicnewton.com](https://magicnewton.com/portal?referral=xu8rdw5jrp74xzmc)

### 2. 安装步骤

➖ 克隆仓库:
```bash
git clone https://github.com/0xbaiwan/magic_newton_bot.git
```

➖ 进入项目目录:
```bash
cd magic_newton_bot
```

➖ 安装依赖:
```bash
npm install
```

### 3. 运行程序

启动程序:
```bash
node index.js
```

### 4. 使用交互菜单

程序启动后会显示交互菜单，包含以下选项：

1. **录入 Cookie 会话值**
   - 选择此选项可以输入或更新 Cookie
   - 按照屏幕提示获取并输入 Cookie
   - 输入完成后按回车保存
   - 输入 "q" 可以返回主菜单

2. **开始自动抽奖**
   - 选择此选项开始执行自动抽奖
   - 程序会自动检查 Cookie 是否有效
   - 支持多账号连续执行
   - 执行完成后会自动等待下一轮

3. **退出程序**
   - 安全退出程序

### 5. 获取 Cookie 的详细步骤

1. 使用 Chrome 或 Edge 浏览器登录 Magic Newton 网站
2. 按 F12 打开开发者工具
3. 在开发者工具中选择 "Application"（应用程序）选项卡
   - 如果看不到 "Application"，点击右边的 ">>" 展开更多选项
4. 在左侧边栏中展开 "Cookies"
5. 点击 "https://www.magicnewton.com" 域名
6. 在右侧找到名为 "__Secure-next-auth.session-token" 的 cookie
7. 复制该 cookie 的 "Value"（值）列中的内容
8. 在程序菜单中选择 "1" 并粘贴复制的内容

### 6. 后台运行（可选）

如果需要在服务器后台运行，可以使用以下方法：

➖ 使用 Screen:
```bash
screen -S magic_newton_bot
node index.js
# 按 CTRL + A + D 分离会话
# 使用 screen -r magic_newton_bot 重新连接
```

➖ 使用 PM2:
```bash
npm install -g pm2
pm2 start index.js --name magic_newton_bot
```

## 注意事项
- Cookie 值请妥善保管，不要泄露给他人
- Cookie 可能会定期失效，需要及时更新
- 程序会自动处理随机延迟，避免被检测
- 如遇到问题，请查看控制台输出的错误信息
- 建议使用 screen 或 pm2 等工具保持程序在后台运行

## 免责声明
本项目仅供学习交流使用，请勿用于商业用途。使用本工具产生的任何后果由使用者自行承担。


