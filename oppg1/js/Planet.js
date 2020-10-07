"use strict";

import { Mesh, MeshPhongMaterial, SphereGeometry, TextureLoader } from "./build/three.module.js";

export default class Planet extends Mesh {

    constructor({
        radius = 1.0,
        widthSegments = 64,
        heigthSegments = 64,
        planetTextureURL = '',
        shininess = 1.0,
        planetSpecularMapURL = null,
        planetNormalMapURL = null
    })
    {
        let planetGeometry = new SphereGeometry(radius, widthSegments, heigthSegments);

        let planetTexture = new TextureLoader().load(planetTextureURL);

        let planetSpecularMap = null;

        if (planetSpecularMapURL !== null) {
            planetSpecularMap = new TextureLoader().load(planetSpecularMapURL);
        }

        let planetNormalMap = null;

        if (planetNormalMapURL !== null) {
            planetNormalMap = new TextureLoader().load(planetNormalMapURL);
        }

        let planetMaterial = new MeshPhongMaterial({
            map: planetTexture,
            shininess: shininess,
            specular: planetSpecularMap,
            normalMap: planetNormalMap
        });

        super(planetGeometry, planetMaterial);
    }
}