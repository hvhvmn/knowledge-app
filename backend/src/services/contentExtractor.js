import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

export class ContentExtractor {
    static async extractContent(url) {
        try {
            console.log('🌐 Fetching content from:', url);

            // Fetch the webpage
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                },
                timeout: 10000 // 10 second timeout
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const html = await response.text();
            const $ = cheerio.load(html);

            // Remove script and style elements
            $('script, style, nav, footer, aside, .ad, .advertisement, .sidebar').remove();

            // Extract title
            let title = $('title').text().trim() ||
                       $('h1').first().text().trim() ||
                       $('meta[property="og:title"]').attr('content') ||
                       $('meta[name="title"]').attr('content') ||
                       'Untitled';

            // Clean title
            title = title.replace(/\s+/g, ' ').trim();
            if (title.length > 200) {
                title = title.substring(0, 200) + '...';
            }

            // Extract main content
            let content = '';

            // Try different content selectors
            const contentSelectors = [
                'article',
                '[role="main"]',
                '.content',
                '.post-content',
                '.entry-content',
                '.article-content',
                'main',
                '.main-content',
                '#content',
                '#main'
            ];

            for (const selector of contentSelectors) {
                const element = $(selector);
                if (element.length > 0 && element.text().trim().length > 100) {
                    content = element.text().trim();
                    break;
                }
            }

            // Fallback: get all paragraph text
            if (!content || content.length < 100) {
                const paragraphs = $('p').map((i, el) => $(el).text().trim()).get();
                content = paragraphs.join(' ').trim();
            }

            // Clean content
            content = content
                .replace(/\s+/g, ' ')
                .replace(/\n+/g, '\n')
                .trim();

            // Limit content length
            if (content.length > 10000) {
                content = content.substring(0, 10000) + '...';
            }

            // Extract description/meta description
            const description = $('meta[name="description"]').attr('content') ||
                              $('meta[property="og:description"]').attr('content') ||
                              content.substring(0, 300) + '...';

            console.log('✅ Content extracted:', {
                title: title.substring(0, 50) + '...',
                contentLength: content.length,
                hasContent: content.length > 0
            });

            return {
                title,
                content,
                description,
                extractedAt: new Date(),
                success: true
            };

        } catch (error) {
            console.error('❌ Content extraction error:', error.message);
            return {
                title: 'Failed to extract title',
                content: '',
                description: 'Content extraction failed',
                extractedAt: new Date(),
                success: false,
                error: error.message
            };
        }
    }

    static async generateSummary(content, title) {
        try {
            if (!content || content.length < 50) {
                return 'Content too short to summarize';
            }

            // Use existing AI service for summary generation
            const { generateSummary } = await import('./aiService.js');

            const summary = await generateSummary(content, title);
            return summary;

        } catch (error) {
            console.error('❌ Summary generation error:', error);
            return 'Summary generation failed';
        }
    }

    static async generateTags(content, title) {
        try {
            if (!content || content.length < 20) {
                return [];
            }

            // Use existing AI service for tag generation
            const { generateTags } = await import('./aiService.js');

            const tags = await generateTags(content, title);
            return tags;

        } catch (error) {
            console.error('❌ Tag generation error:', error);
            return [];
        }
    }
}