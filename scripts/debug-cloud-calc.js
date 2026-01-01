
const url = process.env.COSMIC_CLOUD_URL || "https://osmic-cloud-engine.fly.dev";

const payload = {
  year: 1980,
  month: 6,
  day: 24,
  hour: 15,
  minute: 20,
  second: 0,
  latitude: 53.5511,  // Hamburg
  longitude: 9.9937,
  timezone: 'Europe/Berlin'
};

console.log("Sending payload to:", `${url}/compute`);
console.log(payload);

async function test() {
  try {
    const res = await fetch(`${url}/compute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    
    if (!res.ok) {
        console.error("HTTP Error:", res.status, await res.text());
        return;
    }

    const data = await res.json();
    console.log("\n----- FULL ENGINE RESPONSE -----");
    console.log(JSON.stringify(data, null, 2));
    
    console.log("\n----- BAZI SECTION -----");
    if (data.bazi) {
        console.log(data.bazi);
    } else {
        console.log("❌ Missing 'bazi' key in response!");
    }

  } catch (err) {
    console.error("❌ NETWORK ERROR:", err);
  }
}

test();
