import { z } from "zod";
import sharp from "sharp";
import { eq } from "drizzle-orm";
import { put, type PutBlobResult } from "@vercel/blob";

import { db } from "@/server/db";
import { auth } from "@/server/auth";
import { users } from "@/server/db/schema";

export async function PUT(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const formData = await request.formData();

    if (!userId) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    const name = formData.get("name");
    const file = formData.get("file") as File;

    if (!name) {
      return Response.json({ error: "Name is required" }, { status: 400 });
    }

    let imageUrl: string | null = null;

    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const convertedBuffer = await sharp(buffer)
        .jpeg({ quality: 90 })
        .toBuffer();

      // const ext = getFileExtension(file);
      const fileName = `user-images/${userId}.jpeg`;

      if (!convertedBuffer) {
        return Response.json(
          { error: "This file is invalid" },
          { status: 400 }
        );
      }

      const blob: PutBlobResult = await put(fileName, convertedBuffer, {
        access: "public",
        allowOverwrite: true,
        addRandomSuffix: false,
      });

      imageUrl = blob.url;
    }

    const updatedUser = await db
      .update(users)
      .set({ name: name as string, ...(imageUrl && { image: imageUrl }) })
      .where(eq(users.id, userId))
      .returning();

    console.log(updatedUser[0]);
    const user = updatedUser[0];

    return Response.json(
      {
        user: { name: user?.name, image: user?.image },
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.errors }, { status: 400 });
    }

    return Response.json(
      { error: "Error saving user profile" },
      { status: 500 }
    );
  }
}
