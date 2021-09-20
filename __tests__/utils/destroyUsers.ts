import User from 'App/Models/User'

export async function DestroyUsers() {
  const users = await User.all()
  users.forEach(async (user) => {
    if (user.id !== 1) await user.delete()
  })
}
