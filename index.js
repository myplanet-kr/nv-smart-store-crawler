const { Builder, Browser, By, until } = require("selenium-webdriver");
const { writeFileSync } = require("fs");
const [_, __, url] = process.argv;
(async function example() {
  let driver = await new Builder().forBrowser(Browser.CHROME).build();
  try {
    await driver.get(url);
    // ajax 요청 요소
    await driver.wait(until.elementLocated(By.css("div.se-main-container")));
    const divs = await driver.findElements(
      By.css("div.se-main-container > div")
    );
    let str = "";

    await Promise.all(
      divs.map(async (div) => {
        const first = await div.getText();
        const firstImages = await div.findElements(By.css("img"));
        const resolvedImgs = await Promise.all(
          firstImages.map((img) => img.getAttribute("data-src"))
        );
        if (first) {
          const txtTag = `<p>${first}</p>`;
          str += `${txtTag}\n`;
          console.log(`${txtTag}`);
        }
        resolvedImgs.map((imgSrc) => {
          const imgTagTxt = `<img src='${imgSrc}' width="800"></img>`;
          str += `${imgTagTxt}\n`;
          console.log(imgTagTxt);
        });
      })
    );
    await writeFileSync("production.html", str);
  } finally {
    await driver.quit();
  }
})();
