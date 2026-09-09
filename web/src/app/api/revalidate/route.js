import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { secret, path, tag, tags, action, slug } = body;

    console.log("Revalidation request received:", { secret, path, tag, tags, action, slug });

    // Verify secret token to prevent unauthorized revalidation
    if (secret !== process.env.NEXT_PUBLIC_REVALIDATION_SECRET) {
      return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    }

    let revalidated = {
      paths: [],
      tags: [],
      action: action || null,
    };

    // Handle action-based revalidation
    if (action) {
      switch (action) {
        case "missions":
          revalidateTag("missions", "max");
          revalidated.tags.push("missions");
          break;

        case "mission":
          revalidateTag("mission", "max");
          if (slug) {
            revalidateTag(`mission-${slug}`, "max");
            revalidated.tags.push("mission", `mission-${slug}`);
          } else {
            revalidated.tags.push("mission");
          }
          // Also revalidate missions list
          revalidateTag("missions", "max");
          revalidated.tags.push("missions");
          break;

        case "all":
          revalidateTag("missions", "max");
          revalidateTag("mission", "max");
          revalidated.tags.push("missions", "mission");
          break;

        default:
          return NextResponse.json({ message: `Invalid action: ${action}` }, { status: 400 });
      }
    } else {
      // Original behavior: Revalidate by tag(s)
      if (tag) {
        revalidateTag(tag, "max");
        revalidated.tags.push(tag);
      }

      if (tags && Array.isArray(tags)) {
        tags.forEach(t => {
          revalidateTag(t, "max");
          revalidated.tags.push(t);
        });
      }

      // Revalidate by path
      if (path) {
        revalidatePath(path);
        revalidated.paths.push(path);
      } else if (!tag && !tags) {
        // Default to home page if no path or tag specified
        revalidatePath("/");
        revalidated.paths.push("/");
      }
    }

    return NextResponse.json({
      revalidated: true,
      ...revalidated,
      now: Date.now(),
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Error revalidating", error: err.message },
      { status: 500 },
    );
  }
}
