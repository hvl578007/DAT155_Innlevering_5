"use strict";

import { Mesh, MeshPhongMaterial, SphereGeometry, TextureLoader } from "./build/three.module.js";

export default class Planet extends Mesh {

    constructor({
        radius = 1.0,
        widthSegments = 64,
        heigthSegments = 64,
        planetTextureURL = '',
        shininess = 1.0,
        planetSpecularMap = "",
        planetNormalMap = ""
    })
    {
        let planetGeometry = new SphereGeometry(radius, widthSegments, heigthSegments);

        let planetTexture = new TextureLoader().load(planetTextureURL);
        let planetMaterial = new MeshPhongMaterial({
            map: planetTexture,
            shininess: shininess,
        });
        

        super(planetGeometry, planetMaterial);
    }
}