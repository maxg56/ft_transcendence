
export function hasId(value: unknown): value is { id: string } {
    return typeof value === 'object' && value !== null && 'id' in value;
}
  
