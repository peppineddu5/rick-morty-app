# Technical Considerations

## 1. Image Storage Access Pattern

### Current Implementation

Currently using a redirect-based approach to serve images from storage:

```ts
app.get(
  "/character/image/:storageId",
  zValidator(
    "param",
    z.object({
      storageId: zStorageId,
    }),
  ),
  async (c) => {
    const { storageId } = c.req.valid("param");
    const url = await c.env.storage.getUrl(storageId);

    if (!url) return c.notFound();

    return c.redirect(url, 302);
  },
);
```

### Concerns

- **Cache inefficiency**: HTTP 302 redirects aren't cached by browsers, resulting in unnecessary round trips
- **Performance overhead**: Each image request requires two HTTP requests (one to the endpoint, one to the actual storage URL)
- **Next.js Image optimization incompatibility**: The `next/image` component cannot optimize images served through redirects, as it requires direct access to the image binary data. This prevents leveraging automatic image optimization, responsive sizing ecc.

---

## 2. Development Reverse Proxy Configuration

### Current Implementation

Using Next.js rewrites to proxy image requests in development:

```ts
async rewrites() {
  return process.env.ENVIROMENT === "development"
    ? [
        {
          source: "/character/image/:id",
          destination: `${process.env.NEXT_PUBLIC_CONVEX_URL?.replace(".cloud", ".site")}/character/image/:id`,
        },
      ]
    : [];
}
```

### Concerns

- **String manipulation fragility**: URL transformation via `.replace(".cloud", ".site")` is brittle and error-prone
- **Production readiness**: Current approach is explicitly development-only with no production strategy
- **HTTP protocol assumption**: May not handle HTTPS requirements properly in all environments

---

## 3. Migration Component Limitations

### Issue

The Convex migrations component ([docs](https://www.convex.dev/components/migrations)) cannot execute actions, which prevents using `fetch` or other Node.js APIs during migrations.
