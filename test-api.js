const body = JSON.stringify({
  answers: {
    passion: "UTAGEを通してもっと自動化を楽しくして欲しい",
    message: "マーケティング自動化のコツ、コンテンツ販売の始め方",
    achievement: "半年で1200万円",
    clientResult: "受講生50名が月5万円の副収入を達成",
    cta: "最短でコンテンツ販売を始める方法がわかる"
  }
});

fetch("https://threads-profile-generator.vercel.app/api/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body
})
  .then(r => r.json())
  .then(data => {
    console.log("Status: OK");
    console.log(JSON.stringify(data, null, 2));
  })
  .catch(err => console.error("Error:", err.message));
