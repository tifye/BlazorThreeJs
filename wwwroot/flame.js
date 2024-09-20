import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

window.RegisterOnAnimationFrame = RegisterOnAnimationFrame
function RegisterOnAnimationFrame(dotNetHelper) {
    let lastFrame = Date.now()

    function f() {
        const curFrame = Date.now()
        const delta = curFrame - lastFrame
        lastFrame = curFrame
        dotNetHelper.invokeMethodAsync("OnAnimationFrame", delta)
        requestAnimationFrame(f)
    }
    requestAnimationFrame(f)
}


let renderer = null
window.CreateRenderer = CreateRenderer
function CreateRenderer() {
    if (renderer !== null) {
        console.error("only one renderer can be created")
    }

    renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    document.body.appendChild(renderer.domElement)
    console.log("renderer created")
}

window.RenderScene = RenderScene
function RenderScene(sceneId, cameraId) {
    const scene = scenes.get(sceneId)
    if (scene === undefined) {
        console.error(`could not find scene with id ${sceneId}`)
        return
    }

    const camera = cameras.get(cameraId)
    if (camera === undefined) {
        console.error(`could not find camera with id ${cameraId}`)
        return
    }

    if (renderer === null) {
        console.error("renderer not set")
        return
    }

    console.log(`rendering scene ${sceneId} with camera ${cameraId}`)
    renderer.setAnimationLoop(() => renderer.render(scene, camera))
}

const scenes = new Map()
window.CreateScene = CreateScene
function CreateScene(id) {
    const scene = new THREE.Scene()
    scenes.set(id, scene)
    console.log(`scene created with id ${id}`)
}

const lights = new Map()
window.CreateHemisphereLight = CreateHemisphereLight
function CreateHemisphereLight(id, sceneId, sky, ground, intensity) {
    const scene = scenes.get(sceneId)
    if (scene === undefined) {
        console.error(`could not find scene with id ${sceneId}`)
        return
    }

    const light = new THREE.HemisphereLight(sky, ground, intensity)
    lights.set(id, light)
    console.log(`created hemisphere light with id ${id}`)

    scene.add(light)
    console.log(`added light ${id} to scene ${sceneId}`)
}

window.CreateDirectionalLight = CreateDirectionalLight
function CreateDirectionalLight(id, sceneId, color, intensity) {
    const scene = scenes.get(sceneId)
    if (scene === undefined) {
        console.error(`could not find scene with id ${sceneId}`)
        return
    }

    const light = new THREE.DirectionalLight(color, intensity)
    light.castShadow = true
    lights.set(id, light)
    console.log(`created driectional light with id ${id}`)

    scene.add(light)
    console.log(`added light ${id} to scene ${sceneId}`)
}

window.SetLightPosition = SetLightPosition
function SetLightPosition(id, x, y, z) {
    const light = lights.get(id)
    if (light === undefined) {
        console.error(`could not find light with id ${light}`)
        return
    }

    light.position.x = x
    light.position.y = y
    light.position.z = z
    console.log(`light position set to ${x} ${y} ${z}`)
}

window.SetLightRotate = SetLightRotate
function SetLightRotate(id, x, y, z) {
    const light = lights.get(id)
    if (light === undefined) {
        console.error(`could not find light with id ${light}`)
        return
    }

    light.rotateX = x
    light.rotateY = y
    light.rotateZ = z
    console.log(`light rotate set to ${x} ${y} ${z}`)
}

let controls;
const cameras = new Map()
window.CreateCamera = CreateCamera
function CreateCamera(id) {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 0, 4)
    cameras.set(id, camera)
    console.log(`camera created with id ${id}`)

    controls = new OrbitControls( camera, renderer.domElement )
    controls.update()
}

const geomtries = new Map()
window.CreateBoxGeometry = CreateBoxGeometry
function CreateBoxGeometry(id, width, height, depth) {
    const geometry = new THREE.BoxGeometry(width, height, depth)
    geomtries.set(id, geometry)
    console.log(`box geometry created with id ${id}`)
}

window.CreateSphereGeometry = CreateSphereGeometry
function CreateSphereGeometry(id, radius, widthSegs, heightSegs) {
    const geomtry = new THREE.SphereGeometry(radius, widthSegs, heightSegs)
    geomtries.set(id, geomtry)
    console.log(`sphere geometry created with id ${id}`)
}

const materials = new Map()
window.CreateMeshPhongMaterial = CreateMeshPhongMaterial
function CreateMeshPhongMaterial(id, color) {
    const material = new THREE.MeshPhongMaterial({ color })
    materials.set(id, material)
    console.log(`phong material created with id ${id} and color ${color}`)
}

const meshs = new Map()
window.CreateMesh = CreateMesh
function CreateMesh(id, geoId, matId, castShadow) {
    const geo = geomtries.get(geoId)
    if (geo === undefined) {
        console.error(`could not find geometry with id ${geoId}`)
        return
    }

    const mat = materials.get(matId)
    if (mat === undefined) {
        console.error(`could not find material with id ${matId}`)
        return        
    }

    const mesh = new THREE.Mesh(geo, mat)
    mesh.castShadow = castShadow
    meshs.set(id, mesh)
    console.log(`mesh created with id ${id}`)

    return {
        mesh,
        SetPosition: function(x, y, z) {
            mesh.position.x = x
            mesh.position.y = y
            mesh.position.z = z
            //console.log(`mesh ${id} position set to ${x} ${y} ${z}`)
        },
        SetRotation: function(x, y, z) {
            mesh.rotation.x = x
            mesh.rotation.y = y
            mesh.rotation.z = z
        }
    }
}

window.AddMeshToScene = AddMeshToScene
function AddMeshToScene(meshId, sceneId) {
    const scene = scenes.get(sceneId)
    if (scene === undefined) {
        console.error(`could not find scene with id ${sceneId}`)
        return
    }

    const mesh = meshs.get(meshId)
    if (mesh === undefined) {
        console.error(`could not find mesh with id ${meshId}`)
        return
    }

    scene.add(mesh)
    console.log(`added mesh ${meshId} to scene ${sceneId}`)
}