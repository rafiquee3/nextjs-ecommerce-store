// 1. Define the final shape of the parameters object
interface ResolvedParams {
    slug: string; // Key must match the folder name [slug]
}

// 2. Define the structure of the overall 'context' argument
// In Next.js 15, 'params' is a Promise, but 'context' itself is a plain object.
export interface CategoryRouteContext {
    params: Promise<ResolvedParams>;
}