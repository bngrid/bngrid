-- CreateEnum
CREATE TYPE "Status" AS ENUM ('pending', 'active', 'banned', 'deleted');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('basic', 'admin', 'super');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(16) NOT NULL,
    "password" VARCHAR(60) NOT NULL,
    "email" VARCHAR(60) NOT NULL,
    "coin" INTEGER NOT NULL DEFAULT 0,
    "status" "Status" NOT NULL DEFAULT 'pending',
    "role" "Role" NOT NULL DEFAULT 'basic',
    "create" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
