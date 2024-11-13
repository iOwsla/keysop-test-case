export function deleteKeys<O extends { [k: string]: any }, DKeys extends keyof O>(object: O, keysToDelete: DKeys[]) {
    return Object.fromEntries(
        Object.entries(object)
            .filter(([key]) => !keysToDelete.includes(key as DKeys))
    ) as Omit<O, DKeys>
};