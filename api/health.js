export default function handler(request, response) {
  response.status(200).json({
    status: 'connected',
    service: 'Inspection Monster Hunt API',
    timestamp: new Date().toISOString(),
  })
}
