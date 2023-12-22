import drawScene from './draw-scene';
import initBuffers from './init-buffers';
import './style.css'

const VS_SOURCE = `
    attribute vec4 aVertexPosition;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
  `; //Vertex shader source code.

const FS_SOURCE = `
    void main() {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
  `; //Fragment shader source code.

export type ProgramInfo = {
    program: WebGLProgram;
    attribLocations: {
        vertexPosition: number;
    };
    uniformLocations: {
        projectionMatrix: WebGLUniformLocation | null;
        modelViewMatrix: WebGLUniformLocation | null;
    };
}

function main() {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const gl = canvas.getContext('webgl2');

    if (gl == null) {
        console.error("Unable to initialize webgl. Your browser may not support it.");
        return;
    }

    // gl.clearColor(0, 0, 0, 1);
    // gl.clear(gl.COLOR_BUFFER_BIT);

    const shaderProgram = initShaderProgram(gl, VS_SOURCE, FS_SOURCE);
    if (!shaderProgram) {
        return;
    }

    const programInfo: ProgramInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
        }
    }

    const positionBuffers = initBuffers(gl)
    drawScene(gl, programInfo, positionBuffers);
}

function initShaderProgram(gl: WebGL2RenderingContext, vsSource: string, fsSource: string): WebGLProgram | null {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) {
        console.error('Failed to load shader');
        return null;
    }

    const shaderProgram = gl.createProgram();
    if (!shaderProgram) {
        console.error('Failed to create program');
        return null;
    }

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error(`Unable to initialize shader program ${gl.getProgramInfoLog(shaderProgram)}`);
        gl.deleteProgram(shaderProgram);
        return null;
    }

    return shaderProgram;
}

function loadShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null {
    const shader = gl.createShader(type);
    if (!shader) {
        console.error('Cannot create shader')
        return null;
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    /**
     * Check if compiled successfully
     **/
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(`Error occurred while compiling shader ${gl.getShaderInfoLog(shader)}`);
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

main();
