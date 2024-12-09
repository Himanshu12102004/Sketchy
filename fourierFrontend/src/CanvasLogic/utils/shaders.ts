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
uniform vec3 lineColor;
uniform vec3 vectorColor; 
uniform float lAlpha;
uniform float vAlpha;
uniform float timeElapse;
void main(){
if(timestamp>0.0){
        float age = currTime - timestamp;
        float alpha = lAlpha - clamp(age / timeElapse, 0.0, lAlpha);
        color = vec4(lineColor[0], lineColor[1], lineColor[2],alpha);
        // color = vec4(1, 1, 1,1.0);
}
else
  color=vec4(vectorColor[0],vectorColor[1],vectorColor[2],vAlpha);
}`;
export { vertexShader, fragmentShader };
