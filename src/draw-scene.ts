import { mat4 } from "gl-matrix";
import { PositionBuffers } from "./init-buffers";
import { ProgramInfo } from "./main";

export default function drawScene(gl: WebGL2RenderingContext, programInfo: ProgramInfo, buffers: PositionBuffers) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0); //Clear to black
    gl.clearDepth(1.0); //Clear everything
    gl.enable(gl.DEPTH_TEST); //Enable depth testing
    gl.depthFunc(gl.LEQUAL); //Near things obsucre far things

    //Clear convas before drawing
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Clear a perspective matrix. (Matrix that used to simulate distortion of perspective in camera).
    // Our field of view is 45degrees, with a width/height.
    // We only want to see objects between 0.1 units and 100 units away from the camera.
    //
    const FIELD_OF_VIEW = (45 * Math.PI) / 180; //Get 45deg in radians.
    const ASPECT = gl.canvas.width / gl.canvas.height;
    const Z_NEAR = 0.1;
    const Z_FAR = 100.0;

    const projectionMatrix = mat4.create()
    mat4.perspective(projectionMatrix, FIELD_OF_VIEW, ASPECT, Z_NEAR, Z_FAR);
    const modelViewMatrix = mat4.create();

    // Now move the drawing position a bit to where we want to start drawing.
    mat4.translate(
        modelViewMatrix,
        modelViewMatrix,
        [-0.0, 0.0, -6.0],
    );

    setPositionAttribute(gl, buffers, programInfo);

    gl.useProgram(programInfo.program);
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix,
    );
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix,
    );
    const offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
}

function setPositionAttribute(gl: WebGL2RenderingContext, buffers: PositionBuffers, programInfo: ProgramInfo) {
    const numComponents = 2 // pull out 2 values per iteration
    const type = gl.FLOAT; // the data in the buffer is 32 bit floats
    const normalize = false;
    const stride = 0; // how many bytes to get from one set of values to the next.
    const offset = 0; // how many bytes inside the buffer to start from.
    const index = programInfo.attribLocations.vertexPosition;

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        index,
        numComponents,
        type,
        normalize,
        stride,
        offset,
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}
