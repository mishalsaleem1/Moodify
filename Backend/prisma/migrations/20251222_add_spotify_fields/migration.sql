-- AddColumn
ALTER TABLE "User" ADD COLUMN "spotifyAccessToken" TEXT;
ALTER TABLE "User" ADD COLUMN "spotifyTokenExpiry" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN "spotifyRefreshToken" TEXT;
