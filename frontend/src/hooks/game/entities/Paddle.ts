import * as THREE from "three";

/**
 * Classe représentant un pad du joueur.
 */

export class Paddle {
	public mesh: THREE.Mesh;

	constructor(x: number, tableHeight: number, color = "#3b35ff") {
		const geometry = new THREE.BoxGeometry(10, 10, 59);
		const material = new THREE.MeshStandardMaterial({ color });

		this.mesh = new THREE.Mesh(geometry, material);
		this.mesh.position.set(x, 5, 0);
		this.mesh.castShadow = true;
		this.mesh.userData.type = 'paddle';

		// Optional: limit movement later with this if needed
		this.mesh.userData.limit = tableHeight / 2 - 30;
	}

	addToScene(scene: THREE.Scene) {
		scene.add(this.mesh);
	}
}
