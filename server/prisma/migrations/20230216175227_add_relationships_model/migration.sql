-- CreateTable
CREATE TABLE "relationships" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "following_user_id" TEXT,
    CONSTRAINT "relationships_following_user_id_fkey" FOREIGN KEY ("following_user_id") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
