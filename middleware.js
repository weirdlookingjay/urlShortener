import { redis } from "./lib/redis";
import { NextResponse } from "next/server";

export default async function middleware(req) {
  if (req.nextUrl.pathname.startsWith("/go")) {
    // get the shortUrl
    const pathname = req.nextUrl.pathname;
    let parts = pathname.split("/");
    let shortUrl = parts[parts.length - 1];

    const getValidUrl = (link) => {
      if (link.indexOf("http://") == 0 || link.indexOf("https://") == 0) {
        // Link has http or https -> return as is
        return link;
      } else {
        // Link doesnt have http or https -> add it
        return `http://${link}`;
      }
    };

    // load long url from redis for short url
    const longUrl = await redis.hget("links", shortUrl);
    if (longUrl) {
      // short url found
      const validUrl = getValidUrl(longUrl);
      return NextResponse.redirect(validUrl);
    } else {
      // short url not found
      return NextResponse.redirect(req.nextUrl.origin);
    }
  }
}
