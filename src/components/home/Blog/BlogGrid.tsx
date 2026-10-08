"use client";

import { BLOG_GRID_GAP } from "./blog.constants";
import { blogPosts } from "./blog.data";
import BlogCard from "./BlogCard";

export default function BlogGrid() {
  return (
    <div
      className="
        grid

        grid-cols-1

        md:grid-cols-2

        xl:grid-cols-3
      "
      style={{
        gap: BLOG_GRID_GAP,
      }}
    >
      {blogPosts
        .slice(0, 3)
        .map((post) => (
          <BlogCard
            key={post.id}
            post={post}
          />
        ))}
    </div>
  );
}