import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Launch a local browser instance
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath,
    headless: true,
  });

  try {
    // Create new browser instance
    const page = await browser.newPage();

    const url = req.query.path as string;

    console.log("Path", url);

    await page.setViewport({ width: 1200, height: 720 });

    // Navigate to a URL
    await page.goto(url, { waitUntil: "networkidle0", timeout: 30 * 1000 });

    // Take a screenshot
    const screenshot = await page.screenshot({
      type: "png",
    });

    // Set the `s-maxage` property to cache at the CDN layer
    res.setHeader("Cache-Control", "s-maxage=31536000, stale-while-revalidate");
    res.setHeader("Content-Type", "image/png");

    res.end(screenshot);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  } finally {
    await browser.close();
  }
};
