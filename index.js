const puppeteer = require('puppeteer')
const readline = require('readline')
const chalk = require('chalk')

;(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    devtools: true
  })
  const page = await browser.newPage()
  await page.goto('about:blank')

  page.on('console', (message) => {
    const type = message.type()
      .substr(0, 3)
      .toUpperCase()
    const colors = {
      LOG: (text) => text,
      ERR: chalk.red,
      WAR: chalk.yellow,
      INF: chalk.cyan
    }
    const color = colors[type] || chalk.blue
    console.log(color(message.text()))
    console.log(
      '--------------------------------------------------------------------------------'
    )
  })
  // .on('pageerror', ({ message }) => console.log(chalk.red(message)))
  // .on('response', (response) =>
  //   console.log(chalk.green(`${response.status()} ${response.url()}`))
  // )
  // .on('requestfailed', (request) =>
  //   console.log(
  //     chalk.magenta(`${request.failure().errorText} ${request.url()}`)
  //   )
  // )

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> '
  })

  rl.prompt()

  rl.on('line', async (input) => {
    if (input === '.exit') {
      rl.close()
    } else {
      await page.addScriptTag({
        content: input
      })
    }
    rl.prompt()
  }).on('close', async () => {
    console.log('Have a great day!')
    await browser.close()
    process.exit(0)
  })
})()
