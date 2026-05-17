import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';

export interface ScrapeSelectors {
  [key: string]: string;
}

export interface ScrapeResult {
  url: string;
  data: {
    [key: string]: string | string[] | null;
  };
  html?: string;
}

/**
 * 使用 Axios + Cheerio 采集静态网页
 */
async function scrapeWithCheerio(
  url: string,
  selectors: ScrapeSelectors
): Promise<ScrapeResult> {
  console.log(`🔍 使用 Cheerio 采集: ${url}`);
  
  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    timeout: 30000
  });

  const $ = cheerio.load(response.data);
  const data: { [key: string]: string | string[] | null } = {};

  // 应用选择器提取数据
  for (const [key, selector] of Object.entries(selectors)) {
    if (selector === 'title') {
      data[key] = $('title').text().trim();
    } else if (selector.startsWith('meta[')) {
      const metaContent = $(selector).attr('content');
      data[key] = metaContent || null;
    } else {
      // 尝试提取多个元素
      const elements = $(selector);
      if (elements.length > 1) {
        data[key] = elements.map((i, el) => $(el).text().trim()).get();
      } else {
        data[key] = elements.first().text().trim() || null;
      }
    }
  }

  return {
    url,
    data,
    html: response.data.substring(0, 1000) // 只返回前1000字符
  };
}

/**
 * 使用 Puppeteer 采集动态网页
 */
async function scrapeWithPuppeteer(
  url: string,
  selectors: ScrapeSelectors
): Promise<ScrapeResult> {
  console.log(`🔍 使用 Puppeteer 采集: ${url}`);
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    const data = await page.evaluate((selectors) => {
      const result: { [key: string]: string | string[] | null } = {};

      for (const [key, selector] of Object.entries(selectors)) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 1) {
          result[key] = Array.from(elements).map(el => el.textContent?.trim() || '');
        } else {
          const element = document.querySelector(selector);
          result[key] = element?.textContent?.trim() || null;
        }
      }

      return result;
    }, selectors);

    return { url, data };
  } finally {
    await browser.close();
  }
}

/**
 * 主采集函数 - 自动选择采集方法
 */
export async function scrapeWebsite(
  url: string,
  selectors: ScrapeSelectors = { title: 'title', description: 'meta[name="description"]' }
): Promise<ScrapeResult> {
  try {
    // 优先使用 Cheerio（更快）
    return await scrapeWithCheerio(url, selectors);
  } catch (error) {
    console.warn(`⚠️ Cheerio 采集失败，尝试 Puppeteer: ${error}`);
    
    // 如果 Cheerio 失败，使用 Puppeteer（支持动态内容）
    try {
      return await scrapeWithPuppeteer(url, selectors);
    } catch (puppeteerError) {
      throw new Error(`采集失败: ${puppeteerError}`);
    }
  }
}
