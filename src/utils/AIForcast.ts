export async function getAIForecast(currentGlucose) {
  const res = await fetch('https://klukoo-ai.onrender.com/forecast', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentGlucose }),
  });
  if (!res.ok) throw new Error('Failed to get forecast');
  const data = await res.json();
  return data.forecast;
}
