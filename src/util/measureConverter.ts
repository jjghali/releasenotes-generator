const colorForCoverage = (coverage: Number): string => {
    if (coverage === undefined || coverage === null) return ""

    if (coverage < 50) return "red"
    if (coverage < 60) return "orange"
    if (coverage < 70) return "yellow"
    if (coverage < 80) return "olive"

    return "green"
}

const colorForNumber = (number: string): string => {
    if (number === undefined || number === null) return ""

    if (number === "1.0") return "green"
    if (number === "2.0") return "olive"
    if (number === "3.0") return "yellow"
    if (number === "4.0") return "orange"
    if (number === "5.0") return "red"

    return ""
}

const letterForNumber = (number: string): string => {
    if (number === undefined || number === null) return ""

    const NUMBER_LETTER_MAP: any = {
        "1.0": "A",
        "2.0": "B",
        "3.0": "C",
        "4.0": "D",
        "5.0": "E"
    }
    return NUMBER_LETTER_MAP[number]
}

export { colorForCoverage, colorForNumber, letterForNumber }
