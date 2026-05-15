export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const query = req.query.query || '주식';
  const start = req.query.start || 1;
  const sort = req.query.sort || 'date';

  try {
    const response = await fetch(
      `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(query)}&display=20&start=${start}&sort=${sort}`,
      {
        headers: {
          'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
          'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET,
        },
      }
    );

    if (!response.ok) {
      res.status(response.status).json({ error: '네이버 API 오류', status: response.status });
      return;
    }

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch(e) {
      res.status(500).json({ error: 'JSON 파싱 오류', raw: text.slice(0, 200) });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: '뉴스를 불러오지 못했습니다.', message: error.message });
  }
}
