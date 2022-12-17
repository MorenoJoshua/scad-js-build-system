import {circle, difference, union} from "scad-ts";
import {screwDimensions, Screws} from "./dict";
import {fuseHelper} from "../../helpers/general";


export const screw = (kind: Screws, length: number) => {
    const {
        screwLibHead,
        screwLibBody
    } = screwDimensions[kind];

    // main parts
    const head = circle(screwLibHead.diameter / 2)
        .linear_extrude(screwLibHead.height);
    const body = circle(screwLibBody.diameter / 2)
        .linear_extrude(length);

    const footprint = circle(screwLibBody.diameter / 2)


    const {
        fuseScale,
        scaleDifference
    } = fuseHelper(length, 1.01);
    console.log({scaleDifference});
    const fullScrew = union(
        head,
        body
            .scale_z(fuseScale)
            .translate([0, 0, -length])
    )

    const column = (columnHeight: number, padding: number, tightness = 0.5) => {
        const columnSize = (screwLibBody.diameter / 2) + (padding / 2);
        const columnHole = (screwLibBody.diameter / 2) - (tightness / 2);

        const columnFootprint = difference(
            circle(columnSize),
            circle(columnHole)
        )

        return [
            columnFootprint.linear_extrude(Math.min(columnHeight, length)),
            {
                footprint: columnFootprint,
                columnHeight,
                padding,
                tightness,
                columnSize,
                columnHole,
                safeDiameter: columnSize,
            }
        ]
    }


    return [fullScrew, {
        footprint: footprint,
        column,
        parts: {
            head,
            body,
        },
        length,
        kind,
        safeDiameter: screwLibHead.diameter,
    }] as const;
}