const requiredFields = [
  'houseId',
  'houseName',
  'score',
  'grade',
  'sellerResponse',
  'strategy',
]

function buildRecommendation(attempt) {
  if (attempt.missedMajor > 0) {
    return 'Review the major findings that were not included before making a final repair request.'
  }

  if (attempt.sellerResponse === 'Rejected') {
    return 'Try a more flexible strategy or support the request with stronger repair evidence.'
  }

  if (attempt.healthAverage < 70) {
    return 'Use tools earlier to protect buyer confidence, budget safety, and deal health.'
  }

  return 'Strong inspection choices. The request is focused and supported by meaningful findings.'
}

export default function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    response.status(405).json({ error: 'Method not allowed' })
    return
  }

  const attempt = request.body ?? {}
  const missingFields = requiredFields.filter((field) => attempt[field] === undefined)

  if (missingFields.length > 0) {
    response.status(400).json({
      error: 'Missing required attempt fields.',
      missingFields,
    })
    return
  }

  response.status(201).json({
    saved: true,
    attemptId: `attempt_${Date.now()}`,
    recommendation: buildRecommendation(attempt),
  })
}
