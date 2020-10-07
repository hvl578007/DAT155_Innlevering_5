"use strict";

import {
    AmbientLight, Color,
    Mesh,
    MeshBasicMaterial,
    MeshPhongMaterial,
    Object3D, PointLight, Sphere,
    SphereGeometry,
    TextureLoader
} from "./build/three.module.js";
import Planet from "./Planet.js";
import SimpleColorMaterial from "./SimpleColorMaterial.js";
import SimpleSmokeMaterial from "./SimpleSmokeMaterial.js";

export default class SolarSystem{
    //Bruker solsystemets constructor for å sette opp planetene. Tar inn Three.js sin scene som parameter, siden vi må legge objekter til i denne
    constructor(scene) {
        //En mesh trenger Geometry (bufferdata, transformasjoner - hvor ligger verticene våre) og Material (hvordan skal objektet fargelegges)

        //Variabler for å opprette geometrien til en kule
        //Se https://threejs.org/docs/index.html#api/en/geometries/SphereGeometry for effekten av width- og heightSegments (åpne Controls oppe til høyre i sphere-vinduet)
        let radius = 5;
        let widthSegments = 64;
        let heightSegments = 64;

        //Opprett geometri for solen vår
        let sunGeometry = new SphereGeometry(radius, widthSegments, heightSegments);

        //Opprett materiale som bestemmer hvordan solen skal fargelegges
        let sunTextureUrl = 'assets/texture_sun.jpg'; //Hvor ligger teksturen?
        let sunTexture = new TextureLoader().load(sunTextureUrl); //Bruker Three.js sin TextureLoader for å laste inn teksturen
        //Opprett en instans av Three.js sin MeshBasicMaterial - et enkelt materiale som ikke tar hensyn til lys
        //(Kommentert ut siden vi heller vil bruke vår egen-lagde shader)
        //let sunMaterial = new MeshBasicMaterial({map: sunTexture});

        //Opprett en instans av vårt egen-lagde Material
        //Parametere: tekstur, og en Three.js Color som skal brukes for å farge teksturen mer - her for å farge den rødt
        let sunMaterial = new SimpleColorMaterial({
            mapInParameters: sunTexture,
            colorInParameters: new Color(0xFF0000)
        });

        sunMaterial = new SimpleSmokeMaterial({
            paramMap: sunTexture
        });

        //Oppretter selve sol-Meshen, som nå består av et Geometry-objekt og et Material-objekt
        this.sun = new Mesh(sunGeometry, sunMaterial);

        //Legge solen til scenen
        scene.add(this.sun);

        //Oppretter et usynlig Object3D som jorden vår skal rotere rundt.
        this.earthOrbitNode = new Object3D();
        //Legger det usynlige objektet som barn av solen

        scene.add(this.earthOrbitNode);

        //Samme prosedyre for jorden vår
        //Last inn tekstur og gi denne til et Material
        let earthTextureUrl = 'assets/texture_earth.jpg';

        //Fikk ikke gjort på forelesning:
        //Bruk av Specular Map - definerer hvor "shiny" forskjellige områder på objektet skal være
        //Bruk av Normal Map - Lager illusjon av høyde og dybde ved at en tekstur brukes for å definere endringer i normalene over objektet
        let earthSpecularMapURL = './assets/earthspec1k.jpg';
        let earthNormalMapURL = './assets/2k_earth_normal_map.png';

        //Forandrer radius - gjør jorden halvparten så stor som solen
        radius = 2.2;

        //Oppretter Mesh for jorden ved å gi Geometry og Material
        //this.earth = new Mesh(earthGeometry, earthMaterial);
        this.earth = new Planet({
            radius: radius,
            planetTextureURL: earthTextureUrl,
            planetSpecularMap: earthSpecularMapURL,
            planetNormalMap: earthNormalMapURL
        });

        this.earthCenterNode = new Object3D();
        this.earthOrbitNode.add(this.earthCenterNode);

        //Flytter jorden litt til høyre for solen
        this.earthCenterNode.position.x = 20;

        this.earthCenterNode.add(this.earth);

        //lagar månen:
        let moonTextureUrl = './assets/2k_moon.jpg';
        
        this.moon = new Planet({
            radius: 0.5,
            planetTextureURL: moonTextureUrl
        });

        this.moonOrbitNode = new Object3D();
        this.moonCenterNode = new Object3D();
        this.moonCenterNode.position.x = 5;

        this.earthCenterNode.add(this.moonOrbitNode);
        this.moonOrbitNode.add(this.moonCenterNode);
        this.moonCenterNode.add(this.moon);

        //lagar mars:
        this.marsOrbitNode = new Object3D();
        this.marsCenterNode = new Object3D();
        let marsTextureURL = './assets/5672_mars_2k_color.jpg';
        let marsNormalURL = './assets/5672_mars_2k_normal.jpg';
        this.mars = new Planet({
            radius: 1.5,
            planetTextureURL: marsTextureURL,
            planetNormalMapURL: marsNormalURL
        });
        //flytter mars ut
        this.marsCenterNode.position.x = 25;

        //legg til mars i scenen
        scene.add(this.marsOrbitNode);
        this.marsOrbitNode.add(this.marsCenterNode);
        this.marsCenterNode.add(this.mars);
        
        //lagar jupiter
        this.jupiterOrbitNode = new Object3D();
        this.jupiterCenterNode = new Object3D();
        let jupiterTextureURL = './assets/2k_jupiter.jpg';
        this.jupiter = new Planet({
            radius: 3.5,
            planetTextureURL: jupiterTextureURL
        });

        this.jupiterCenterNode.position.x = 35;
        scene.add(this.jupiterOrbitNode);
        this.jupiterOrbitNode.add(this.jupiterCenterNode);
        this.jupiterCenterNode.add(this.jupiter);

        //lagar saturn
        this.saturnOrbitNode = new Object3D();
        this.saturnCenterNode = new Object3D();
        let saturnTextureURL = './assets/2k_saturn.jpg';
        this.saturn = new Planet({
            radius: 3.0,
            planetTextureURL: saturnTextureURL
        });

        this.saturnCenterNode.position.x = 45;
        scene.add(this.saturnOrbitNode);
        this.saturnOrbitNode.add(this.saturnCenterNode);
        this.saturnCenterNode.add(this.saturn);

        //lagar neptun
        this.neptuneOrbitNode = new Object3D();
        this.neptuneCenterNode = new Object3D();
        let neptuneTextureURL = './assets/2k_neptune.jpg';
        this.neptune = new Planet({
            radius: 3.0,
            planetTextureURL: neptuneTextureURL
        });

        this.neptuneCenterNode.position.x = 55;
        scene.add(this.neptuneOrbitNode);
        this.neptuneOrbitNode.add(this.neptuneCenterNode);
        this.neptuneCenterNode.add(this.neptune);

        //Det nye Materialet forholder seg til lys, og vil være helt svart.
        //Legger derfor til lys i scenen - PointLight lyser i alle retninger rundt seg
        this.sunLight = new PointLight(0xffffff, 3);
        //Legger lyset som barn av solen
        this.sun.add(this.sunLight);

        //Legger til et mykere AmbientLight for å representere bakgrunnsbelysning - gjør at vi såvidt kan se baksiden av jorden vår
        this.ambientLight = new AmbientLight(0xffffff, 0.05);
        scene.add(this.ambientLight); //Legg bakgrunnslyset til i scenen.

    }

    animate(){
        //Når App-klassen ber solsystemet om å animere seg: roter planetene
        this.rotateObject(this.sun, [0.0, 0.005, 0.0]);
        this.rotateObject(this.earthOrbitNode, [0.0, 0.01, 0.0]);
        this.rotateObject(this.earth, [0.0, 0.02, 0.0]);
        this.rotateObject(this.moonOrbitNode, [0.0, 0.1, 0.0]);
        this.rotateObject(this.marsOrbitNode, [0.0, 0.008, 0.0]);
        this.rotateObject(this.mars, [0.0, 0.015, 0.0]);
        this.rotateObject(this.jupiterOrbitNode, [0.0, 0.001, 0.0]);
        this.rotateObject(this.jupiter, [0.0, 0.013, 0.0]);
        this.rotateObject(this.saturnOrbitNode, [0.0, 0.0008, 0.0]);
        this.rotateObject(this.saturn, [0.0, 0.011, 0.0]);
        this.rotateObject(this.neptuneOrbitNode, [0.0, 0.00009, 0.0]);
        this.rotateObject(this.neptune, [0.0, 0.009, 0.0]);
    }

    rotateObject(object, rotation){
        //Hjelpe-metode for å rotere et objekt
        object.rotation.x += rotation[0];
        object.rotation.y += rotation[1];
        object.rotation.z += rotation[2];
    }

}