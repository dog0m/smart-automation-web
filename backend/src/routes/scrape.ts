import { Router, Request, Response } from 'express';
import { scrapeWebsite } from '../services/scraper';

const router = Router();

/**
 * POST /api/scrape
 * 采集指定URL的网页数据
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { url, selectors } = req.body;

    if (!url) {
      return res.status(400).json({ error: '缺少必需参数: url' });
    }

    console.log(`📥 收到采集请求: ${url}`);
    
    const result = await scrapeWebsite(url, selectors);
    
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('❌ 采集失败:', error);
    res.status(500).json({
      success: false,
      error: error.message || '采集失败'
    });
  }
});

/**
 * GET /api/scrape/preview
 * 预览网页内容（获取标题和描述）
 */
router.get('/preview', async (req: Request, res: Response) => {
  try {
    const { url } = req.query;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: '缺少必需参数: url' });
    }

    const preview = await scrapeWebsite(url, {
      title: 'title',
      description: 'meta[name="description"]'
    });

    res.json({
      success: true,
      data: preview
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
