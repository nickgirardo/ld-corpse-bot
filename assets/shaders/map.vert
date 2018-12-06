#version 300 es
precision highp float;
precision highp int;

in uint tileNum;

uniform mat4 camera;

// Width of map in tiles
uniform uint mapTileWidth;
// Width, height of tilesheet in px
uniform uint tsPxWidth;
// Width, height of tilesheet in tiles
uniform uint tsTileWidth;

// Used for animation
// Array length is count of tiles in tilesheet
// How many frames for each animated tile
// 1 if tile is unanimated
// TODO currently this array is of fixed length although
// the rest of the shader supports variable size tilesheets
uniform uint animationFrames[64];
// How long each frame lasts (TODO should this be const?) in ms
uniform uint frameDuration[64];
// How long the player has been on the current stage in ms
uniform uint stageTime;


out vec2 uv;

float uvCorrect(uint pos) {
    return (float(pos) + 0.5f)/float(tsPxWidth);
}

// Warning! Gnarly!
// This generates a square map pattern without taking in any vertices
void main() {
    uint vert = uint(gl_VertexID);
    gl_Position = camera * vec4(
        float((vert % 2u) + ((vert / 6u) % mapTileWidth)),
        float((((vert + 1u) / 3u) % 2u) + vert / (6u * mapTileWidth)), 0, 1);

    uint tilePxWidth = tsPxWidth / tsTileWidth;

    float xShift = float(tileNum % tsTileWidth) / float(tsTileWidth);
    uint yTileShift = tileNum / tsTileWidth;
    uint yAnimShift = (stageTime/frameDuration[tileNum]) % animationFrames[tileNum];
    float yShift = float(yTileShift + yAnimShift) / float(tsTileWidth);

    uv = vec2(
        uvCorrect((vert % 2u) * (tilePxWidth - 1u)) + xShift,
        uvCorrect((((vert + 4u) / 3u) % 2u) * (tilePxWidth - 1u)) + yShift
    );
}


