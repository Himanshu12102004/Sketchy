import { shaderCompiler } from '../helpers/compileShaders';
import GlobalVariables from './GlobalVariable';

function compileShader(
  vertexShaderSource: string,
  fragmentShaderSource: string
) {
  let vertexShader = shaderCompiler(
    vertexShaderSource,
    GlobalVariables.gl.VERTEX_SHADER,
    GlobalVariables.gl
  );
  let fragmentShader = shaderCompiler(
    fragmentShaderSource,
    GlobalVariables.gl.FRAGMENT_SHADER,
    GlobalVariables.gl
  );
  return { vertexShader, fragmentShader };
}
export { compileShader };
