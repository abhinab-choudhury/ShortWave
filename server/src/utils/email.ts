const sendWelcomeEmail = async function ({ username, email }: {
  username: string | undefined, email: string | undefined
}) {

  const emailTemplate = `
    <html>
      <h1>Welcome to Shortware, ${username}
    </html>
    `;
  await sendEmail(email);
}


async function sendEmail(email: string | undefined) {

}
