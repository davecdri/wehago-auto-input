import pkg from "selenium-webdriver";
import readline from "readline";
import { path } from "./consts.js";

// 셀레니엄 설정
let name = "";
const { Builder, By, until } = pkg;
const driver = await new Builder().forBrowser("chrome").build();
const exitAndQuitDriver = () => {
  console.log("프로그램을 종료합니다.");
  driver.quit();
  process.exit(0);
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// 커맨드 인터페이스 설정
rl.on("close", function () {
  exitAndQuitDriver();
});

// 함수 정의 시작
function changeDateFormat(str) {
  return `${Number(str.slice(5, 7))}/${Number(str.slice(8, 10))}`;
}

async function navigateToWehago() {
  await driver.get("https://www.wehago.com/#/login");
}

async function test() {
  while (true) {
    let contentInput;

    // 모달 못찾으면 프로그램 종료
    try {
      // contentInput = await driver.findElement(By.xpath(path.contentInput));
      contentInput = driver.wait(
        until.elementLocated(By.xpath(path.contentInput))
      );
    } catch (e) {
      exitAndQuitDriver();
    }

    const purposeInput = await driver.findElement(By.xpath(path.purposeInput));
    const dateDiv = await driver.findElement(By.xpath(path.dateDiv));
    const peopleInput = await driver.findElement(By.xpath(path.peopleInput));
    const paymentButton = await driver.findElement(
      By.xpath(path.paymentButton)
    );
    const date = await dateDiv.getText();

    await contentInput.sendKeys(
      `${changeDateFormat(date)}일 중식 1명(${name})`
    );
    await purposeInput.sendKeys(`점심식대`);
    await peopleInput.sendKeys(`1명(${name})`);
    await paymentButton.click();

    console.log(
      `${changeDateFormat(date)}일 중식 1명(${name}) 입력되었습니다.`
    );

    let confirmButton;
    try {
      confirmButton = driver.wait(until.elementLocated(By.id("confirm")));
    } catch (e) {
      console.log("입력이 완료되었습니다.");
      exitAndQuitDriver();
    }

    confirmButton.click();
  }
}

function enterCommand() {
  rl.question(
    `명령어 리스트
  ----------------
  # 주의사항
  경비청구 입력 자동화 실행 전, 자동 입력을 원하는 경비청구를 선택 후 모달을 실행해주세요.
  ----------------
  1. 경비청구 입력 자동화
  ----------------
  명령어 입력: `,
    (cmd) => {
      switch (cmd) {
        case "1":
          console.log("오케이 출발합니다!");
          test();
          break;
        default:
          console.log("찾을 수 없는 명령어입니다.");
          break;
      }
    }
  );
}

function enterName() {
  rl.question(
    `이름을 적어주세요.
  이름 : `,
    (value) => {
      name = value;
      // 커맨드 입력창으로 이동
      enterCommand();
    }
  );
}

// 프로그램 시작점
navigateToWehago();
enterName();
