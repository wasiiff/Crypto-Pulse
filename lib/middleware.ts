import { getServerSession } from "next-auth"
import { authOptions } from "./auth"

export async function requireAuth() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    throw new Error("Unauthorized")
  }
  
  return session
}
