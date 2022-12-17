export enum Screws {
    M3,
    M4,
    M5,
}


export const screwDimensions = {
    [Screws.M3]: {
        screwLibBody: {
            diameter: 3,
        },
        screwLibHead: {
            diameter: 5,
            height: 2,
        }
    },
    [Screws.M4]: {
        screwLibBody: {
            diameter: 4,
        },
        screwLibHead: {
            diameter: 7,
            height: 4,
        }
    },
    [Screws.M5]: {
        screwLibBody: {
            diameter: 5,
        },
        screwLibHead: {
            diameter: 8,
            height: 5,
        }
    },
} as const;
