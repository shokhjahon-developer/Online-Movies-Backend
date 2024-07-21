const nodemailer = require("nodemailer");
const { email } = require("../../config");

let configOptions = {
  host: email.host,
  port: email.port,

  auth: {
    user: email.user,
    pass: email.pass,
  },
};

const transporter = nodemailer.createTransport(configOptions);

async function sendMail(to, code) {
  const info = await transporter.sendMail({
    from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>',
    to,
    subject: "YOUR VARIFICATION CODE ✔",
    text: `Sizning tasdiqlash kodingiz: ${code}`,
    html: `Sizning tasdiqlash kodingiz: <b> ${code}</b>`,
  });
}

module.exports = sendMail;
