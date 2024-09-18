import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
// document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 0, 4)

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshPhongMaterial({ color: 0x175533 })
const cube = new THREE.Mesh(geometry, material)
cube.castShadow = true
scene.add(cube)

const light = new THREE.HemisphereLight(0x5555ff, 0xffaa44, 10)
scene.add(light)

const shadow = new THREE.DirectionalLight(0xffffff)
shadow.position.y = 1
shadow.rotateX = 180
shadow.castShadow = true
scene.add(shadow)

const gGeo = new THREE.PlaneGeometry(10, 10)
const gMat = new THREE.MeshPhongMaterial({ color: 0x229944 })
const ground = new THREE.Mesh(gGeo, gMat)
ground.receiveShadow = true
ground.position.y = -1
ground.rotation.x = -45
scene.add(ground)

const controls = new OrbitControls( camera, renderer.domElement );
controls.update();

function animate() {
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01

    renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)