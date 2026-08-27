async function loadHome() {

  try {

    const res = await fetch(
      "https://sparkling-shape-65b4.niklasjuulrasmussen7.workers.dev/api/page?uid=home"
    );

    if (!res.ok) {
      throw new Error(`Worker returned ${res.status}`);
    }

    const data = await res.json();

    console.log("Worker response:", data);

    document.getElementById("title").textContent =
      data.title || "No title";

    document.getElementById("desc").textContent =
      data.description || data.content || "No description";

  } catch (error) {

    console.error("Homepage loading failed:", error);

    document.getElementById("title").textContent =
      "Error loading page";

    document.getElementById("desc").textContent =
      error.message;
  }
}

loadHome();
