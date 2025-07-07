"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { motion } from "motion/react";

export default function Text3DAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Flowmap system
    class Flowmap {
      renderer: THREE.WebGLRenderer;
      size: number;
      aspect: number;
      mouse: THREE.Vector2;
      velocity: THREE.Vector2;
      renderTargetA: THREE.WebGLRenderTarget;
      renderTargetB: THREE.WebGLRenderTarget;
      scene: THREE.Scene;
      camera: THREE.OrthographicCamera;
      mesh: THREE.Mesh;
      material: THREE.ShaderMaterial;
      uniform: { value: THREE.Texture };

      constructor(gl: THREE.WebGLRenderer) {
        this.renderer = gl;
        this.size = 256;
        this.aspect = 1;
        this.mouse = new THREE.Vector2(-1, -1);
        this.velocity = new THREE.Vector2();

        // Create render targets
        this.renderTargetA = new THREE.WebGLRenderTarget(this.size, this.size, {
          format: THREE.RGBAFormat,
          type: THREE.FloatType,
          magFilter: THREE.LinearFilter,
          minFilter: THREE.LinearFilter,
          wrapS: THREE.ClampToEdgeWrapping,
          wrapT: THREE.ClampToEdgeWrapping,
        });

        this.renderTargetB = new THREE.WebGLRenderTarget(this.size, this.size, {
          format: THREE.RGBAFormat,
          type: THREE.FloatType,
          magFilter: THREE.LinearFilter,
          minFilter: THREE.LinearFilter,
          wrapS: THREE.ClampToEdgeWrapping,
          wrapT: THREE.ClampToEdgeWrapping,
        });

        // Setup flowmap scene
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        // Flowmap shader
        const flowmapVertex = `
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = vec4(position, 1.0);
                    }
                `;

        const flowmapFragment = `
                    precision highp float;
                    uniform sampler2D tMap;
                    uniform float uFalloff;
                    uniform float uAlpha;
                    uniform float uDissipation;
                    uniform float uAspect;
                    uniform vec2 uMouse;
                    uniform vec2 uVelocity;
                    varying vec2 vUv;

                    void main() {
                        vec4 color = texture2D(tMap, vUv) * uDissipation;
                        
                        vec2 cursor = vUv - uMouse;
                        cursor.x *= uAspect;
                        
                        vec3 stamp = vec3(uVelocity * vec2(1, -1), 1.0 - pow(1.0 - min(1.0, length(uVelocity)), 3.0));
                        float falloff = smoothstep(uFalloff, 0.0, length(cursor)) * uAlpha;
                        
                        color.rgb = mix(color.rgb, stamp, vec3(falloff));
                        
                        gl_FragColor = color;
                    }
                `;

        this.material = new THREE.ShaderMaterial({
          vertexShader: flowmapVertex,
          fragmentShader: flowmapFragment,
          uniforms: {
            tMap: { value: this.renderTargetA.texture },
            uFalloff: { value: 0.25 },
            uAlpha: { value: 1.2 },
            uDissipation: { value: 0.985 },
            uAspect: { value: 1.0 },
            uMouse: { value: new THREE.Vector2() },
            uVelocity: { value: new THREE.Vector2() },
          },
        });

        const geometry = new THREE.PlaneGeometry(2, 2);
        this.mesh = new THREE.Mesh(geometry, this.material);
        this.scene.add(this.mesh);

        this.uniform = { value: this.renderTargetA.texture };
      }

      update() {
        this.material.uniforms.uMouse.value.copy(this.mouse);
        this.material.uniforms.uVelocity.value.copy(this.velocity);
        this.material.uniforms.uAspect.value = this.aspect;

        // Swap render targets
        const temp = this.renderTargetA;
        this.renderTargetA = this.renderTargetB;
        this.renderTargetB = temp;

        this.material.uniforms.tMap.value = this.renderTargetA.texture;
        this.uniform.value = this.renderTargetB.texture;

        // Render to target
        this.renderer.setRenderTarget(this.renderTargetB);
        this.renderer.render(this.scene, this.camera);
        this.renderer.setRenderTarget(null);
      }
    }

    // Main shaders
    const vertexShader = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position, 1.0);
            }
        `;

    const fragmentShader = `
            precision highp float;
            uniform sampler2D tWater;
            uniform sampler2D tFlow;
            uniform float uTime;
            uniform vec2 uResolution;
            varying vec2 vUv;

            void main() {
                // R and G values are velocity in the x and y direction
                // B value is the velocity length
                vec3 flow = texture2D(tFlow, vUv).rgb;

                // Use flow to adjust the uv lookup of a texture
                vec2 uv = gl_FragCoord.xy / uResolution.xy;
                
                // Base distortion
                vec2 distortion = flow.xy * 0.08;
                
                // RGB channel separation based on flow intensity
                float flowIntensity = length(flow.xy);
                float rgbOffset = flowIntensity * 0.0009; // Much stronger RGB separation with base offset
                
                // Sample each channel with different offsets for more dramatic effect
                float r = texture2D(tWater, uv + distortion + vec2(rgbOffset * 1.5, rgbOffset * 0.5)).r;
                float g = texture2D(tWater, uv + distortion).g;
                float b = texture2D(tWater, uv + distortion - vec2(rgbOffset * 1.5, -rgbOffset * 0.5)).b;
                
                // Combine the channels
                vec3 tex = vec3(r, g, b);

                // Just show the distorted texture without oscillation
                gl_FragColor = vec4(tex, 1.0);
            }
        `;

    // Create flowmap
    const flowmap = new Flowmap(renderer);

    // Create geometry and material
    const geometry = new THREE.PlaneGeometry(2, 2);

    // Load water texture
    const textureLoader = new THREE.TextureLoader();
    const waterTexture = textureLoader.load("/bg.png"); // Using your existing bg.png
    waterTexture.wrapS = THREE.RepeatWrapping;
    waterTexture.wrapT = THREE.RepeatWrapping;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        tWater: { value: waterTexture },
        tFlow: flowmap.uniform,
        uResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
      },
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Mouse tracking
    const mouse = new THREE.Vector2(-1, -1);
    const velocity = new THREE.Vector2();
    let lastTime = 0;
    const lastMouse = new THREE.Vector2();
    let velocityNeedsUpdate = false;

    const updateMouse = (e: MouseEvent | TouchEvent) => {
      let x: number, y: number;

      if ("touches" in e && e.touches.length) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
      } else {
        x = (e as MouseEvent).clientX;
        y = (e as MouseEvent).clientY;
      }

      // Get mouse value in 0 to 1 range, with y flipped
      mouse.set(x / window.innerWidth, 1 - y / window.innerHeight);

      // Calculate velocity
      if (!lastTime) {
        lastTime = performance.now();
        lastMouse.set(x, y);
        return;
      }

      const deltaX = x - lastMouse.x;
      const deltaY = y - lastMouse.y;
      lastMouse.set(x, y);

      const time = performance.now();
      const delta = Math.max(14, time - lastTime);
      lastTime = time;

      velocity.x = deltaX / delta;
      velocity.y = deltaY / delta;
      velocityNeedsUpdate = true;
    };

    // Event listeners
    const isTouchCapable = "ontouchstart" in window;
    if (isTouchCapable) {
      window.addEventListener("touchstart", updateMouse, false);
      window.addEventListener("touchmove", updateMouse, false);
    } else {
      window.addEventListener("mousemove", updateMouse, false);
    }

    // Resize handler
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      renderer.setSize(width, height);
      flowmap.aspect = width / height;
      material.uniforms.uResolution.value.set(width, height);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // Animation loop
    const animate = (time: number) => {
      requestAnimationFrame(animate);

      // Reset velocity when mouse not moving
      if (!velocityNeedsUpdate) {
        mouse.set(-1, -1);
        velocity.set(0, 0);
      }
      velocityNeedsUpdate = false;

      // Update flowmap
      flowmap.mouse.copy(mouse);
      flowmap.velocity.lerp(velocity, velocity.length() ? 0.7 : 0.15);
      flowmap.update();

      // Update time uniform
      material.uniforms.uTime.value = time * 0.001;

      renderer.render(scene, camera);
    };

    animate(0);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (isTouchCapable) {
        window.removeEventListener("touchstart", updateMouse, false);
        window.removeEventListener("touchmove", updateMouse, false);
      } else {
        window.removeEventListener("mousemove", updateMouse, false);
      }

      renderer.dispose();
      material.dispose();
      geometry.dispose();
      waterTexture.dispose();
      flowmap.renderTargetA.dispose();
      flowmap.renderTargetB.dispose();
    };
  }, []);

  return (
    <main className="h-screen w-screen bg-black overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: "block" }}
      />
      <div className="absolute h-screen w-screen bg-transparent z-10 top-0 left-0 flex items-center justify-center">
        <motion.img
          src="/gameboy.png"
          className="h-1/2 w-max"
          initial={{ y: 0 }}
          animate={{ y: [-10, 10] }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>
    </main>
  );
}
