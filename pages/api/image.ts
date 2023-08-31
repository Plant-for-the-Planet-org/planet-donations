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

import { chromium } from "playwright-core";
import chromiumLambda from "chrome-aws-lambda";
import { Readable } from "stream";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Launch a headless browser instance using AWS Lambda-compatible Chromium
    const browser = await chromium.launch({
      args: chromiumLambda.args,
      executablePath: await chromiumLambda.executablePath,
    });

    // Create a new browser context and page
    const context = await browser.newContext();
    const page = await context.newPage();

    const url = req.query.path as string;

    // Navigate to a URL (you can replace this with your desired URL)
    await page.goto(url, {
      timeout: 30 * 1000,
      waitUntil: "networkidle",
    });

    // Take a screenshot
    const screenshotBuffer = await page.screenshot({
      type: "png",
    });

    // Close the browser
    await context.close();
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
    console.error("Error:", error);
    res.status(500).json({ error: error });
  }
};
