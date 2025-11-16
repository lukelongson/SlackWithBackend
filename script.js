function changeChannel(e) {
  document.querySelector(".active")?.classList.remove("active");
  e.currentTarget.classList.add("active");
  populateMessages(e.currentTarget.getAttribute("data-channel"));
  document.querySelector("#channel-title").innerText =
    e.currentTarget.innerText;
}

async function populateMessages(chat) {
  document.querySelectorAll(".message").forEach((item) => item.remove());
  let template = document.querySelector("template");

  const msgResponse = await fetch(
    `https://slackclonebackendapi.onrender.com/messages?channelId=${chat}`
  );
  const messages = await msgResponse.json();

  for (let message of messages) {

    // Fetch the name of our sender
    console.log("Message object: ", message)
    const userResponse = await fetch(
      `https://slackclonebackendapi.onrender.com/users?id=${message.senderId}`
    );
    const userData = await userResponse.json();
    console.log("User Response:", userData)

    const senderName = userData[0]?.name || "Unknown";

    // Clone our template

    let clone = template.content.cloneNode(true);
    clone.querySelector(".sender").innerText = senderName + ":";
    clone.querySelector(".text").innerText = message.content;

    document.querySelector("#chat-messages").appendChild(clone);
  }
}


async function init() {
  const response = await fetch(
    "https://slackclonebackendapi.onrender.com/channels"
  );
  const channels = await response.json();

  const container = document.querySelector(".channel-list");

  channels.forEach((channel, i) => {
    let btn = document.createElement("button");
    btn.classList.add("channel");
    btn.setAttribute("data-channel", channel.id);
    btn.innerText = channel.name;

    // Select first channel
    if (i === 0) btn.classList.add("active");

    container.appendChild(btn);
  });

  document.querySelectorAll(".channel").forEach((item) => item.addEventListener("click", changeChannel));

  // Auto-load first channel
  const firstChannel = channels[0];
  if (firstChannel) populateMessages(firstChannel.id);
}

init();
