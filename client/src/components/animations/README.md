# Sign-In Animation for AlumniConnect

This directory contains components for creating an interactive sign-in animation experience using GSAP and Three.js.

## Components

### 1. SignInAnimation.jsx

A Three.js-based animation component that displays a 3D graduation cap and particles effect. The animation plays when the user successfully logs in.

### 2. LoginTransition.jsx

A transition wrapper that manages the animation flow and handles the transition between the login screen and the home page.

## How It Works

When a user successfully signs in via Google Authentication:

1. The login success handler shows the transition animation instead of immediately navigating to the home page.
2. The 3D animation plays showing a graduation cap.
3. After the 3D animation completes, a circular wipe transition effect happens.
4. Finally, the user is navigated to the home page.

## Customization Options

### Modifying the 3D Model

If you want to replace the current graduation cap model with a more complex 3D model:

1. Add your GLTF/GLB model file to `/public/models/`
2. Modify the `SignInAnimation.jsx` file to use your model:

```jsx
// Import useGLTF
import { useGLTF } from '@react-three/drei';

// Replace the AnimatedLogo component with:
function ModelComponent({ isAnimating, onAnimationComplete }) {
  const groupRef = useRef();
  const { scene } = useGLTF('/models/your-model.glb');
  
  useEffect(() => {
    // Your animation code here
  }, [isAnimating, onAnimationComplete]);
  
  return <primitive ref={groupRef} object={scene.clone()} scale={[1, 1, 1]} />;
}
```

### Adjusting Animation Timing

Modify the GSAP animations in both components to change timing and easing:

```jsx
// In SignInAnimation.jsx
timeline
  .to(groupRef.current.position, {
    y: 0,
    duration: 1.0, // Change duration (in seconds)
    ease: "elastic.out(1, 0.5)" // Try different easing
  })
```

### Particle Effects

Customize the particles in the background by modifying the `Particles` component in `SignInAnimation.jsx`:

```jsx
// Change particle count
const count = 500; // More particles

// Change particle color
<pointsMaterial size={0.08} color="#ff9500" sizeAttenuation />
```

## Troubleshooting

If the animation doesn't appear:
1. Check browser console for errors
2. Verify that Three.js and GSAP are properly installed
3. Ensure the component is mounted properly

## Resources

- [GSAP Documentation](https://greensock.com/docs/)
- [React Three Fiber Documentation](https://docs.pmnd.rs/react-three-fiber)
- [Three.js Documentation](https://threejs.org/docs/)