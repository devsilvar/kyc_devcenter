//For pOST requests
export async function postJSON<T>(url: string, body: unknown, opts: RequestInit = {}): Promise<T> {
const res = await fetch(url, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'Idempotency-Key': crypto.randomUUID(),
...(opts.headers || {})
},
body: JSON.stringify(body),
credentials: 'omit'
});
if (!res.ok) throw new Error(await res.text());
return res.json();
}




// For GET requests
export async function getJSON<T>(url: string, opts: RequestInit = {}): Promise<T> {
const res = await fetch(url, {
method: 'GET',
headers: {
'Content-Type': 'application/json',
...(opts.headers || {})
},
credentials: 'omit'
});
if (!res.ok) throw new Error(await res.text());
return res.json();
}