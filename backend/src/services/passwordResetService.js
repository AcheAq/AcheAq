const userRepository = require("../repositories/userRepository");
const passwordResetTokenRepository = require("../repositories/passwordResetTokenRepository");
const { sendEmail } = require("./mailService");

const { generateToken, hashToken } = require("../utils/token");

const { hashPassword } = require("../utils/hash.js");

async function requestPasswordReset(email) {
  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    return;
  }

  await passwordResetTokenRepository.deleteByUserId(user.id);

  const resetToken = generateToken();
  const tokenHash = hashToken(resetToken);

  await passwordResetTokenRepository.create({
    token: tokenHash,
    userId: user.id,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000),
  });

  const resetLink = `${process.env.RESET_PASSWORD_URL}?token=${resetToken}`;

  await sendEmail(
    user.email,
    "Recuperação de senha",
    `
      <h2>Recuperação de senha</h2>
      <p>Clique no link abaixo:</p>
      <a href="${resetLink}">Redefinir senha</a>
    `,
  );
}

async function resetPassword(token, newPassword) {
  const tokenHash = hashToken(token);

  const resetToken =
    await passwordResetTokenRepository.findValidToken(tokenHash);

  if (!resetToken) {
    throw new Error("Token inválido ou expirado.");
  }

  const hashedPassword = await hashPassword(newPassword);

  await userRepository.updatePassword(resetToken.user.id, hashedPassword);

  await passwordResetTokenRepository.markAsUsed(resetToken.id);
}

module.exports = {
  requestPasswordReset,
  resetPassword,
};
