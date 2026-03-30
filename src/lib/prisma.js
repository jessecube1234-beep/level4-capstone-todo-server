// Shared Prisma client instance for all DB access.
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
