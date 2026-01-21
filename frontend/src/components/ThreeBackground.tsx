import { useEffect, useRef } from "react";
import * as THREE from "three";

export function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mountRef.current) {
      return;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0c10, 8, 26);

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 12);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    const point = new THREE.PointLight(0xffb347, 1.2, 30);
    point.position.set(4, 6, 8);
    scene.add(ambient, point);

    const filmGroup = new THREE.Group();
    const frameGeometry = new THREE.PlaneGeometry(1.6, 0.9);
    const frameMaterial = new THREE.MeshStandardMaterial({
      color: 0xffb347,
      transparent: true,
      opacity: 0.18,
      roughness: 0.4,
      metalness: 0.2
    });

    const frames: THREE.Mesh[] = [];
    for (let i = 0; i < 18; i += 1) {
      const frame = new THREE.Mesh(frameGeometry, frameMaterial);
      frame.position.set(
        THREE.MathUtils.randFloatSpread(12),
        THREE.MathUtils.randFloatSpread(7),
        THREE.MathUtils.randFloatSpread(8)
      );
      frame.rotation.set(
        THREE.MathUtils.degToRad(THREE.MathUtils.randFloat(-20, 20)),
        THREE.MathUtils.degToRad(THREE.MathUtils.randFloat(-30, 30)),
        THREE.MathUtils.degToRad(THREE.MathUtils.randFloat(-10, 10))
      );
      filmGroup.add(frame);
      frames.push(frame);
    }
    scene.add(filmGroup);

    const starGeometry = new THREE.BufferGeometry();
    const starCount = 400;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i += 1) {
      starPositions[i * 3] = THREE.MathUtils.randFloatSpread(40);
      starPositions[i * 3 + 1] = THREE.MathUtils.randFloatSpread(20);
      starPositions[i * 3 + 2] = THREE.MathUtils.randFloatSpread(30);
    }
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0x9aa4b2,
      size: 0.08,
      transparent: true,
      opacity: 0.6
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    let frame = 0;
    const onResize = () => {
      if (!mountRef.current) {
        return;
      }
      const { clientWidth, clientHeight } = mountRef.current;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    };
    window.addEventListener("resize", onResize);

    const animate = () => {
      frame += 0.003;
      filmGroup.rotation.y += 0.0008;
      filmGroup.rotation.x = Math.sin(frame * 0.7) * 0.15;
      stars.rotation.y -= 0.0004;
      frames.forEach((mesh, index) => {
        mesh.position.y += Math.sin(frame + index) * 0.001;
      });
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", onResize);
      frameGeometry.dispose();
      frameMaterial.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div className="three-bg" ref={mountRef} aria-hidden="true" />;
}
