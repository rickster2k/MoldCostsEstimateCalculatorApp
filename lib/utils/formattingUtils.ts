export function formatTimestamp(isoString: string): string {
    return new Date(isoString).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    })
}


export const Capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
