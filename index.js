// 导入必要的依赖
const puppeteer = require("puppeteer");
const fs = require("fs");
const readline = require("readline");
require('colors');
const { displayHeader } = require('./helpers');
const banner = require('./banner').default;

// 常量配置
const MAGICNEWTON_URL = "https://www.magicnewton.com/portal/rewards";
const DEFAULT_SLEEP_TIME = 24 * 60 * 60 * 1000; // 24小时
const RANDOM_EXTRA_DELAY = () => Math.floor(Math.random() * (10 - 5 + 1) + 5) * 60 * 1000; // 随机延迟5-10分钟

// 创建readline接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * 显示主菜单
 */
function showMenu() {
  console.clear();
  console.log(banner);
  console.log('\n=== 主菜单 ==='.cyan);
  console.log('1. 录入 Cookie 会话值');
  console.log('2. 开始自动抽奖');
  console.log('3. 退出程序');
  console.log('\n请输入选项 (1-3): '.cyan);
}

/**
 * 处理用户输入的Cookie
 */
async function handleCookieInput() {
  console.clear();
  console.log('\n=== Cookie 录入 ==='.cyan);
  console.log('请按照以下步骤操作：');
  console.log('1. 使用浏览器登录 Magic Newton 网站');
  console.log('2. 按 F12 打开开发者工具');
  console.log('3. 选择 Application -> Cookies');
  console.log('4. 找到并复制 __Secure-next-auth.session-token 的值');
  console.log('\n请输入 Cookie 值 (输入 "q" 返回主菜单):'.cyan);

  const cookie = await new Promise((resolve) => rl.question('', resolve));
  
  if (cookie.toLowerCase() === 'q') {
    return showMainMenu();
  }

  if (cookie.trim()) {
    fs.writeFileSync('data.txt', cookie);
    console.log('\n✅ Cookie 保存成功！按回车返回主菜单...'.green);
    await new Promise((resolve) => rl.question('', resolve));
  } else {
    console.log('\n⚠️ Cookie 不能为空！按回车重试...'.yellow);
    await new Promise((resolve) => rl.question('', resolve));
    return handleCookieInput();
  }
  
  showMainMenu();
}

/**
 * 主菜单循环
 */
async function showMainMenu() {
  showMenu();
  
  rl.question('', async (choice) => {
    switch (choice) {
      case '1':
        await handleCookieInput();
        break;
      case '2':
        console.log('\n开始运行自动抽奖程序...\n'.green);
        await startBot();
        break;
      case '3':
        console.log('\n感谢使用，再见！'.green);
        rl.close();
        process.exit(0);
        break;
      default:
        console.log('\n⚠️ 无效的选项，请重试...'.yellow);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        showMainMenu();
    }
  });
}

/**
 * 延迟函数
 * @param {number} ms - 延迟的毫秒数
 * @returns {Promise} 延迟Promise
 */
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 获取当前时间
 * @returns {string} 格式化的时间字符串
 */
function getCurrentTime() {
  return new Date().toLocaleString("id-ID", { hour12: false });
}

/**
 * 执行单个账号的抽奖流程
 * @param {Object} cookie - 账号的cookie信息
 */
async function runAccount(cookie) {
  try {
    // 初始化浏览器
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setCookie(cookie);
    await page.goto(MAGICNEWTON_URL, { waitUntil: "networkidle2", timeout: 60000 });

    // 获取用户信息
    const userAddress = await page.$eval("p.gGRRlH.WrOCw.AEdnq.hGQgmY.jdmPpC", el => el.innerText).catch(() => "未知");
    console.log(`${getCurrentTime()} - 🏠 你的账号: ${userAddress}`);

    // 获取积分余额
    let userCredits = await page.$eval("#creditBalance", el => el.innerText).catch(() => "未知");
    console.log(`${getCurrentTime()} - 💰 总积分: ${userCredits}`);

    // 开始抽奖流程
    await page.waitForSelector("button", { timeout: 30000 });
    
    // 点击 "Roll now" 按钮
    const rollNowClicked = await page.$$eval("button", buttons => {
      const target = buttons.find(btn => btn.innerText && btn.innerText.includes("Roll now"));
      if (target) {
        target.click();
        return true;
      }
      return false;
    });

    if (rollNowClicked) {
      console.log(`${getCurrentTime()} - ✅ 开始每日抽奖...`);
    }
    await delay(5000);

    const letsRollClicked = await page.$$eval("button", buttons => {
      const target = buttons.find(btn => btn.innerText && btn.innerText.includes("Let's roll"));
      if (target) {
        target.click();
        return true;
      }
      return false;
    });

    if (letsRollClicked) {
      await delay(5000);
      const throwDiceClicked = await page.$$eval("button", buttons => {
        const target = buttons.find(btn => btn.innerText && btn.innerText.includes("Throw Dice"));
        if (target) {
          target.click();
          return true;
        }
        return false;
      });

      if (throwDiceClicked) {
        console.log(`${getCurrentTime()} - ⏳ 等待30秒骰子动画...`);
        await delay(30000);

        for (let i = 1; i <= 5; i++) {
          const pressClicked = await page.$$eval("button > div > p", buttons => {
            const target = buttons.find(btn => btn.innerText && btn.innerText.includes("Press"));
            if (target) {
              target.click();
              return true;
            }
            return false;
          });

          if (pressClicked) {
            console.log(`${getCurrentTime()} - 🖱️ 点击按钮 (${i}/5)`);
            await delay(3000);
            
            const currentPoints = await page.$eval("h2.jsx-f1b6ce0373f41d79.gRUWXt.dnQMzm.ljNVlj.kzjCbV.dqpYKm.RVUSp.fzpbtJ.bYPzoC", el => el.innerText).catch(() => "未知");
            console.log(`${getCurrentTime()} - �� 当前点击后的积分 (${i}/5): ${currentPoints}`);
          } else {
            console.log(`${getCurrentTime()} - ⚠️ 未找到'Press'按钮`);
            break;
          }

          await delay(10000);
        }

        const bankClicked = await page.$$eval("button:nth-child(3) > div > p", buttons => {
          const target = buttons.find(btn => btn.innerText && btn.innerText.includes("Bank"));
          if (target) {
            target.click();
            return true;
          }
          return false;
        });

        if (bankClicked) {
          console.log(`${getCurrentTime()} - 🏦 点击存储按钮`);
          await delay(3000);

          const diceRollResult = await page.$eval("h2.gRUWXt.dnQMzm.ljNVlj.kzjCbV.dqpYKm.RVUSp.fzpbtJ.bYPzoC", el => el.innerText).catch(() => "未知");
          console.log(`${getCurrentTime()} - 🎲 骰子结果: ${diceRollResult} 积分`);

          userCredits = await page.$eval("#creditBalance", el => el.innerText).catch(() => "未知");
          console.log(`${getCurrentTime()} - 💳 抽奖后最终余额: ${userCredits}`);
        } else {
          console.log(`${getCurrentTime()} - ⚠️ 未找到'Bank'按钮`);
        }
      } else {
        console.log(`${getCurrentTime()} - ⚠️ 未找到'Throw Dice'按钮`);
      }
    } else {
      console.log(`${getCurrentTime()} - ⚠️ 当前无法抽奖，请稍后再试！`);
    }
    await browser.close();
  } catch (error) {
    console.error(`${getCurrentTime()} - ❌ 发生错误:`, error);
  }
}

/**
 * 启动机器人的主函数
 */
async function startBot() {
  try {
    const data = fs.readFileSync("data.txt", "utf8").split("\n").filter(Boolean);
    
    if (!data.length) {
      console.log('\n⚠️ 未找到有效的 Cookie，请先录入 Cookie！按回车返回主菜单...'.yellow);
      await new Promise((resolve) => rl.question('', resolve));
      return showMainMenu();
    }

    while (true) {
      try {
        console.log(`${getCurrentTime()} - 🔄 开始运行账号...`);
        for (let i = 0; i < data.length; i++) {
          const cookie = {
            name: "__Secure-next-auth.session-token",
            value: data[i],
            domain: ".magicnewton.com",
            path: "/",
            secure: true,
            httpOnly: true,
          };
          await runAccount(cookie);
        }
      } catch (error) {
        console.error(`${getCurrentTime()} - ❌ 发生错误:`, error);
      }
      
      const extraDelay = RANDOM_EXTRA_DELAY();
      console.log(`${getCurrentTime()} - 🔄 每日抽奖完成。机器人将在24小时后再次运行，额外随机延迟 ${extraDelay / 60000} 分钟...`);
      await delay(DEFAULT_SLEEP_TIME + extraDelay);
    }
  } catch (error) {
    console.error('\n❌ 运行出错:', error);
    console.log('\n按回车返回主菜单...'.yellow);
    await new Promise((resolve) => rl.question('', resolve));
    showMainMenu();
  }
}

// 启动程序
showMainMenu();
