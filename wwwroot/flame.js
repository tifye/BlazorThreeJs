import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js'

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


window.CreateRenderer = CreateRenderer
function CreateRenderer(canvas) {
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: canvas,
        alpha: true,
    })
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    console.log("renderer created")

    return {
        obj: renderer,
        RenderScene: function (scene, camera) {
            renderer.setAnimationLoop(() => renderer.render(scene.obj, camera.obj))
        }
    }
}

const scenes = new Map()
window.CreateScene = CreateScene
function CreateScene(id) {
    const scene = new THREE.Scene()
    scenes.set(id, scene)
    console.log(`scene created with id ${id}`)

    return {
        obj: scene,
        Add: function (objRep) {
            console.log("Adding a", objRep.obj.type, "to the scene")
            scene.add(objRep.obj)
        }
    }
}

window.CreatePointLight = CreatePointLight
function CreatePointLight(color, intensity, distance, decay, castShadow) {
    const light = new THREE.PointLight(color, intensity, distance, decay)
    light.castShadow = castShadow
    return {
        obj: light,
        SetPosition: function (x, y, z) {
            light.position.set(x, y, z)
        },
        SetRotation: function (x, y, z) {
            light.rotation.set(x, y, z)
        }
    }
}

const lights = new Map()
window.CreateHemisphereLight = CreateHemisphereLight
function CreateHemisphereLight(sky, ground, intensity) {
    const light = new THREE.HemisphereLight(sky, ground, intensity)
    return {
        obj: light,
        SetPosition: function (x, y, z) {
            light.position.x = x
            light.position.y = y
            light.position.z = z
            console.log(`light position set to ${x} ${y} ${z}`)
        },
        SetRotation: function (x, y, z) {
            light.rotateX = x
            light.rotateY = y
            light.rotateZ = z
            console.log(`light rotate set to ${x} ${y} ${z}`)
        }
    }
}

window.CreateDirectionalLightHelper = CreateDirectionalLightHelper
function CreateDirectionalLightHelper(light, size) {
    const helper = new THREE.DirectionalLightHelper(light.obj, size)
    return {
        obj: helper
    }
}

window.CreateDirectionalLight = CreateDirectionalLight
function CreateDirectionalLight(id, color, intensity) {

    const light = new THREE.DirectionalLight(color, intensity)
    light.castShadow = true
    light.shadow.camera.top = 200
    light.shadow.camera.bottom = - 200
    light.shadow.camera.left = - 200
    light.shadow.camera.right = 200
    light.shadow.camera.near = 0.1
    light.shadow.camera.far = 200
    light.shadow.radius = 5
    lights.set(id, light)
    console.log(`created driectional light with id ${id}`)

    return {
        obj: light,
        SetPosition: function (x, y, z) {
            light.position.set(x, y, z)
            console.log(`light position set to ${x} ${y} ${z}`)
        },
        SetRotation: function (x, y, z) {
            light.rotation.set(x, y, z)
            console.log(`light rotate set to ${x} ${y} ${z}`)
        }
    }
}

window.CreateSpotLightHelper = CreateSpotLightHelper
function CreateSpotLightHelper(light, liveUpdate) {
    const helper = new THREE.SpotLightHelper(light.obj)

    if (liveUpdate) {
        function f() {
            helper.update()
            requestAnimationFrame(f)
        }
        requestAnimationFrame(f)
    }

    return {
        obj: helper
    }
}

window.CreateSpotLight = CreateSpotLight
function CreateSpotLight(color, intensity, distance, angle, penumbra, decay, castShadow) {
    const light = new THREE.SpotLight(color, intensity, distance, angle, penumbra, decay)
    light.castShadow = castShadow
    light.shadow.camera.top = 200
    light.shadow.camera.bottom = -200
    light.shadow.camera.left = -200
    light.shadow.camera.right = 200
    light.shadow.camera.near = 0.1
    light.shadow.camera.far = 200

    console.log(`created spot light`)

    return {
        obj: light,
        SetPosition: function (x, y, z) {
            light.position.set(x, y, z)
        },
        SetRotation: function (x, y, z) {
            light.rotation.set(x, y, z)
        }
    }
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
    cameras.set(id, camera)
    console.log(`camera created with id ${id}`)
    return {
        obj: camera,
        SetPosition: function (x, y, z) {
            console.log("SetPosition", x, y, z)
            camera.position.set(x, y, z)
        },
        SetRotation: function (x, y, z) {
            console.log("SetRotation", x, y, z)
            camera.rotation.set(x, y, z)
        }
    }
}

window.CreateOrbitControls = CreateOrbitControls
function CreateOrbitControls(camera, renderer, autoRotate) {
    controls = new OrbitControls(camera.obj, renderer.obj.domElement)
    controls.update()
    controls.autoRotate = autoRotate
    if (controls.autoRotate) {
        function f() {
            controls.update()
            requestAnimationFrame(f)
        }
        requestAnimationFrame(f)
    }
    return {
        obj: controls
    }
}

const geomtries = new Map()
window.CreateBoxGeometry = CreateBoxGeometry
function CreateBoxGeometry(id, width, height, depth) {
    const geometry = new THREE.BoxGeometry(width, height, depth)
    geomtries.set(id, geometry)
    console.log(`box geometry created with id ${id}`)
    return {
        obj: geometry
    }
}

window.CreateSphereGeometry = CreateSphereGeometry
function CreateSphereGeometry(id, radius, widthSegs, heightSegs) {
    const geometry = new THREE.SphereGeometry(radius, widthSegs, heightSegs)
    geomtries.set(id, geometry)
    console.log(`sphere geometry created with id ${id}`)
    return {
        obj: geometry
    }
}

window.CreatePlaneGeometry = CreatePlaneGeometry
function CreatePlaneGeometry(width, height) {
    const geometry = new THREE.PlaneGeometry(width, height)
    console.log(`plane geometry created`)
    return {
        obj: geometry
    }
}

window.CreateMeshPhongMaterial = CreateMeshPhongMaterial
function CreateMeshPhongMaterial(color) {
    const material = new THREE.MeshPhongMaterial({ color })
    return {
        obj: material
    }
}

window.CreateMeshToonMaterial = CreateMeshToonMaterial
function CreateMeshToonMaterial(color) {
    const material = new THREE.MeshToonMaterial({ color })
    return {
        obj: material
    }
}

window.CreateMeshLambertMaterial = CreateMeshLambertMaterial
function CreateMeshLambertMaterial(color) {
    const material = new THREE.MeshLambertMaterial({ color })
    return {
        obj: material
    }
}


const meshs = new Map()
window.CreateMesh = CreateMesh
function CreateMesh(id, geoHolder, matHolder, castShadow) {
    const geo = geoHolder.obj
    const mat = matHolder.obj

    const mesh = new THREE.Mesh(geo, mat)
    mesh.castShadow = castShadow
    mesh.receiveShadow = true
    meshs.set(id, mesh)
    console.log(`mesh created with id ${id}`)

    return {
        obj: mesh,
        SetPosition: function (x, y, z) {
            mesh.position.set(x, y, z)
        },
        SetRotation: function (x, y, z) {
            mesh.rotation.set(x, y, z)
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

window.LoadFBXObject = LoadFBXObject
async function LoadFBXObject(caller, url) {
    const fbxloader = new FBXLoader()

    return new Promise((res, rej) => {
        fbxloader.load(
            url,
            (model) => {
                console.log(model)
                model.castShadow = true
                res({
                    obj: model,
                    SetScale: function (x, y, z) {
                        console.log("SetScale", x, y, z)
                        model.scale.set(x, y, z)
                    },
                    SetMaterial: function (matHolder) {
                        const material = matHolder.obj
                        model.traverse(function (child) {
                            if (!child.isMesh) {
                                return
                            }
                            child.material = material
                            child.castShadow = true
                        })
                    },
                    SetPosition: function (x, y, z) {
                        model.position.set(x, y, z)
                    },
                    SetRotation: function (x, y, z) {
                        model.rotation.set(x, y, z)
                    }
                })
            },
            (xhr) => {
                // Can report this back to C#
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
                if (xhr.loaded - xhr.total < 0.00001) {
                    caller.invokeMethodAsync("OnModelLoaded")
                }
            },
            (error) => {
                console.log(error)
                rej(error)
            }
        )
    })
}