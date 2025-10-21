export async function getAIPredict(values) {
  const res = await fetch('https://klukoo-ai.onrender.com/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });
  if (!res.ok) throw new Error('Failed to get prediction');
  const data = await res.json();
  return data;
}
