import * as THREE from 'three';

export class Ball {
	public mesh: THREE.Mesh;

	constructor(radius = 5, color = 0xff0000) {
		const geometry = new THREE.SphereGeometry(radius, 32, 32);
		const material = new THREE.MeshStandardMaterial({
			color,
			metalness: 0.6,
			roughness: 0.3,
		});

		this.mesh = new THREE.Mesh(geometry, material);
		this.mesh.castShadow = true;
		this.mesh.position.set(0, radius, 0); // Position initiale
		this.mesh.userData.type = 'ball';
	}

	addToScene(scene: THREE.Scene) {
		scene.add(this.mesh);
	}

	resetPosition() {
		this.mesh.position.set(0, this.mesh.geometry.parameters.radius, 0);
	}
}
