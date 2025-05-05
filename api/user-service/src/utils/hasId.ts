
export function hasId(value: unknown): value is { id: string | number } {
    return typeof value === 'object' && value !== null && 'id' in value;
}

  
