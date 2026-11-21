const users = [
  {
    id: "1",
    username: "john_doe",
    name: "John Doe",
    age: 19,
    pfp: "https://i.pravatar.cc/150?img=12",
    bio: "some bio",
  },
  {
    id: "2",
    username: "alex_morgan",
    name: "Alex Morgan",
    age: 24,
    pfp: "https://i.pravatar.cc/150?img=12",
    bio: "Just a guy chasing big dreams.",
  },
  {
    id: "3",
    username: "sarah_wilson",
    name: "Sarah Wilson",
    age: 21,
    pfp: "https://i.pravatar.cc/150?img=47",
    bio: "Coffee, music, and late night thoughts.",
  },
  {
    id: "4",
    username: "mike_thompson",
    name: "Mike Thompson",
    age: 27,
    pfp: "https://i.pravatar.cc/150?img=11",
    bio: "Software engineer | Gamer | Coffee addict",
  },
  {
    id: "5",
    username: "emma_clarke",
    name: "Emma Clarke",
    age: 20,
    pfp: "https://i.pravatar.cc/150?img=44",
    bio: "Finding beauty in the little things.",
  },
  {
    id: "6",
    username: "ryan_cooper",
    name: "Ryan Cooper",
    age: 23,
    pfp: "https://i.pravatar.cc/150?img=13",
    bio: "Building things and breaking things.",
  },
];

const AUTHENTICATED_USER_ID = "1";

let isVulnerable = true;

const input = document.getElementById("get_user");
const results = document.getElementById("result");
const toggle = document.getElementById("vulnerabilityToggle");

const statusTitle = document.getElementById("statusTitle");
const statusDescription = document.getElementById("statusDescription");
const statusIcon = document.getElementById("statusIcon");

const toggleState = document.getElementById("toggleState");
const explanationText = document.getElementById("explanationText");

const requestLog = document.getElementById("requestLog");

function updateSecurityStatus() {
  document.getElementById("safeReturn").hidden = isVulnerable;
  toggle.classList.toggle("active", isVulnerable);
  toggle.setAttribute("aria-pressed", String(isVulnerable));

  toggleState.textContent = isVulnerable ? "ON" : "OFF";
  toggleState.style.color = isVulnerable ? "var(--red)" : "var(--green)";

  document.getElementById("codeTitle").textContent = isVulnerable
    ? "Vulnerable Code"
    : "Fixed Code";
  document.getElementById("vulnerableCheck").hidden = !isVulnerable;
  document.getElementById("guard").hidden = isVulnerable;
  if (isVulnerable) {
    statusIcon.textContent = "⚠";
    statusIcon.style.background = "#7f1d1d";
    statusIcon.style.color = "var(--yellow)";

    statusTitle.textContent = "Vulnerability Detected";

    statusDescription.textContent =
      "Users can access other users' profiles by changing the ID.";

    explanationText.textContent =
      " The application checks if the requested user exists, but does not check if the authenticated user has permission to access their profile.";
  } else {
    statusIcon.textContent = "✓";
    statusIcon.style.background = "#14532d";
    statusIcon.style.color = "var(--green)";

    statusTitle.textContent = "Vulnerability Fixed";

    statusDescription.textContent = "Users can only access their own profiles.";

    explanationText.textContent =
      "The application checks whether the requested profile belongs to the authenticated user before returning any data.";
  }
}
function logRequest(userId, status, message) {
  const timestamp = new Date().toLocaleTimeString();

  const logClass = status === "200 OK" ? "log-success" : "log-error";

  requestLog.innerHTML = `
        <div class="${logClass}">
            [${timestamp}] ${status}
        </div>
        <div>GET /api/users/<span></span></div>
        <div>${message}</div>
    `;
  requestLog.querySelector("span").textContent = userId;
}

function getUserProfile() {
  const userId = input.value.trim();

  if (!userId) {
    results.innerHTML = `
            <div class="error-message">
                <h3>Missing User ID</h3>
                <p>Please enter a user ID first.</p>
            </div>
        `;
    return;
  }

  const user = users.find((user) => user.id === userId);

  if (!user) {
    results.innerHTML = `
            <div class="error-message">
                <h3>User Not Found</h3>
                <p>No user exists with ID #<span></span>.</p>
            </div>
        `;

    results.querySelector("span").textContent = userId;
    logRequest(userId, "404 NOT FOUND", "Resource not found.");
    return;
  }

  // Simulate server-side authorization.
  const isAuthorized = isVulnerable || userId === AUTHENTICATED_USER_ID;

  if (!isAuthorized) {
    results.innerHTML = `
            <div class="error-message">
                <h3>403 - Access Denied</h3>
                <p>
                    You are authenticated as User #${AUTHENTICATED_USER_ID},
                    but you are not authorized to access User #${userId}'s profile.
                </p>
            </div>
        `;

    logRequest(
      userId,
      "403 FORBIDDEN",
      "Authorization check failed. Access denied.",
    );

    return;
  }

  const accessMessage =
    userId !== AUTHENTICATED_USER_ID
      ? "IDOR EXPLOIT: Unauthorized resource access successful."
      : "Own profile returned.";

  results.innerHTML = `
        <div class="profile-card">

            <div class="access-result granted">
                ✓ ${accessMessage}
            </div>

            <div class="profile-header">
                <img
                    src="${user.pfp}"
                    alt="Profile picture"
                    onerror="this.onerror=null; this.src='https://i.pravatar.cc/150?img=1'"
                />

                <div>
                    <h2>${user.name}</h2>
                    <p class="username">@${user.username}</p>
                </div>

                <span class="profile-id">ID #${user.id}</span>
            </div>

            <div class="profile-details">
                <div class="detail-item">
                    <span>USER ID</span>
                    <strong>#${user.id}</strong>
                </div>

                <div class="detail-item">
                    <span>AGE</span>
                    <strong>${user.age} years</strong>
                </div>
            </div>

            <div class="bio">
                <span>BIOGRAPHY</span>
                <p>${user.bio}</p>
            </div>

        </div>
    `;

  logRequest(userId, "200 OK", accessMessage);
}

toggle.addEventListener("click", () => {
  isVulnerable = !isVulnerable;

  updateSecurityStatus();

  // Clear previous results to avoid misleading states.
  results.innerHTML = `
        <div class="empty-state">
            <span class="empty-icon">⌕</span>
            <h3>Security Configuration Updated</h3>
            <p>Submit a new request to test the current configuration.</p>
        </div>
    `;

  requestLog.innerHTML = `
        <p class="log-placeholder">Waiting for a request...</p>
    `;
});

document
  .getElementById("getProfileButton")
  .addEventListener("click", getUserProfile);

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    getUserProfile();
  }
});

updateSecurityStatus();
