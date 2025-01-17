exports.handler = async function(event, context) {
  try {
    const searchTerm = event.queryStringParameters.search || '';
    const apiKey = process.env.IPIFY_API_KEY;
    
    const baseUrl = 'https://geo.ipify.org/api/v2/country,city';
    const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(searchTerm);
    
    const url = searchTerm
      ? `${baseUrl}?apiKey=${apiKey}&${isIp ? 'ipAddress' : 'domain'}=${searchTerm}`
      : `${baseUrl}?apiKey=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ error: 'Failed to fetch IP data' })
    };
  }
};
