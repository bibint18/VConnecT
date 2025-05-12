
export async function createTurnConfig() {
  const secret = "strongpassword123"; 
  const unixTime = Math.floor(Date.now() / 1000) + 3600; 

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(unixTime.toString())
  );

  const credential = btoa(String.fromCharCode(...new Uint8Array(signature)));

  return {
    urls: `turn:vconnect.bibin.online:3478?transport=udp`,
    username: unixTime.toString(),
    credential: credential,
  };
}