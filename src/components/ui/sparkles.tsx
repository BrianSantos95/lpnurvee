import React, { useId, useMemo, useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { motion, useAnimation } from "framer-motion";

type ParticlesProps = {
    id?: string;
    className?: string;
    background?: string;
    particleSize?: number;
    minSize?: number;
    maxSize?: number;
    speed?: number;
    particleColor?: string;
    particleDensity?: number;
};

// Engine is a singleton — init once globally
let engineReady = false;
let enginePromise: Promise<void> | null = null;

function getEngine() {
    if (!enginePromise) {
        enginePromise = initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            engineReady = true;
        });
    }
    return enginePromise;
}

export const SparklesCore = (props: ParticlesProps) => {
    const {
        id,
        className,
        background,
        minSize,
        maxSize,
        speed,
        particleColor,
        particleDensity,
    } = props;

    const [init, setInit] = useState(engineReady);
    const controls = useAnimation();
    const generatedId = useId();

    useEffect(() => {
        if (engineReady) return;
        getEngine().then(() => setInit(true));
    }, []);

    const particlesLoaded = async (container?: Container) => {
        if (container) {
            controls.start({
                opacity: 1,
                transition: { duration: 1 },
            });
        }
    };

    // Memoize options object — evita re-criar a cada render
    const options = useMemo(() => ({
        background: {
            color: { value: background || "#000000" },
        },
        fullScreen: { enable: false, zIndex: 1 },
        // Limitar FPS a 30 reduz CPU usage drasticamente em mobile
        fpsLimit: 30,
        interactivity: {
            events: {
                onClick: { enable: false, mode: "push" as const },
                onHover: { enable: false, mode: "repulse" as const },
                resize: true as any,
            },
            modes: {
                push: { quantity: 2 },
                repulse: { distance: 200, duration: 0.4 },
            },
        },
        particles: {
            color: {
                value: particleColor || "#ffffff",
            },
            move: {
                direction: "none" as const,
                enable: true,
                outModes: { default: "out" as const },
                random: false,
                speed: { min: 0.1, max: speed || 0.6 },
                straight: false,
            },
            number: {
                density: {
                    enable: true,
                    width: 400,
                    height: 400,
                },
                value: Math.min(particleDensity || 60, 80), // cap at 80
            },
            opacity: {
                value: { min: 0.1, max: 0.8 },
                animation: {
                    enable: true,
                    speed: speed || 2,
                    sync: false,
                    mode: "auto" as const,
                    startValue: "random" as const,
                    destroy: "none" as const,
                },
            },
            shape: { type: "circle" as const },
            size: {
                value: {
                    min: minSize || 0.5,
                    max: maxSize || 1.4,
                },
            },
        },
        detectRetina: true,
    }), [background, minSize, maxSize, speed, particleColor, particleDensity]);

    return (
        <motion.div animate={controls} className={["opacity-0", className].filter(Boolean).join(" ")}>
            {init && (
                <Particles
                    id={id || generatedId}
                    className="h-full w-full"
                    particlesLoaded={particlesLoaded}
                    options={options}
                />
            )}
        </motion.div>
    );
};
