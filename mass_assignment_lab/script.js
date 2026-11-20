
const original = {
    name: "Bad Bunny",
    email: "benito@std.edu",
    gpa: 2.1,
    tuitionDue: 4000
};

const payloads = {
    gpa: { name: "Bad Bunny", gpa: 4.0 },
    tuitionDue: { name: "Bad Bunny", tuitionDue: 0 }
};

let student = { ...original };
let fixed = false;
let selected = null;

const $ = id => document.getElementById(id);

// Display student account
function display() {
    $("gpa").textContent = student.gpa.toFixed(1);
    $("tuition").textContent = "$" + student.tuitionDue;
    $("response").textContent = JSON.stringify(student, null, 2);
}

// Select payload
document.querySelectorAll("[data-payload]").forEach(button => {
    button.onclick = () => {
        selected = button.dataset.payload;

        $("request").textContent =
            JSON.stringify(payloads[selected], null, 2);

        $("payloadExplanation").textContent =
            `This payload simulates an HTTP request to update
            the student's profile. It includes the protected
            "${selected}" field. The vulnerable application
            accepts it because there is no field allowlist
            restricting which attributes can be updated.`;

        document.querySelectorAll("[data-payload]").forEach(b => {
            const active = b === button;
            b.classList.toggle("active", active);
            b.setAttribute("aria-pressed", active);
        });

        $("message").textContent = "";
        $("joke").textContent = "";
    };
});

// Switch modes
function setMode(value) {
    fixed = value;

    $("badCode").hidden = fixed;
    $("goodCode").hidden = !fixed;

    $("codeTitle").textContent =
        fixed ? "Fixed Code" : "Vulnerable Code";

    $("explanation").textContent = fixed
        ? "Only name and email are allowed. Protected fields are ignored."
        : "Object.assign() copies every field without checking permissions.";

    $("vulnerable").classList.toggle("active", !fixed);
    $("fixed").classList.toggle("active", fixed);

    $("vulnerable").setAttribute("aria-pressed", !fixed);
    $("fixed").setAttribute("aria-pressed", fixed);

    $("message").textContent = "";
    $("joke").textContent = "";
}

$("vulnerable").onclick = () => setMode(false);
$("fixed").onclick = () => setMode(true);

// Run payload
$("run").onclick = () => {
    if (!selected) {
        $("message").textContent = "Select a payload first!";
        return;
    }

    let input = payloads[selected];
    const before = student[selected];

    // Fixed version: allowlist
    if (fixed) {
        const allowed = ["name", "email"];

        input = Object.fromEntries(
            Object.entries(input).filter(
                ([key]) => allowed.includes(key)
            )
        );
    }

    // Vulnerable version: copies everything
    Object.assign(student, input);
    display();

    const changed = student[selected] !== before;

    if (fixed) {
        $("message").textContent =
            "Attack blocked! Protected field was not modified.";

        $("joke").textContent = selected === "gpa"
            ? "Sorry Benito, the A stands for Access Denied."
            : "No freebies, Benito. Even superstars pay tuition." ;

    } else if (changed) {
        $("message").textContent =
            "Attack successful! Protected field modified.";

        $("joke").textContent = selected === "gpa"
            ? "Who needs extra effort when you've got extra parameters?"
            : "Benito found the world's first JavaScript scholarship.";

    } else {
        $("message").textContent =
            "This field already has that value.";

        $("joke").textContent = "";
    }

    $("message").className = changed ? "danger" : "success";
};

// Reset account
$("reset").onclick = () => {
    student = { ...original };
    selected = null;

    $("request").textContent = "Select a payload";
    $("payloadExplanation").textContent = "";
    $("message").textContent = "";
    $("message").className = "";
    $("joke").textContent = "";

    document.querySelectorAll("[data-payload]").forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
    });

    display();
};

setMode(false);
display();
