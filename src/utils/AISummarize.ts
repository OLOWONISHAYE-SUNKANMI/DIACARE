export async function getAISummary(values) {
  const res = await fetch('https://klukoo-ai.onrender.com/summarize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ values }),
  });
  if (!res.ok) throw new Error('Failed to get summary');
  const data = await res.json();
  return data.summary;
}


