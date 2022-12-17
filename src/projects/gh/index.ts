import fs from "fs";
import {square, union} from "scad-ts";
import {sanwaButton} from "../../parts/buttons/buttons";
import {curriedRotate, curriedTranslate, shapeToGrid} from "../../helpers/general";
import {Colors} from "../../constants/colors";

const [button, {
    safeDiameter,
}] = sanwaButton(Colors.Green);

const [frets, {
    edgeToEdgeY,
    edgeToEdgeX,
}] = shapeToGrid(button, {
    safeDistance: [safeDiameter, safeDiameter],
    spacing: [1, 0],
    repeat: [5, 1]
});

const fretTransforms = curriedTranslate([250, 0, 0])
// Testing containment
const fretsPlane = square([edgeToEdgeX, edgeToEdgeY], true);
const fretsPart = fretTransforms(union(
    frets,
    fretsPlane,
));

const [upDown] = shapeToGrid(button, {
    safeDistance: [safeDiameter, safeDiameter],
    spacing: [0, 1],
    repeat: [1, 2]
});

const [leftRight] = shapeToGrid(button, {
    safeDistance: [safeDiameter, safeDiameter],
    spacing: [safeDiameter, 0],
    repeat: [2, 1]
});

const udlrButtons = union(
    leftRight,
    upDown,
).rotate([0, 0, -10]);

const [extrabuttons] = shapeToGrid(button, {
    safeDistance: [safeDiameter, safeDiameter],
    spacing: [0, 0],
    repeat: [1, 2]
});

const extraButtonsTransform = item =>
    curriedTranslate([-safeDiameter * 4.5, -safeDiameter * 2, 0])(
        curriedRotate([0, 0, -20])(item)
    );
const menuButtons = extraButtonsTransform(extrabuttons);

const whammy = button
    .translate([-safeDiameter * 2, -safeDiameter, 0]);

const output = union(
    fretsPart,
    udlrButtons,
    whammy,
    menuButtons,
);

fs.writeFileSync('./dist/gh.scad', output.serialize({$fn: 90}));
