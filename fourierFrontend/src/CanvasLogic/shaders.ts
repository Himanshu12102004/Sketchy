const vertexShader = `#version 300 es
precision mediump float;
in vec3 vertex;
out float timestamp;
uniform float maxX;
uniform float maxY;
uniform float minX;
uniform float minY; 
void main() {
    vec2 vert=vec2(
      (2.0 * (vertex.x - minX)) /
        (maxX - minX) -
        1.0,
      (2.0 * (vertex.y - minY)) /
        (maxY - minY) -
        1.0);
    gl_Position = vec4(vert, 0.0, 1.0);
    timestamp=vertex.z;
}
`;
const fragmentShader = `#version 300 es
precision mediump float;
out vec4 color;
in float timestamp;
uniform float currTime;
void main(){
if(timestamp>0.0){
        float age = currTime - timestamp;
        float alpha = 1.0 - clamp(age / 10000.0, 0.0, 1.0);
        color = vec4(0.0, 1.0, 0.0, alpha);
}
else
  color=vec4(1.0,1.0,1.0,0.0);
}`;
export { vertexShader, fragmentShader };
