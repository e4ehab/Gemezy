import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Sign in to upload location images." }, { status: 401 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "Image uploads are not configured. Add the Cloudinary environment variables." },
      { status: 503 },
    );
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = `gemezy/${session.user.id}/locations`;
  const allowedFormats = "avif,jpg,jpeg,png,webp";
  const signaturePayload = `allowed_formats=${allowedFormats}&folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = createHash("sha1").update(signaturePayload).digest("hex");

  return NextResponse.json({ cloudName, apiKey, timestamp, folder, signature, allowedFormats });
}
