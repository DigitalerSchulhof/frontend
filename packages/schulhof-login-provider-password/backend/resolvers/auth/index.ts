export async function login(ctx, { username, password }) {
  const [user] = await ctx.query<User>`
    FOR user IN users
      FILTER user.username == ${username}
      FILTER SHA512(CONCAT(${password}, user.salt)) == user.password
      LIMIT 1
      RETURN user
  `;

  return user ?? null as User | null;
}
