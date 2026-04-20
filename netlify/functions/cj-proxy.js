/**
 * Netlify Function — Proxy CJDropshipping API
 * Risolve il problema CORS per le chiamate browser → CJ API
 */

const CJ_BASE = 'https://developers.cjdropshipping.com/api2.0/v1';

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        const { endpoint, method = 'GET', body, token } = JSON.parse(event.body || '{}');

        if (!endpoint) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'endpoint mancante' }) };
        }

        const fetchOptions = {
            method,
            headers: { 'Content-Type': 'application/json' }
        };

        if (token) fetchOptions.headers['CJ-Access-Token'] = token;
        if (body && method !== 'GET') fetchOptions.body = JSON.stringify(body);

        const res = await fetch(`${CJ_BASE}${endpoint}`, fetchOptions);
        const data = await res.json();

        return { statusCode: 200, headers, body: JSON.stringify(data) };
    } catch (err) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: err.message })
        };
    }
};
