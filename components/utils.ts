export function separateJsonByNewline(jsonStrings: string): string[] {
    return jsonStrings.trim().split("\n")
}