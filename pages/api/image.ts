// import type { NextApiRequest, NextApiResponse } from "next"
// import chromium from "chrome-aws-lambda"
// import playwright from "playwright-core"

// export default async (req: NextApiRequest, res: NextApiResponse) => {
//   // Start Playwright with the dynamic chrome-aws-lambda args
//   const browser = await playwright.chromium.launch({
//     args: chromium.args,
//     executablePath:
//       process.env.NODE_ENV !== "development"
//         ? await chromium.executablePath
//         : "/usr/bin/chromium",
//     headless: process.env.NODE_ENV !== "development" ? chromium.headless : true,
//   })

//   // Create a page with the recommended Open Graph image size
//   const page = await browser.newPage({
//     viewport: {
//       width: 1200,
//       height: 720,
//     },
//   })

//   // Extract the url from the query parameter `path`
//   const url = req.query.path as string

//   await page.goto(url, {
//     timeout: 30 * 1000,
//     waitUntil: "networkidle"
//   })

//   const data = await page.screenshot({
//     type: "png",
//   })

//   await browser.close()

//   // Set the `s-maxage` property to cache at the CDN layer
//   res.setHeader("Cache-Control", "s-maxage=31536000, stale-while-revalidate")
//   res.setHeader("Content-Type", "image/png")
//   res.end(data)
// }

// import { chromium } from "playwright";
// import { Readable } from "stream";
// import { NextApiRequest, NextApiResponse } from "next";

// export default async (req: NextApiRequest, res: NextApiResponse) => {
//   try {
//     // Launch a local browser instance
//     const browser = await chromium.launch({
//       executablePath: "/usr/lib/playwright/chromium-1076",
//     });

//     // Create a new browser context and page
//     const context = await browser.newContext({
//       viewport: {
//         width: 1200,
//         height: 720,
//       },
//     });
//     const page = await context.newPage();

//     const url = req.query.path as string;
//     // Navigate to a URL (you can replace this with your desired URL)
//     await page.goto(url, {
//       timeout: 30 * 1000,
//       waitUntil: "networkidle",
//     });

//     // Take a screenshot
//     const screenshotBuffer = await page.screenshot();

//     // Close the browser
//     await context.close();
//     await browser.close();

//     // Convert the screenshot buffer to a Readable stream
//     const screenshotStream = new Readable();
//     screenshotStream.push(screenshotBuffer);
//     screenshotStream.push(null);

//     // Set the response headers
//     res.setHeader("Content-Type", "image/png");
//     res.setHeader("Cache-Control", "no-cache");
//     res.setHeader("Pragma", "no-cache");
//     res.setHeader("Expires", "0");

//     // Pipe the screenshot stream to the response
//     screenshotStream.pipe(res);
//   } catch (error) {
//     console.error("Error:", error, chromium.executablePath());
//     res.status(500).send("Internal Server Error");
//   }
// };

import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import { Readable } from "stream";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let executablePath;
  try {
    // if (process.env.NODE_ENV === "development") {
    //   executablePath =
    //     "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
    // } else {
    //   executablePath = await chromium.executablePath;
    // }

    console.log("Executable Path", await chromium.executablePath);

    // Launch a local browser instance
    const browser = await puppeteer.launch({
      ignoreDefaultArgs: ["--disable-extensions"],
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: true,
    });

    // Create a new browser context and page
    // const context = await browser.newContext({
    //   viewport: {
    //     width: 1200,
    //     height: 720,
    //   },
    // });
    const page = await browser.newPage();

    const url = req.query.path as string;
    await page.setViewport({ width: 1200, height: 720 });
    // Navigate to a URL (you can replace this with your desired URL)
    await page.goto(url, {
      timeout: 30 * 1000,
      waitUntil: "networkidle0",
    });

    // Take a screenshot
    const screenshotBuffer = await page.screenshot();

    // Close the browser
    // await context.close();
    await browser.close();

    // Convert the screenshot buffer to a Readable stream
    const screenshotStream = new Readable();
    screenshotStream.push(screenshotBuffer);
    screenshotStream.push(null);

    // Set the response headers
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    // Pipe the screenshot stream to the response
    screenshotStream.pipe(res);
  } catch (error) {
    console.error("Error:", error, await chromium.executablePath);
    res.status(500).send("Internal Server Error");
  }
};
