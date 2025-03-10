async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function displayHeader() {
  process.stdout.write('\x1Bc');
  console.log('========================================'.cyan);
  console.log('=     Magicnewton daily Roll Bot       ='.cyan);
  console.log('=         Created by 0xbaiwan          ='.cyan);
  console.log('========================================'.cyan);
  console.log();
}

module.exports = {
  delay,
  displayHeader,
};
