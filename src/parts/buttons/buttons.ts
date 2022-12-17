import {Colors} from "../../constants/colors";
import {circle, square, union} from "scad-ts";

export const sanwaButton = (color = Colors.Red) => {
    // "body": the part that is inside the container
    const bodyDiameter = 29.5;
    const bodyHeight = 19.7;
    const bodyPiece = circle(bodyDiameter / 2)
        .linear_extrude(bodyHeight)
        .translate([0, 0, -bodyHeight]);

    // "ledge": the lip that sticks out from the button,
    // prevents the button from being pushed in
    const buttonLedgeSize = 33.4 - bodyDiameter;
    const buttonLedgeHeight = 3;
    const buttonPiece = circle((bodyDiameter + (buttonLedgeSize)) / 2)
        .linear_extrude(buttonLedgeHeight, {
            scale: 0.85
        });

    // "pressable": the part that gets pressed into the microswitch
    const pressableDiameter = 24.5;
    const pressableHeight = 6.4;
    const pressablePiece = circle(pressableDiameter / 2)
        .linear_extrude(pressableHeight);

    // "pegs": the part that the cables are attached to
    const pegThickness = 1;
    const pegsize = 9;
    const pegHeight = bodyHeight + 3;
    const pegs = square([pegsize, pegThickness], true)
        .linear_extrude(pegHeight)
        .translate([0, 0, -pegHeight]);

    // other values
    const safeDiameter = buttonLedgeSize + bodyDiameter;


    const buttonMock = union(
        pressablePiece,
        buttonPiece,
        bodyPiece,
        pegs,
    ).color(color);

    return [
        buttonMock,
        {
            parts: {
                pressable: pressablePiece,
                button: buttonPiece,
                body: bodyPiece,
                pegs,
            },
            bodyDiameter,
            bodyHeight,
            buttonLedgeSize,
            buttonLedgeHeight,
            pressableDiameter,
            pressableHeight,
            pegThickness,
            pegsize,
            pegHeight,
            safeDiameter,
            footprint: circle(bodyDiameter / 2),
        }
    ] as const;
}