export default async function handler(req, res) {
  // Apenas aceita requisições POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Desestruturando os dados que vieram do frontend
  const { eventName, eventId, eventURL, userData, customData } = req.body;

  // Variáveis de ambiente que ficam escondidas no painel do Vercel
  const PIXEL_ID = process.env.META_PIXEL_ID;
  const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
  const TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE; 

  if (!PIXEL_ID || !ACCESS_TOKEN) {
    return res.status(500).json({ error: 'Faltam credenciais do Meta (Pixel ID ou Token)' });
  }

  // Montando a URL da API do Facebook Graph
  const url = `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;

  // Pegando IP e User Agent passados automaticamente ou da requisição para melhor rastreamento
  const client_ip_address = req.headers['x-forwarded-for'] || req.socket?.remoteAddress;
  const client_user_agent = req.headers['user-agent'];

  // Dados do evento de acordo com a documentação do Facebook
  const payload = {
    data: [
      {
        event_name: eventName || 'PageView',
        event_time: Math.floor(Date.now() / 1000), // tempo atual em segundos
        event_id: eventId, // usado para desduplicação (opcional mas recomendado)
        action_source: "website",
        event_source_url: eventURL,
        user_data: {
          client_ip_address,
          client_user_agent,
          ...userData,
        },
        custom_data: customData || {}
      }
    ]
  };

  // Se o código de teste existir, adicionamos ao payload para ele cair na aba e testes
  if (TEST_EVENT_CODE) {
    payload.test_event_code = TEST_EVENT_CODE;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.error) {
      console.error("Erro da Meta API:", result.error);
      return res.status(400).json({ error: result.error });
    }

    return res.status(200).json({ success: true, result });
  } catch (error) {
    console.error("Erro de requisição:", error);
    return res.status(500).json({ error: error.message });
  }
}
