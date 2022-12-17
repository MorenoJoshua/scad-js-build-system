import {Scad, ScadMethods, ScadVector3, union, Vector} from "scad-ts";

export const mapValues = (value: number, start1: number, stop1: number, start2: number, stop2: number) => {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

export const pointsBetween = (pointA: Vector, pointB: Vector, count: number, center = false) => {
    const points = [];
    for (let i = 0; i < count; i++) {
        const percent = i / (count - 1);
        const point = [
            mapValues(percent, 0, 1, pointA[0], pointB[0]),
            mapValues(percent, 0, 1, pointA[1], pointB[1]),
            mapValues(percent, 0, 1, pointA[2], pointB[2]),
        ];
        const centeredPoint = [
            point[0] - (center ? (pointB[0] - pointA[0]) / 2 : 0),
            point[1] - (center ? (pointB[1] - pointA[1]) / 2 : 0),
            point[2] - (center ? (pointB[2] - pointA[2]) / 2 : 0),
        ];
        points.push(centeredPoint);
    }
    return points;
}

export const fuseHelper = (size: number, fuseScale = 1.01) => {
    const scaledSize = size * fuseScale;
    const scaleDifference = scaledSize - fuseScale;
    return {
        size,
        fuseScale,
        scaledSize,
        scaleDifference
    }
}

export const shapeOnPoints = (shape: Scad & ScadMethods, points: Vector[]) => {
    return points.map(point => shape.translate(point));
}


export const shapeToGrid = (item: Scad & ScadMethods, options = {
    safeDistance: [
        0, 0,
    ],
    spacing: [
        0, 0,
    ],
    repeat: [
        0, 0,
    ]
}) => {
    const {
        safeDistance,
        spacing,
        repeat
    } = options;
    const [safeDistanceX, safeDistanceY] = safeDistance;
    const [spacingX, spacingY] = spacing;
    const [repeatX, repeatY] = repeat;

    const totalSpacingX = (repeatX - 1) * spacingX;
    const totalSpacingY = (repeatY - 1) * spacingY;

    const totalSafeDistanceX = safeDistanceX * (repeatX - 1);
    const totalSafeDistanceY = safeDistanceY * (repeatY - 1);

    const centerToCenterX = totalSafeDistanceX + totalSpacingX;
    const centerToCenterY = totalSafeDistanceY + totalSpacingY;
    const edgeToEdgeX = centerToCenterX + safeDistanceX;
    const edgeToEdgeY = centerToCenterY + safeDistanceY;

    const clonesX = union(
        ...shapeOnPoints(
            item,
            pointsBetween([0, 0, 0], [centerToCenterX, 0, 0], repeatX, true)
        ),
    );
    const clonesXY = union(
        ...shapeOnPoints(
            clonesX,
            pointsBetween([0, 0, 0], [0, centerToCenterY, 0], repeatY, true)
        ),
    );

    return [
        clonesXY,
        {
            ...options,
            totalSpacingX,
            totalSpacingY,
            totalSafeDistanceX,
            totalSafeDistanceY,
            centerToCenterX,
            centerToCenterY,
            edgeToEdgeX,
            edgeToEdgeY,
        }
    ] as const;
}

export const curriedTranslate = (point: ScadVector3) => (item: Scad & ScadMethods) => item.translate(point);
export const curriedRotate = (point: ScadVector3) => (item: Scad & ScadMethods) => item.rotate(point);
