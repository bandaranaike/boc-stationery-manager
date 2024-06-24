export function format(value: number | undefined, minFrcDgt = 2) {
    if (value !== undefined) {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: minFrcDgt,
            maximumFractionDigits: 2
        }).format(value);
    }
}