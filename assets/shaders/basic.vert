#version 300 es
precision highp float;
precision highp int;

in vec2 vertex_pos;
in vec2 vertex_uv;

uniform mat4 transform;
uniform mat4 camera;

out vec2 uv;

void main()
{
    gl_Position = camera * transform * vec4(vertex_pos, 0, 1);

    uv = vertex_uv;
}


