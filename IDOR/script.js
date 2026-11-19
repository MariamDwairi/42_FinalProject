const users = [
  {
    id: "1",
    username: "john_doe",
    name: "John Doe",
    age: 19,
    pfp: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfwUYgMgqE5y2zj1gQmZyYhRI9NOeyFK6uYAsA5-giai9n6jbDIcrWyJQWN-nEXwKHsWImK21W6_YNGDYJeG0snrb1rpzqUrwUgNTV6bqn8g&s=10",
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

function getUserProfile() {
  let userId = document.getElementById("get_user").value;
  let results = document.getElementById("result");
  let user = users.find((user) => user.id === userId);
  if (user) {
    let user_profile = `
            <h2>${user.name}</h2>
            <p><strong>Username:</strong> ${user.username}</p>
            <p><strong>Age:</strong> ${user.age}</p>
            <img src="${user.pfp}" alt="${user.name}'s profile picture" />
            <p><strong>Bio:</strong> ${user.bio}</p>
        `;
    results.innerHTML = user_profile;
  } else {
    results.innerHTML = "<p>User not found.</p>";
  }
}
