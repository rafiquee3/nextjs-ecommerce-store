export function purifyQuery(query: string): string {
    if (!query) {
        return '';
    }

    const cleanQuery = query.replace(/[^\w\s-]/g, '');
    const singleSpaceQuery = cleanQuery.replace(/\s+/g, ' ').trim();
    
    return singleSpaceQuery;
}