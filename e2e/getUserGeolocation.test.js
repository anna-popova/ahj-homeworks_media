import puppeteer from "puppeteer";

describe("check user input of coordinates", () => {
  let browser;
  let page;

  jest.setTimeout(200000);

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
  test("container should render on page start", async () => {
    await page.goto("http://localhost:8080");

    await page.waitForSelector(".container");
  });

  test("user add correct coodrs 51.50851, -0.12572", async () => {
    await page.goto("http://localhost:8080");

    await page.waitForSelector(".container");

    const form = await page.$(".form");
    const formInput = await form.$(".input-text.input-location");
    const formBtn = await form.$(".button.ok-button");

    await formInput.type("51.50851, -0.12572");
    await formBtn.click();

    await page.waitForSelector(".error-message.hidden");
  });

  test("user add correct coodrs 51.50851,-0.12572", async () => {
	await page.goto("http://localhost:8080");

	await page.waitForSelector(".container");

	const form = await page.$(".form");
	const formInput = await form.$(".input-text.input-location");
	const formBtn = await form.$(".button.ok-button");

	await formInput.type("51.50851,-0.12572");
	await formBtn.click();

	await page.waitForSelector(".error-message.hidden");
 });

 test("user add correct coodrs [51.50851, -0.12572]", async () => {
	await page.goto("http://localhost:8080");

	await page.waitForSelector(".container");

	const form = await page.$(".form");
	const formInput = await form.$(".input-text.input-location");
	const formBtn = await form.$(".button.ok-button");

	await formInput.type("[51.50851, -0.12572]");
	await formBtn.click();

	await page.waitForSelector(".error-message.hidden");
 });

 test("user add correct coodrs [51.50851,-0.12572]", async () => {
	await page.goto("http://localhost:8080");

	await page.waitForSelector(".container");

	const form = await page.$(".form");
	const formInput = await form.$(".input-text.input-location");
	const formBtn = await form.$(".button.ok-button");

	await formInput.type("[51.50851,-0.12572]");
	await formBtn.click();

	await page.waitForSelector(".error-message.hidden");
 });

 test("user add incorrect coodrs 5d1.50851, -0.12572", async () => {
	await page.goto("http://localhost:8080");

	await page.waitForSelector(".container");

	const form = await page.$(".form");
	const formInput = await form.$(".input-text.input-location");
	const formBtn = await form.$(".button.ok-button");

	await formInput.type("5d1.50851, -0.12572");
	await formBtn.click();

	await page.waitForSelector(".error-message");
 });

  //закрыть браузер
  afterAll(async () => {
    await browser.close();
  });
});
