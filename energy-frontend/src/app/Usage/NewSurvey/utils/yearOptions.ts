export const getLast3CompletedYears = () => {
    const currentYear = new Date().getFullYear();

    const lastCompletedYear = currentYear - 1;

    return Array.from({ length: 3 }, (_, i) => {
        const year = lastCompletedYear - i;
        return {
            label: year.toString(),
            value: year,
        };
    });
};
