import { animate, useInView, useIsomorphicLayoutEffect } from "framer-motion";
import { FC, useRef } from "react";

const AnimatedCounter: FC<{ to: number; round_off: boolean }> = ({ to, round_off }) => {
    const from = 0;
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true });

    useIsomorphicLayoutEffect(() => {
        const element = ref.current;

        if (!element) return;
        if (!inView) return;

        element.textContent = String(from);
        if (window.matchMedia("(prefers-reduced-motion)").matches || to === 0) {
            element.textContent = String(to);
            return;
        }

        const controls = animate(from, to, {
            duration: 0.7,
            ease: "easeOut",
            onUpdate(value) {
                element.textContent = value.toFixed(round_off ? 0 : 2);
            },
        });

        return () => {
            controls.stop();
        };
    }, [ref, inView, from, to]);

    return <span ref={ref} />;
};

export default AnimatedCounter;
