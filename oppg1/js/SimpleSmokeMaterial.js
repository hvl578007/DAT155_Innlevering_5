"use strict";

import { ShaderMaterial, TextureLoader } from "./build/three.module.js";

export default class SimpleSmokeMaterial extends ShaderMaterial {

    constructor({
        paramMap = null
    }) {

        const vertexShader = `
            out vec2 vTexCoords;
                
            void main() {
                vTexCoords = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;

        const fragmentShader = `
            
            in vec2 vTexCoords;

            //out vec4 fColor;

            uniform sampler2D aSmokeTexture;
            uniform sampler2D aShaderParamTexture;

            void main() {
                vec4 smokeColor = texture(aSmokeTexture, vTexCoords);
                vec4 textureColor = texture(aShaderParamTexture, vTexCoords);
                //fColor = mix(smokeColor, textureColor, 0.5);

                //ser denne ligg innebygd i shader frå threejs??
                pc_fragColor = mix(smokeColor, textureColor, 0.3);
            }
        `;

        let smokeTextureURL = './assets/smoke.jpg';
        let smokeTexture = new TextureLoader().load(smokeTextureURL);

        super({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                aSmokeTexture: {
                    value: smokeTexture
                },
                aShaderParamTexture: {
                    value: paramMap
                }
            }
        });

    }


}