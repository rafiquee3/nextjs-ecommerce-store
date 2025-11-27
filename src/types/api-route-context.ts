// 1. Define the final shape of the parameters object
interface ResolvedParams {
    slug: string; // Key must match the folder name [slug]
}

// 2. Define the structure of the 'params' object, which is wrapped in a Promise
interface PromiseParamsWrapper {
    params: Promise<ResolvedParams>; 
}

// 3. Define the structure of the overall 'context' argument
// The 'context' argument itself is a Promise that resolves to the object 
// containing the Promise-wrapped 'params'.
export interface CategoryRouteContext extends Promise<PromiseParamsWrapper> {}