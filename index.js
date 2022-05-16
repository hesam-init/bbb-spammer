// libraries:
import puppeteer from "puppeteer";
import { uniqueNamesGenerator, names, animals } from "unique-names-generator";

const randomName = uniqueNamesGenerator({
  dictionaries: [names],
});

// start the browser
const url = "https://engage.shatel.com/b/hes-ore-rlm-foi";

const openBrowser = async (delay = 250) => {
  // connect to the browser
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url);

  // join the room
  await page.type("input", randomName, { delay: 5 });
  const joinBtn = await page.$("#room-join");
  await joinBtn.click();

  // wait to enter to class
  await page.waitForNavigation().then((data) => {
    if (data.ok) {
      console.log("entered to class");
    } else {
      console.log("error");
    }
  });

  await page.waitForSelector(".ReactModal__Content");
  const closeModal = await page.$(".ReactModal__Content > header > button");
  await closeModal.click({ delay: 500 });

  // send message
  await page.waitForSelector("#message-input").then((el) =>
    setInterval(() => {
      el.type(
        uniqueNamesGenerator({
          dictionaries: [animals],
        })
      );
      page.keyboard.press("Enter");
    }, delay)
  );
};

openBrowser(250);
