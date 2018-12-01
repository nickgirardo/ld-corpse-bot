#version 300 es
precision highp float;
precision highp int;

in vec2 vertex_uv;

uniform mat4 camera;
uniform uint xTiles;

out vec2 uv;

// Warning! Gnarly!
// This generates a square map pattern without taking in any vertices
void main()
{
    gl_Position = camera * vec4(
        float((uint(gl_VertexID) % 2u) + ((uint(gl_VertexID) / 6u) % xTiles)),
        float((((uint(gl_VertexID) + 1u) / 3u) % 2u) + uint(gl_VertexID) / (6u * xTiles)), 0, 1);

    uv = vertex_uv;
}


