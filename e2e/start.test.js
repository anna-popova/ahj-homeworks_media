import puppeteer from "puppeteer";

describe("page start", () => {
  let browser;
  let page;

  //jest.setTimeout(200000);

  beforeAll(async () => {
    //открыть браузер
    browser = await puppeteer.launch({
      // headless: false,
      // slowMo: 100,
      // devtools: true,
      // env: {
      //   DISPLAY: ":10.0",
      // },
    });

    //просим браузер открыть новую страницу
    page = await browser.newPage();
  });

  //тесты
  test("page rendering", async () => {
    await page.goto("http://localhost:8080");

    await page.waitForSelector("body");
  });

  //закрыть браузер
  afterAll(async () => {
    await browser.close();
  });
});
