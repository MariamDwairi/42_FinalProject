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
const authorizationStatus = document.getElementById("authorizationStatus");
const accessControlStatus = document.getElementById("accessControlStatus");
const explanationText = document.getElementById("explanationText");

const requestLog = document.getElementById("requestLog");

function updateSecurityStatus() {
  toggle.classList.toggle("active", isVulnerable);
  toggle.setAttribute("aria-pressed", String(isVulnerable));

  toggleState.textContent = isVulnerable ? "ON" : "OFF";
  toggleState.style.color = isVulnerable ? "var(--red)" : "var(--green)";

  if (isVulnerable) {
    statusIcon.textContent = "⚠";
    statusIcon.style.background = "#422d20";
    statusIcon.style.color = "var(--yellow)";

    statusTitle.textContent = "Vulnerability Detected";

    statusDescription.textContent =
      "Users can access other users' profiles by changing the ID.";

    authorizationStatus.textContent = "Missing";
    authorizationStatus.className = "analysis-value danger";

    accessControlStatus.textContent = "Not Enforced";
    accessControlStatus.className = "analysis-value danger";

    explanationText.textContent =
      "The application retrieves profiles based on the supplied ID without checking whether the authenticated user is authorized to access that resource.";
  } else {
    statusIcon.textContent = "✓";
    statusIcon.style.background = "#193222";
    statusIcon.style.color = "var(--green)";

    statusTitle.textContent = "Vulnerability Fixed";

    statusDescription.textContent = "Users can only access their own profiles.";

    authorizationStatus.textContent = "Enforced";
    authorizationStatus.className = "analysis-value safe";

    accessControlStatus.textContent = "Protected";
    accessControlStatus.className = "analysis-value safe";

    explanationText.textContent =
      "The application checks whether the requested profile belongs to the authenticated user before returning any data.";
  }
}

function logRequest(userId, granted, message) {
  const timestamp = new Date().toLocaleTimeString();

  const logClass = granted ? "log-success" : "log-error";

  requestLog.innerHTML = `
        <div class="${logClass}">
            [${timestamp}] ${granted ? "200 OK" : "403 FORBIDDEN"}
        </div>
        <div>GET /api/users/${userId}</div>
        <div>${message}</div>
    `;
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
                <p>No user exists with ID #${userId}.</p>
            </div>
        `;

    logRequest(userId, false, "Resource not found.");
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

    logRequest(userId, false, "Authorization check failed. Access denied.");

    return;
  }

  const accessMessage = isVulnerable
    ? "IDOR EXPLOIT: Unauthorized resource access successful."
    : "Authorized: Resource ownership verified.";

  results.innerHTML = `
        <div class="profile-card">

            <div class="access-result granted">
                ✓ ${accessMessage}
            </div>

            <div class="profile-header">
                <img
                    src="${user.pfp}"
                    alt="Profile picture"
                    onerror="this.src='https://i.pravatar.cc/150?img=1'"
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

  logRequest(userId, true, accessMessage);
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
